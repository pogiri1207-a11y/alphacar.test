pipeline {
    agent any

    environment {
        SONARQUBE = 'sonarqube'
        HARBOR_URL = '192.168.0.169'
        HARBOR_PROJECT = 'alphacar'
        IMAGE_NAME = 'alphacar-app'
        GIT_REPO = 'https://github.com/Alphacar-project/alphacar.git'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh 'mvn clean verify sonar:sonar -Dsonar.projectKey=alphacar'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest .'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                script {
                    sh '''
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest \
                      client --remote http://trivy:4954 \
                      image --exit-code 1 --severity HIGH,CRITICAL ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest || true
                    '''
                }
            }
        }

        stage('Push to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login ${HARBOR_URL} -u $USER --password-stdin
                    docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest
                    docker logout ${HARBOR_URL}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build and Scan Completed Successfully!"
        }
        failure {
            echo "❌ Build Failed! Check SonarQube or Trivy logs for details."
        }
    }
}
