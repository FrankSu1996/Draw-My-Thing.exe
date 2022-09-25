/* groovylint-disable CompileStatic */
pipeline {
    agent none
    stages {
        // stage('Prune Docker data') {
        //     agent any
        //     steps {
        //         sh 'docker system prune -a --volumes -f'
        //     }
        // }
        stage('Build client') {
            agent any
            steps {
                echo 'Building Profile Management ui...'
                sh 'docker build -t draw-my-thing -f client/Dockerfile'
            }
        }
        stage('Run end to end tests') {
            agent any
            steps {
                echo 'Running e2e tests...'
            }
        }
        stage('Deploy to IBM Cloud') {
            agent any
            steps {
                echo 'Deploying to IBM Cloud Container Registry'
            }
        }
    }
}
