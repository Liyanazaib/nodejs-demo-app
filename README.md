# Automating Code Deployment with CI/CD (GitHub Actions & Docker)

This repository implements an end-to-end **Continuous Integration and Continuous Deployment (CI/CD)** pipeline for a containerized Node.js web application, built as part of the . 

Whenever code is pushed to the `main` branch, GitHub Actions automatically tests the application, builds a portable Docker image, and publishes it to DockerHub without manual intervention.

---

## What This Project Teaches

Building this pipeline demonstrates five foundational DevOps engineering concepts:

### 1. Eliminating Manual Deployment & *"It Works on My Machine"*
* **The Problem:** Running code manually on a local computer and transferring files by hand is slow, error-prone, and dependent on local operating system configurations.
* **The Lesson:** By packaging the application (`app.js`) and its exact Node.js runtime (`node:20-alpine`) inside a **Docker image**, the application runs identically on a developer's laptop, a cloud runner, or a production server.

### 2. Continuous Integration (CI) & Automated Quality Gates
* **Test-First Automation:** Before building or shipping anything, the pipeline runs `npm test` (`node test.js`) using Node's built-in `assert` module.
* **Exit Codes as Gatekeepers:** Commands communicate success (`Exit Code 0`) or failure (`Exit Code 1`). Using `needs: test` in the workflow creates a strict quality gate—if a bug breaks the test, the pipeline halts immediately and blocks broken code from ever reaching DockerHub.

### 3. Ephemeral Cloud Runners & Infrastructure Automation
* **How GitHub Actions Works:** Pushing code to `main` triggers an event listener (`on: push`) that provisions temporary, clean Linux virtual machines (`ubuntu-latest` **runners**) in the cloud.
* **Jobs vs. Steps:** Work is organized into isolated **jobs** (`test` and `build-and-push`), each running sequential **steps** (`actions/checkout`, `actions/setup-node`, `docker/login-action`, `docker/build-push-action`). Once a job finishes, the virtual machine is wiped and destroyed, guaranteeing a clean environment for every future build.

### 4. Efficient Containerization with Docker
* **Layer Caching:** Copying `package*.json` and running `npm install` *before* copying application source code (`COPY . .`) allows Docker to cache dependency layers, making subsequent CI/CD builds significantly faster.
* **Clean Build Context:** Using `.dockerignore` prevents local folders like `node_modules` and `.git` from bloating the image or slowing down uploads.

### 5. Securing Credentials with Secrets & Access Tokens
* **Zero Hardcoded Passwords:** Instead of exposing credentials in public YAML files or using a primary account password, the workflow authenticates with DockerHub using a scoped **Personal Access Token (PAT)** stored inside encrypted **GitHub Repository Secrets** (`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`), which GitHub automatically masks in execution logs.

---

## Pipeline Workflow (`test → build → push`)

```text
Developer (git push to main)
        │
        ▼
┌───────────────────────────────┐
│   Job 1: test (CI)            │
│   • Checkout code             │
│   • Setup Node.js v20         │
│   • Run npm install & npm test│
└───────────────┬───────────────┘
                │ (Only if tests pass)
                ▼
┌───────────────────────────────┐
│   Job 2: build-and-push (CD)  │
│   • Checkout code             │
│   • Login to DockerHub        │
│   • Build & push Docker image │
└───────────────┬───────────────┘
                │
                ▼
   DockerHub (liyanazaib/nodejs-demo-app:latest)
```

---

## Repository Structure

```text
nodejs-demo-app/
├── .github/workflows/main.yml   # GitHub Actions CI/CD workflow configuration
├── screenshots/                 # Proof of successful Actions run and DockerHub push
├── .dockerignore                # Excludes local files from Docker build context
├── app.js                       # Node.js HTTP web server (port 3000)
├── Dockerfile                   # Instructions to build the container image
├── package.json                 # Application metadata and start/test scripts
├── test.js                      # Automated assertion test script
└── README.md                    # Project learnings and documentation
```

---

## How to Run the Published Image

Anyone can pull and run the automated build directly from DockerHub:

```bash
docker pull liyanazaib/nodejs-demo-app:latest
docker run -p 3000:3000 liyanazaib/nodejs-demo-app:latest
```

Visit `http://localhost:3000` in your browser to view the response.

---
