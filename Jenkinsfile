
pipeline{
    agent any
    stages{
        stage('Clone'){
            steps{
                git branch: 'main', 
                url: 'https://github.com/tranphuc8a/Knowledge-Sharing.git'
            }
        }

        stage('Build Images') {
            steps {
                script {
                    sh 'docker build -t backend ./app/back-end/'
                    sh 'docker build -t frontend ./app/front-end/'
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    // Đẩy các image lên Docker Hub
                    sh 'docker tag backend nhungthisope123/backend'
                    sh 'docker tag frontend nhungthisope123/frontend'
                    // sh 'docker push nhungthisope123/backend'
                    // sh 'docker push nhungthisope123/frontend'
                    // ...
                    withDockerRegistry([ credentialsId: "acad2336-7d11-4ff3-97ea-7e4841343f6a", url: "https://index.docker.io/v1/" ]) {
                        sh "docker push nhungthisope123/backend"
                        sh "docker push nhungthisope123/frontend"
                    }
                }
            }
        }
    }
}

// pipeline {
//     agent any

//     stages {
//         stage('Pull Code') {
//             steps {
//                 git 'https://github.com/your-repo.git'
//             }
//         }

//         stage('Build Images') {
//             steps {
//                 script {
//                     // Xây dựng các image từ các folder của app con trong project
//                     sh 'docker build -t image1 ./app1'
//                     sh 'docker build -t image2 ./app2'
//                     // ...
//                 }
//             }
//         }

//         stage('Push Images') {
//             steps {
//                 script {
//                     // Đẩy các image lên Docker Hub
//                     sh 'docker push your-dockerhub-username/image1'
//                     sh 'docker push your-dockerhub-username/image2'
//                     // ...
//                 }
//             }
//         }

//         stage('Build Containers') {
//             steps {
//                 script {
//                     // Xây dựng các container từ file docker compose
//                     sh 'docker-compose up -d'
//                 }
//             }
//         }

//         stage('Publish Front-end') {
//             steps {
//                 script {
//                     // Public app front-end bằng Serveo
//                     sh 'ssh -R your-serveo-subdomain:80:localhost:80 serveo.net'
//                 }
//             }
//         }
//     }
// }

