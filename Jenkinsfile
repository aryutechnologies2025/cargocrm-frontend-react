pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci --legacy-peer-deps'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    rm -rf /var/www/cargocrm/cargocrm-frontend-react/dist/*
                    cp -r dist/* /var/www/cargocrm/cargocrm-frontend-react/dist/
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
