# DevOps Todo App - CI/CD Pipeline

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-24.x-blue)](https://www.docker.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red)](https://www.jenkins.io/)
[![Selenium](https://img.shields.io/badge/Selenium-4.27-yellow)](https://www.selenium.dev/)

A full-stack Todo application with automated testing and CI/CD pipeline for **DevOps Assignment-3**.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- ✅ Create, Read, Update, Delete (CRUD) todos
- ✅ Toggle todo completion status
- ✅ Real-time statistics (total, completed, pending)
- ✅ Persistent storage with MongoDB
- ✅ Responsive modern UI with glassmorphism
- ✅ 12 comprehensive automated test cases
- ✅ Automated CI/CD pipeline with Jenkins
- ✅ Containerized deployment with Docker

## 🛠 Technology Stack

### Frontend & Backend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Modern CSS with gradients and animations
- **API:** Next.js API Routes

### Database
- **Database:** MongoDB 7.0
- **Driver:** MongoDB Node.js Driver

### DevOps & Testing
- **Containerization:** Docker & Docker Compose
- **CI/CD:** Jenkins Pipeline
- **Testing:** Selenium WebDriver 4.27
- **Test Framework:** Mocha + Chai
- **Browser:** Chrome (Headless)

### Deployment
- **Cloud:** AWS EC2
- **OS:** Ubuntu 22.04 LTS

## 📁 Project Structure

```
devops-todo-app/
├── src/
│   ├── app/
│   │   ├── api/todos/          # API routes for CRUD operations
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Main page component
│   └── lib/
│       └── mongodb.js          # MongoDB connection
├── tests/
│   ├── package.json            # Test dependencies
│   ├── selenium.test.js        # 12 Selenium test cases
│   └── test-config.js          # Test configuration
├── docs/
│   ├── AWS-EC2-SETUP.md        # EC2 setup guide
│   ├── JENKINS-SETUP.md        # Jenkins configuration guide
│   ├── DEPLOYMENT-GUIDE.md     # Deployment instructions
│   └── ASSIGNMENT-REPORT.md    # Assignment report template
├── Dockerfile                  # Application Docker image
├── Dockerfile.test             # Test Docker image
├── docker-compose.yml          # Docker Compose configuration
├── Jenkinsfile                 # Jenkins pipeline definition
├── package.json                # Application dependencies
├── next.config.js              # Next.js configuration
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- MongoDB (or use Docker container)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/devops-todo-app.git
   cd devops-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start MongoDB (using Docker)**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build and start all services**
   ```bash
   docker-compose up -d mongodb app
   ```

2. **View logs**
   ```bash
   docker-compose logs -f app
   ```

3. **Run tests**
   ```bash
   docker-compose --profile test up tests
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 📚 Documentation

Comprehensive guides are available in the `docs/` directory:

- **[AWS EC2 Setup](docs/AWS-EC2-SETUP.md)** - Step-by-step EC2 instance setup
- **[Jenkins Setup](docs/JENKINS-SETUP.md)** - Jenkins installation and configuration
- **[Deployment Guide](docs/DEPLOYMENT-GUIDE.md)** - Complete deployment workflow
- **[Assignment Report](docs/ASSIGNMENT-REPORT.md)** - Report template for submission

## 🔄 CI/CD Pipeline

The Jenkins pipeline automates the entire workflow:

```
┌──────────┐   ┌───────┐   ┌────────┐   ┌──────┐   ┌─────────┐
│ Checkout │ → │ Build │ → │ Deploy │ → │ Test │ → │ Cleanup │
└──────────┘   └───────┘   └────────┘   └──────┘   └─────────┘
```

### Pipeline Stages

1. **Checkout** - Clone code from GitHub
2. **Build** - Build Docker images for app and tests
3. **Deploy** - Start MongoDB and application containers
4. **Test** - Run 12 Selenium test cases in headless Chrome
5. **Cleanup** - Stop all containers

### Triggers

- **GitHub Webhook** - Automatic trigger on push
- **Manual** - Trigger from Jenkins dashboard

### Notifications

Email notifications sent for:
- ✅ Success - All tests passed
- ❌ Failure - Pipeline error
- ⚠️ Unstable - Some tests failed

## 🧪 Testing

### Test Suite

12 comprehensive automated test cases:

1. Page Load and Title Verification
2. UI Elements Visibility
3. Empty State Display
4. Create New Todo
5. Create Multiple Todos
6. Toggle Todo Completion
7. Edit Todo
8. Delete Todo
9. Form Validation - Empty Input
10. Statistics Display
11. Database Persistence
12. Keyboard Navigation

### Running Tests

**Locally:**
```bash
cd tests
npm install
npm test
```

**In Docker:**
```bash
docker-compose --profile test up tests
```

**In Jenkins:**
- Tests run automatically in the pipeline
- Results sent via email

## 🌐 Deployment

### AWS EC2 Deployment

1. **Set up EC2 instance** (see [AWS-EC2-SETUP.md](docs/AWS-EC2-SETUP.md))
2. **Install Jenkins** (see [JENKINS-SETUP.md](docs/JENKINS-SETUP.md))
3. **Configure pipeline** (see [DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md))

### Deployment URL

```
http://<YOUR_EC2_PUBLIC_IP>:3000
```

## 📝 Assignment Submission

### Required Submissions

1. **Google Form** - Deployment URL and GitHub URLs
2. **GitHub Repository** - Add instructor as collaborator
3. **Report** - Complete assignment report with screenshots

### Workflow for Instructor

1. Application deployed on EC2
2. Docker containers stopped after providing URL
3. Instructor makes changes to GitHub
4. Webhook triggers Jenkins pipeline
5. Tests run automatically
6. Email sent to instructor with results

## 🤝 Contributing

This is an assignment project. For instructor access:

1. Repository visibility: **Public**
2. Collaborator: **[Instructor's GitHub username]**
3. Webhook configured for automatic pipeline triggers

## 📄 License

This project is created for educational purposes as part of DevOps Assignment-3.

## 👤 Author

**[Your Name]**
- Registration: [Your Reg. No.]
- Course: CSC483 – DevOps
- Instructor: Qasim Malik

## 🙏 Acknowledgments

- COMSATS University Islamabad
- Department of Computer Science
- DevOps Course Instructor

---

**Note:** Replace placeholders (`YOUR_USERNAME`, `Your Name`, etc.) with actual values before submission.
