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
            steps { git branch: 'main', url: "${GIT_REPO}" }
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
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=alphacar-backend -Dsonar.projectName=alphacar-backend -Dsonar.sources=backend -Dsonar.host.url=${SONAR_URL} -Dsonar.sourceEncoding=UTF-8"
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=alphacar-frontend -Dsonar.projectName=alphacar-frontend -Dsonar.sources=frontend -Dsonar.host.url=${SONAR_URL} -Dsonar.sourceEncoding=UTF-8"
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    // 1. Backend MSA (7개 서비스)
                    def backendServices = ['aichat', 'community', 'drive', 'mypage', 'quote', 'search', 'main']
                    backendServices.each { service ->
                        echo "🔥 Building Backend Service: ${service}"
                        sh "docker build --build-arg APP_NAME=${service} -f backend/Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/alphacar-${service}:${BACKEND_VERSION} backend/"
                    }

                    // 2. Frontend (통합 이미지 1개)
                    echo "🔥 Building Frontend Service"
                    sh "docker build -f frontend/Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION} frontend/"

                    // 3. Nginx
                    echo "🔥 Building Nginx"
                    sh "docker build -f nginx.Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${NGINX_IMAGE}:${BACKEND_VERSION} ."

                    // 4. HAProxy
                    echo "🔥 Building HAProxy"
                    sh "docker build -f haproxy.Dockerfile -t ${HARBOR_URL}/${HARBOR_PROJECT}/${HAPROXY_IMAGE}:${BACKEND_VERSION} ."
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
}
