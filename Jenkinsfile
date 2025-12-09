pipeline {
    agent any

    environment {
        SONARQUBE = 'sonarqube'
        SONAR_URL = 'http://192.168.0.160:9000'
        HARBOR_URL = '192.168.0.169'
        HARBOR_PROJECT = 'alphacar-project'
        FRONTEND_IMAGE = 'alphacar-frontend'
        NGINX_IMAGE = 'alphacar-nginx'
        HAPROXY_IMAGE = 'alphacar-haproxy'
        GIT_REPO = 'https://github.com/Alphacar-project/alphacar.git'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Read Version') {
            steps {
                script {
                    def backendVersion = readFile('backend/version.txt').trim()
                    def frontendVersion = readFile('frontend/version.txt').trim()
                    env.BACKEND_VERSION = backendVersion
                    env.FRONTEND_VERSION = frontendVersion
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv("${SONARQUBE}") {
                        // 백엔드 분석
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=alphacar-backend -Dsonar.projectName=alphacar-backend -Dsonar.sources=backend -Dsonar.host.url=${SONAR_URL} -Dsonar.sourceEncoding=UTF-8"
                        // 프론트엔드 분석
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=alphacar-frontend -Dsonar.projectName=alphacar-frontend -Dsonar.sources=frontend -Dsonar.host.url=${SONAR_URL} -Dsonar.sourceEncoding=UTF-8"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // 1. Backend MSA (7개)
                    def backendServices = ['aichat', 'community', 'drive', 'mypage', 'quote', 'search', 'main']
                    backendServices.each { service ->
                        sh "docker build --build-arg APP_NAME=${service} -f backend/Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/alphacar-${service}:${BACKEND_VERSION} backend/"
                    }
                    
                    // 2. Frontend (1개)
                    sh "docker build -f frontend/Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION} frontend/"
                    
                    // 3. Nginx & HAProxy
                    sh "docker build -f nginx.Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${NGINX_IMAGE}:${BACKEND_VERSION} ."
                    sh "docker build -f haproxy.Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${HAPROXY_IMAGE}:${BACKEND_VERSION} ."
                }
            }
        }

        // 👇👇👇 [여기 추가됨!] 트리비 보안 스캔 👇👇👇
        stage('Trivy Security Scan') {
            steps {
                script {
                    // 1. 백엔드 이미지 스캔
                    def backendServices = ['aichat', 'community', 'drive', 'mypage', 'quote', 'search', 'main']
                    backendServices.each { service ->
                        echo "🛡️ Scanning Backend Service: ${service}"
                        // exit-code 0: 취약점 있어도 빌드 실패 안 함 (보고만 함)
                        // exit-code 1: 취약점 있으면 빌드 멈춤 (필요시 변경)
                        sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 0 --severity HIGH,CRITICAL ${HARBOR_URL}/${HARBOR_PROJECT}/alphacar-${service}:${BACKEND_VERSION}"
                    }

                    // 2. 프론트엔드 이미지 스캔
                    echo "🛡️ Scanning Frontend Service"
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 0 --severity HIGH,CRITICAL ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION}"
                }
            }
        }

        stage('Push to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    script {
                        sh 'echo $PASS | docker login ${HARBOR_URL} -u $USER --password-stdin'
                        
                        def backendServices = ['aichat', 'community', 'drive', 'mypage', 'quote', 'search', 'main']
                        backendServices.each { service ->
                             sh "docker push ${HARBOR_URL}/${HARBOR_PROJECT}/alphacar-${service}:${BACKEND_VERSION}"
                        }
                        sh "docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION}"
                        sh "docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${NGINX_IMAGE}:${BACKEND_VERSION}"
                        sh "docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${HAPROXY_IMAGE}:${BACKEND_VERSION}"
                        
                        sh "docker logout ${HARBOR_URL}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Build & Release Completed Successfully! 🎉"
        }
        failure {
            echo "❌ Build Failed! Check logs for details."
        }
    }
}
