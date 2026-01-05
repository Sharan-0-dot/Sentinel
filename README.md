
# Sentinel – Reimbursement Fraud Detection System

Sentinel is a backend system built to process employee reimbursement claims and detect fraudulent submissions. The project focuses on real-world reimbursement workflows such as receipt validation, duplicate detection, policy enforcement, and fraud scoring.

The system is designed using a microservices approach and emphasizes clean service boundaries, data integrity, and practical fraud detection techniques.

---

## What the system does

* Accepts reimbursement requests along with receipt images
* Extracts text from receipts using OCR
* Validates submitted claim data against extracted receipt data
* Detects duplicate or reused receipts using historical data
* Enforces employee-specific reimbursement policies
* Assigns a fraud score and categorizes each request by risk level

---

## Architecture Overview

The project consists of two Spring Boot microservices:

### Reimbursement Service

This is the core service responsible for:

* Receiving reimbursement requests (JSON + receipt image)
* Uploading receipt images to cloud storage
* Running OCR and extracting invoice details
* Executing fraud detection logic
* Managing request status and fraud results

### Employee Policy Management Service

This service handles:

* Employee creation and management
* Policy assignment and reimbursement limits
* Providing policy information to the reimbursement service during fraud checks

---

## Fraud Detection Logic

Fraud detection is implemented as a scoring engine where multiple checks contribute to a final fraud score.

The engine performs:

* Validation between submitted claim data and OCR-extracted receipt data (amount, vendor, date)
* Duplicate detection using historical reimbursement records
* Image similarity checks using perceptual hashing (pHash)
* Text similarity checks on OCR output
* Policy limit validation based on employee reimbursement limits

Each check adds points to the overall fraud score, which is then mapped to a fraud level.

---

## Fraud Levels

* **LOW** – Minimal risk
* **MEDIUM** – Suspicious but acceptable
* **HIGH** – Likely fraud
* **CONFIRMED** – Strong fraud indicators detected

Only low and medium risk requests are stored for future historical comparisons.

---

## Reimbursement Workflow

1. A reimbursement request is submitted with claim details and a receipt image
2. The receipt image is uploaded to cloud storage
3. OCR extracts raw text from the receipt
4. Extracted data is validated against submitted claim data
5. Fraud detection engine runs all validation and similarity checks
6. A fraud score and fraud level are assigned
7. Request status is updated and stored in the database

---

## Tech Stack

* Java
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Tesseract OCR (Docker container)
* REST APIs
* Docker

---

## Project Structure (High Level)

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

## Running the Project Locally

Requirements:

* Java 17+
* PostgreSQL
* Docker (for OCR service)
* Maven

Steps:

1. Start PostgreSQL and configure database properties
2. Run the Tesseract OCR Docker container
3. Start the Employee Policy Management Service
4. Start the Reimbursement Service
5. Use Postman or any REST client to submit reimbursement requests

---

## Planned Improvements

* Docker Compose setup for running all services together
* Kubernetes deployment
* Asynchronous fraud processing
* Admin dashboard for monitoring fraud cases

---

## Notes

This project was built to simulate a real reimbursement fraud detection system, focusing on backend logic, data validation, and system design rather than UI. It is designed as a production-ready service and can be directly integrated into real organizational reimbursement workflows.
