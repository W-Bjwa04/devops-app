pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'devops-todo-app'
        DOCKER_TEST_IMAGE = 'devops-todo-tests'
        APP_PORT = '3000'
        MONGODB_PORT = '27017'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
                script {
                    // Get commit author email
                    env.AUTHOR_EMAIL = sh(
                        script: 'git log -1 --pretty=format:%ae',
                        returnStdout: true
                    ).trim()
                    env.AUTHOR_NAME = sh(
                        script: 'git log -1 --pretty=format:%an',
                        returnStdout: true
                    ).trim()
                    env.COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=format:%s',
                        returnStdout: true
                    ).trim()
                    echo "Commit Author: ${env.AUTHOR_NAME} <${env.AUTHOR_EMAIL}>"
                }
                echo "Building from branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                script {
                    // Build application image
                    sh 'docker build -t ${DOCKER_IMAGE}:latest -f Dockerfile .'
                    
                    // Build test image
                    sh 'docker build -t ${DOCKER_TEST_IMAGE}:latest -f Dockerfile.test .'
                }
                echo 'Docker images built successfully'
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo 'Deploying application with Docker Compose...'
                script {
                    // Stop any existing containers
                    sh 'docker-compose down || true'
                    
                    // Start Application and MongoDB
                    sh 'docker-compose up -d app mongodb'
                    
                    // Wait for service to be healthy
                    echo 'Waiting for application to be ready...'
                    sh 'sleep 15'
                    
                    // Check if service is running
                    sh 'docker-compose ps'
                }
                echo 'Application deployed successfully'
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium test suite...'
                script {
                    try {
                        // Get the actual network name created by docker-compose
                        def networkName = sh(
                            script: 'docker network ls --filter "name=todo-network" --format "{{.Name}}"',
                            returnStdout: true
                        ).trim()
                        
                        echo "Using Docker network: ${networkName}"
                        
                        // Run tests in container
                        sh """
                            docker run --rm \
                                --network ${networkName} \
                                -e APP_URL=http://app:3000 \
                                -e HEADLESS=true \
                                ${DOCKER_TEST_IMAGE}:latest
                        """
                        echo 'All tests passed successfully! ✓'
                    } catch (Exception e) {
                        echo 'Some tests failed! ✗'
                        currentBuild.result = 'UNSTABLE'
                        error('Test execution failed')
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            emailext (
                subject: "✓ Jenkins Build SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Successful!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Branch:</strong> ${env.GIT_BRANCH}</p>
                    <p><strong>Commit:</strong> ${env.GIT_COMMIT}</p>
                    <p><strong>Commit Author:</strong> ${env.AUTHOR_NAME}</p>
                    <p><strong>Commit Message:</strong> ${env.COMMIT_MSG}</p>
                    
                    <h3>Test Results</h3>
                    <p style="color: green;">All Selenium tests passed successfully!</p>
                    
                    <h3>Deployment Status</h3>
                    <p style="color: green;">Application is now running and accessible!</p>
                    <p><strong>Application URL:</strong> http://&lt;EC2-IP&gt;:3000</p>
                    <p>Containers will remain active until manually stopped.</p>
                    
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    
                    <hr>
                    <p><em>DevOps Assignment-3 - Automated CI/CD Pipeline</em></p>
                """,
                to: "${env.AUTHOR_EMAIL}",
                mimeType: 'text/html',
                attachLog: true
            )
        }
        
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "✗ Jenkins Build FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Failed!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Branch:</strong> ${env.GIT_BRANCH}</p>
                    <p><strong>Commit:</strong> ${env.GIT_COMMIT}</p>
                    <p><strong>Commit Author:</strong> ${env.AUTHOR_NAME}</p>
                    <p><strong>Commit Message:</strong> ${env.COMMIT_MSG}</p>
                    
                    <h3>Failure Details</h3>
                    <p style="color: red;">The pipeline encountered an error during execution.</p>
                    <p>Please check the build logs for detailed error information.</p>
                    
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                    
                    <hr>
                    <p><em>DevOps Assignment-3 - Automated CI/CD Pipeline</em></p>
                """,
                to: "${env.AUTHOR_EMAIL}",
                mimeType: 'text/html',
                attachLog: true
            )
        }
        
        unstable {
            echo 'Pipeline completed with test failures!'
            emailext (
                subject: "⚠ Jenkins Build UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Unstable - Tests Failed</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Branch:</strong> ${env.GIT_BRANCH}</p>
                    <p><strong>Commit:</strong> ${env.GIT_COMMIT}</p>
                    <p><strong>Commit Author:</strong> ${env.AUTHOR_NAME}</p>
                    <p><strong>Commit Message:</strong> ${env.COMMIT_MSG}</p>
                    
                    <h3>Test Results</h3>
                    <p style="color: orange;">Some Selenium tests failed!</p>
                    <p>Please review the test logs to identify failing test cases.</p>
                    
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                    
                    <hr>
                    <p><em>DevOps Assignment-3 - Automated CI/CD Pipeline</em></p>
                """,
                to: "${env.AUTHOR_EMAIL}",
                mimeType: 'text/html',
                attachLog: true
            )
        }
        
        always {
            echo 'Cleaning up...'
            script {
                // Containers will keep running after build
                echo 'Containers remain active for continuous deployment'
                echo 'Application accessible at: http://<EC2-IP>:3000'
            }
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
