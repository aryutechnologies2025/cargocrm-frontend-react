pipeline {
    agent any

    environment {
        APP_DIR = "/var/www/cargocrm/cargocrm-frontend-react"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aryutechnologies2025/cargocrm-frontend-react.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                cd $APP_DIR
                npm ci --legacy-peer-deps
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                cd $APP_DIR
                npm run build
                '''
            }
        }

        stage('Reload Nginx') {
            steps {
                sh '''
                sudo systemctl reload nginx
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend Deployment Successful'
        }
        failure {
            echo 'Frontend Deployment Failed'
        }
    }
}

