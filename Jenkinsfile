pipeline {
    agent any

    environment {
        SONARQUBE = 'sonarqube'
        SONAR_URL = 'http://192.168.0.160:9000'
        HARBOR_URL = '192.168.0.169'
        HARBOR_PROJECT = 'alphacar-project'
        BACKEND_IMAGE = 'alphacar-backend'
        FRONTEND_IMAGE = 'alphacar-frontend'
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

        stage('Increment Version') {
            steps {
                script {
                    def backendVersion = readFile('backend/version.txt').trim()
                    def frontendVersion = readFile('frontend/version.txt').trim()

                    def (majorB, minorB, patchB) = backendVersion.tokenize('.')
                    def (majorF, minorF, patchF) = frontendVersion.tokenize('.')

                    def newBackendVersion = "${majorB}.${minorB.toInteger() + 1}.0"
                    def newFrontendVersion = "${majorF}.${minorF.toInteger() + 1}.0"

                    writeFile file: 'backend/version.txt', text: newBackendVersion
                    writeFile file: 'frontend/version.txt', text: newFrontendVersion

                    sh """
                    git config --global user.name 'jenkins-bot'
                    git config --global user.email 'jenkins@alphacar.local'
                    git add backend/version.txt frontend/version.txt
                    git commit -m 'ci: bump version to backend:${newBackendVersion}, frontend:${newFrontendVersion}' || true
                    git push origin main || true
                    """

                    env.BACKEND_VERSION = newBackendVersion
                    env.FRONTEND_VERSION = newFrontendVersion
                }
            }
        }

        // 4️⃣ 여기가 수정된 부분입니다! (Backend)
        stage('SonarQube - Backend') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv("${SONARQUBE}") {
                        dir('backend') {
                            sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=alphacar-backend \
                              -Dsonar.projectName=alphacar-backend \
                              -Dsonar.sources=. \
                              -Dsonar.language=ts \
                              -Dsonar.host.url=${SONAR_URL} \
                              -Dsonar.login=alphacar-token \
                              -Dsonar.sourceEncoding=UTF-8
                            """
                        }
                    }
                }
            }
        }

        // 5️⃣ 여기도 수정되었습니다! (Frontend)
        stage('SonarQube - Frontend') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv("${SONARQUBE}") {
                        dir('frontend') {
                            sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=alphacar-frontend \
                              -Dsonar.projectName=alphacar-frontend \
                              -Dsonar.sources=. \
                              -Dsonar.language=js \
                              -Dsonar.host.url=${SONAR_URL} \
                              -Dsonar.login=alphacar-token \
                              -Dsonar.sourceEncoding=UTF-8
                            """
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${HARBOR_URL}/${HARBOR_PROJECT}/${BACKEND_IMAGE}:${BACKEND_VERSION} ./backend
                docker build -t ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION} ./frontend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest \
                  client --remote http://trivy:4954 image --exit-code 1 \
                  --severity HIGH,CRITICAL ${HARBOR_URL}/${HARBOR_PROJECT}/${BACKEND_IMAGE}:${BACKEND_VERSION} || true

                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest \
                  client --remote http://trivy:4954 image --exit-code 1 \
                  --severity HIGH,CRITICAL ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION} || true
                '''
            }
        }

        stage('Push to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login ${HARBOR_URL} -u $USER --password-stdin
                    docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${BACKEND_IMAGE}:${BACKEND_VERSION}
                    docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${FRONTEND_IMAGE}:${FRONTEND_VERSION}
                    docker logout ${HARBOR_URL}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Release Completed Successfully! 🎉"
        }
        failure {
            echo "❌ Build Failed! Check SonarQube or Trivy logs for details."
        }
    }
}
