pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Mainsource') {
                    sh 'npm ci --legacy-peer-deps'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Mainsource') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    rm -rf /var/www/cargocrm/cargocrm-frontend-react/dist/*
                    cp -r Mainsource/dist/* /var/www/cargocrm/cargocrm-frontend-react/dist/
                '''
            }
        }

        stage('Reload Nginx') {
            steps {
                sh 'sudo systemctl reload nginx'
            }
        }
    }
}
