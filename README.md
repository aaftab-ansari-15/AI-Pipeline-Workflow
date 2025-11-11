# AI Pipeline Workflow: Node Abstraction System

**Live Working Link:** [Click here]()
**Project Demo:** [Watch on Loom](https://www.loom.com/share/877b2ce110eb47ec9155eefb20890d49)

---

## Overview

- The application allows users to create custom pipelines by connecting various types of nodes, including input, output, LLM, and text nodes.  
- Each node type supports custom handles (connections) and variable-based linking that automatically generates edges between dependent nodes.
- This project implements an AI Pipeline Workflow Builder — a modular, node-based interface for visually constructing data and LLM pipelines.  
- It combines a React + React Flow frontend for interactive graph creation with a FastAPI backend that validates and analyzes pipeline structures.

---

## Key Features

### 1. Node Abstraction Architecture
- Developed a unified abstraction in React Flow for reusable node components.
- Simplified the creation of new node types with shared logic and styling.
- Added multiple custom nodes to demonstrate flexibility and scalability.

### 2. Consistent Styling and UI/UX
- Designed a clean, responsive interface using TailwindCSS and Material UI.
- Established consistent visual standards across all node types.
- Implemented hover effects, tooltips, and layout transitions for better usability.

### 3. Intelligent Text Node Logic
- Implemented automatic resizing of text areas based on user input.
- Added variable recognition using the `{{variable_name}}` syntax.
- Created dynamic handles and connections based on detected variables.
- Automatically updates or removes edges when variables are modified or deleted.

### 4. Frontend–Backend Integration
- Integrated a FastAPI backend to process and analyze the current pipeline structure.
- Backend returns the number of nodes, number of edges, and DAG (Directed Acyclic Graph) validation status.
- Frontend displays the response in a user-friendly alert message.

### 5. DAG Validation Algorithm
- Implemented a DFS-based cycle detection algorithm in FastAPI.
- Ensures the graph structure remains acyclic and logically valid.

---

## Tech Stack

**Frontend**
- React.js with React Flow
- Zustand for state management
- TailwindCSS and Material UI for design

**Backend**
- Python 3.10+
- FastAPI and Uvicorn
- CORS Middleware

---

## Project Structure
```
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── nodes/
│ │ ├── components/
│ │ ├── store/
│ │ └── App.js
│ ├── package.json
│ └── tailwind.config.js
│
├── backend/
│ └── main.py # FastAPI backend (DAG validation & node/edge counting)
│
└── README.md

---
```

## Setup and Installation

### Frontend
```
cd frontend
npm install
npm start
```

### Backend
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Example API Response
```
POST /pipelines/parse
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
---
```

## Author

**Aaftab Ansari**  
Full-Stack Developer | React • FastAPI • Workflow System
