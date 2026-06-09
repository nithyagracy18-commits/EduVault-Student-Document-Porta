# EduVault – Smart Student Document Portal

## Overview

EduVault is an AI-powered student document management system designed to help students securely store, organize, verify, and understand their academic documents. The platform goes beyond traditional cloud storage by integrating OCR, Artificial Intelligence, document verification, and contextual guidance into a single unified solution.

Students often manage multiple documents such as marks cards, degree certificates, internship letters, government IDs, transcripts, and skill certifications throughout their academic journey. Existing storage platforms provide only file storage and retrieval, leaving students without intelligent assistance regarding document usage, verification, and completeness.

EduVault addresses this challenge by providing a secure digital vault enhanced with AI-driven document classification, contextual guidance, integrity verification, and smart notifications.

---

## Problem Statement

Students face difficulties in securely managing and organizing academic documents required for placements, higher education admissions, scholarships, internships, and visa applications.

Existing solutions such as Google Drive, OneDrive, and DigiLocker offer basic storage capabilities but lack:

* Intelligent document understanding
* Automated classification
* Contextual usage guidance
* Document completeness validation
* Secure authenticity verification

EduVault bridges this gap by combining secure document storage with AI-powered assistance and verification mechanisms.

---

## Key Features

### Secure Document Vault

* Upload and store academic documents securely
* Support for PDF, JPG, JPEG, and PNG files
* Category-based document organization
* Easy retrieval and management

### OCR-Based Text Extraction

* Extracts text from scanned documents and images
* Uses Pytesseract OCR for document digitization
* Supports academic certificates and official records

### AI-Powered Document Classification

* Integrates Gemini AI for intelligent document analysis
* Automatically identifies document types
* Generates document summaries and usage explanations

### Contextual Usage Guidance

* Helps students understand where and when documents are required
* Placement documentation guidance
* Scholarship application support
* Higher education admission assistance
* Internship and visa documentation guidance

### Document Completeness Checker

* Verifies whether required documents are available for a specific goal
* Identifies missing documents
* Provides recommendations to students

### SHA-256 Integrity Verification

* Generates a unique cryptographic fingerprint for every document
* Detects tampering and unauthorized modifications
* Ensures document authenticity

### QR Code Verification

* Generates unique QR codes linked to document verification
* Enables quick authenticity checks
* Simplifies document validation processes

### Smart Notifications

* Reminders for document renewals
* Placement season alerts
* Scholarship application deadlines
* Important academic document updates

### Community Knowledge Sharing

* Student tips and guidance feed
* Knowledge-sharing platform for academic opportunities
* Peer support system

---

## System Architecture

The system follows a modular architecture consisting of:

### Authentication Module

* Student registration
* Secure login
* OTP-based verification
* Session management

### Document Vault Module

* Document upload
* Storage management
* Categorization
* Retrieval and sharing

### AI Intelligence Engine

* OCR processing
* Gemini AI integration
* Document classification
* Usage guidance generation

### Security and Verification Module

* SHA-256 hashing
* QR code generation
* Tamper detection
* Audit logging

### Community Module

* Notifications
* Tips feed
* Student engagement features

---

## Technology Stack

### Frontend

* Streamlit
* HTML
* CSS

### Backend

* Python
* Flask

### Database

* SQLite

### Artificial Intelligence

* Google Gemini API

### OCR

* Pytesseract OCR

### Security

* SHA-256 Hashing
* QR Code Generation

### Deployment

* Render
* Vercel

---

## Project Workflow

1. Student uploads a document.
2. OCR extracts text from the document.
3. Gemini AI analyzes and classifies the document.
4. The system generates contextual guidance.
5. SHA-256 hash is generated for verification.
6. QR code is created for authenticity validation.
7. Document is securely stored in the vault.
8. Student can retrieve, verify, and manage documents anytime.

---

## Results

### Classification Accuracy

* Documents Tested: 40
* Correctly Classified: 37
* Overall Accuracy: 92.5%

### Security Verification

* Tampered Documents Detected: 100%
* False Positives: 0%

### Performance

* Average Upload Time: 1.8–2.4 seconds
* SHA-256 Generation: Less than 50 ms
* Database Query Response: Less than 100 ms

---

## Future Enhancements

* Aadhaar-based Authentication
* Mobile Application Development
* Regional Language Support
* University ERP Integration
* Cloud Storage Expansion
* Advanced Analytics Dashboard
* Blockchain-based Credential Verification
* AI Resume Builder
* Smart Career Recommendation Engine

---

## Learning Outcomes

Through this project, the following concepts were explored:

* Artificial Intelligence Integration
* Optical Character Recognition
* Secure Document Management
* Cryptographic Hashing
* QR Code Authentication
* Full Stack Web Development
* Database Management
* REST API Development
* Cloud Deployment

---

## Contributors

Developed as a Mini Project under the School of Computer Science and Engineering, REVA University.

### Team Members

* Student 1
* Student 2
* Student 3
* Student 4

### Guide

Faculty Guide – School of Computer Science and Engineering, REVA University

---

## License

This project is developed for academic and educational purposes.
