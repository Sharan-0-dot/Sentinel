# Sentinel – Reimbursement Fraud Detection System

Sentinel is a backend system designed to process employee reimbursement claims and detect fraudulent submissions. The project models real-world reimbursement workflows such as receipt validation, duplicate detection, policy enforcement, and fraud scoring using a microservices architecture.

The system focuses on backend correctness, service isolation, and production-style deployment practices.

---

## What the System Does

* Accepts reimbursement requests with structured claim data and receipt images
* Extracts text from receipts using OCR
* Validates submitted claim data against OCR-extracted receipt information
* Detects duplicate or reused receipts using historical records
* Enforces employee-specific reimbursement policies
* Assigns a fraud score and categorizes each request by risk level

---

## Architecture Overview

Sentinel is built using two independent Spring Boot microservices with clear service boundaries.

### Reimbursement Service

This is the core service responsible for:

* Receiving reimbursement requests (JSON + receipt image)
* Uploading receipt images to cloud storage
* Running OCR on receipts using Tesseract
* Executing fraud detection and scoring logic
* Managing reimbursement request lifecycle and results

### Employee Policy Management Service

This service handles:

* Employee creation and management
* Policy assignment and reimbursement limits
* Exposing policy data to the reimbursement service during fraud checks

---

## Fraud Detection Logic

Fraud detection is implemented as a scoring engine where multiple independent checks contribute to a final fraud score.

The engine performs:

* Validation between submitted claim data and OCR-extracted receipt data (amount, vendor, date)
* Duplicate receipt detection using historical reimbursement data
* Image similarity detection using perceptual hashing (pHash)
* Text similarity checks on OCR output
* Policy limit validation based on employee-specific reimbursement rules

Each check contributes weighted points to the overall fraud score, which is mapped to a fraud risk level.

---

## Fraud Levels

* **LOW** – Minimal risk
* **MEDIUM** – Suspicious but acceptable
* **HIGH** – Likely fraud
* **CONFIRMED** – Strong fraud indicators detected

Only **LOW** and **MEDIUM** risk requests are persisted for future historical comparisons.

---

## Reimbursement Workflow

1. A reimbursement request is submitted with claim details and a receipt image
2. The receipt image is uploaded to cloud storage
3. OCR extracts raw text from the receipt
4. Extracted data is validated against submitted claim data
5. The fraud detection engine runs all validation and similarity checks
6. A fraud score and fraud level are assigned
7. Request status and results are stored in the database

---

## Tech Stack

* Java
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Tesseract OCR (Docker container)
* REST APIs
* Docker
* Kubernetes (Minikube)

---

## Deployment Status

The system has been successfully deployed and tested on a local **Kubernetes cluster** using Minikube, with an additional **AWS EC2**-based demo deployment for external access and evaluation.

AWS Demo Deployment

A UI demonstration environment of Sentinel has been deployed on an AWS EC2 instance to showcase the system’s workflows and administrative capabilities.

This deployment highlights:

Realistic production-style service interaction

Policy-driven employee management

End-to-end reimbursement request processing

Fraud scoring and classification logic

⚠️ Note:
This AWS deployment represents a demonstration environment.
The complete production architecture—including OCR pipelines, fraud detection logic, and policy enforcement—is implemented in the backend services.

🔗 Live Demo

Demo URL:

[http://sentinel.com](http://13.235.9.206:3000/)


The demo is intended for functional evaluation and architectural understanding rather than performance benchmarking.

Organizations or teams interested in extending, integrating, or deploying Sentinel in a production environment can reach out via the contact information below

Deployment characteristics:

* Each microservice runs in its own Kubernetes Deployment
* Internal service-to-service communication via ClusterIP services
* External access via NodePort with port-forwarding
* Configuration managed using ConfigMaps and Secrets
* Secure database connectivity using mounted SSL certificates
* Tesseract OCR runs as a separate containerized service

This deployment closely mirrors real-world cloud-native production setups.

---

## Project Structure

```
Sentinel
├── Reimbursement_Service
│   ├── Controller
│   ├── Service
│   ├── FraudDetectionEngine
│   ├── Entity
│   ├── Repository
│   └── DTO
│
├── Employee_Policy_Service
│   ├── Controller
│   ├── Service
│   ├── Entity
│   └── Repository
│
└── README.md
```


---

## Running the Project Locally (Non-Kubernetes)

### Requirements

* Java 17+
* PostgreSQL
* Docker (for OCR service)
* Maven

### Steps

1. Start PostgreSQL and configure database credentials
2. Run the Tesseract OCR Docker container
3. Start the Employee Policy Management Service
4. Start the Reimbursement Service
5. Use Postman or any REST client to submit reimbursement requests

---

## Planned Improvements

* Kubernetes Ingress configuration
* Asynchronous fraud processing
* Admin dashboard for fraud monitoring and analytics
* Improved fraud scoring tunability

---

## Notes

Sentinel was built to simulate a **real-world reimbursement fraud detection backend**, focusing on backend architecture, data validation, and deployment correctness rather than UI.

The system is designed to be production-ready and can be directly extended or integrated into enterprise reimbursement workflows.

---
