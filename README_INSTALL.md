# VisionOps Final Capstone Release - Installation Guide

Welcome to the VisionOps Platform. This guide will walk you through setting up the complete Edge ML architecture (FastAPI Backend, React Frontend, and the ARB Presentation Deck) on a fresh office laptop.

## Prerequisites

Before starting, ensure the following are installed on the target machine:
1. **Python 3.10+** (Required for the OpenCV ML Inference engine)
2. **Node.js v20+** and **npm** (Required for the React Frontend and Presentation Deck)
3. **Git** (To clone this repository)

---

## Step 1: Clone the Repository

Once you push this code to your new GitHub repository, you will clone it onto the office laptop.

Open a terminal (PowerShell or Git Bash) on the office laptop and run:
```bash
git clone <YOUR_NEW_GITHUB_REPOSITORY_URL>
cd capstone_project
```

---

## Step 2: Set Up the ML Backend (FastAPI + OpenCV)

The backend runs the SSD MobileNet V2 object detection engine on the CPU.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a Python Virtual Environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the Virtual Environment:
   - **Windows (PowerShell):** `.venv\Scripts\activate`
   - **Mac/Linux:** `source .venv/bin/activate`
4. Install Python Dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Download the Pre-trained TensorFlow Model:
   *(This script automatically fetches the required `frozen_inference_graph.pb` file from the cloud so you don't have to push large binary files to GitHub)*
   ```bash
   python download_models.py
   ```
6. Start the Backend Server:
   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000
   ```
   *The API will be available at http://127.0.0.1:8000*

Leave this terminal window open and running.

---

## Step 3: Set Up the React Frontend Dashboard

The frontend is the main SOC application used for live monitoring and analytics.

1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd capstone_project/frontend
   ```
2. Install Node Dependencies:
   ```bash
   npm install
   ```
3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   *The application will open at http://localhost:5173*

---

## Step 4: Set Up the ARB Presentation Deck

The final presentation is also built as a React application to demonstrate UI/UX competency and handle interactive elements.

1. Open a **new** terminal window and navigate to the presentation folder:
   ```bash
   cd capstone_project/presentation_deck
   ```
2. Install Node Dependencies:
   ```bash
   npm install
   ```
3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   *The presentation will open at http://localhost:5174*

---

## Presenting the Project (Quick Tips)

When it's time to present to the Architecture Review Board:
- Ensure the **Backend** is running in Terminal 1.
- Ensure the **Frontend** is running in Terminal 2.
- Ensure the **Presentation Deck** is running in Terminal 3.
- Share your screen showing the Presentation Deck.
- Press **`O`** (Letter O) during the presentation to see the 20-slide grid overview.
- Press **`P`** to secretly open the Presenter Dashboard on a second monitor (contains the 100-question SME bank and Code logic breakdowns).
- When it's time for the demo, switch tabs to the running React Frontend (http://localhost:5173).
