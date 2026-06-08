# Rathkeale College - Digital Song & Hymn Portal

A custom, high-performance web application bootstrapped with Create React App, designed for Rathkeale College students to browse, search, and stream traditional school hymns and anthems.

---

## 🛠 Implemented Complex Programming Techniques

To satisfy specific advanced evaluation benchmarks, this application successfully implements the following two complex development requirements:

### 1. Programming or Writing Code for a Graphical User Interface (GUI)
The visual front-end portal is entirely managed programmatically via the JavaScript logic tree (`src/App.js`). The system actively monitors client-side browser event listeners to construct, compile, and append native HTML element node components (`document.createElement()`, `.className`, `.appendChild()`) straight into the DOM tree workspace in real time. This dynamic approach completely replaces hardcoded layout strings or raw HTML string injection, guaranteeing smooth, fluid interface states.

### 2. Reading From, or Writing To, Files or Other Persistent Storage
The portal's data pipeline is completely isolated from the execution script rules. Instead of hardcoding content strings straight into the logic layer, the application relies on the asynchronous browser `Fetch API` to open a data stream, reading records directly from an external persistent storage file (`public/database.json`). This backend file securely stores text vectors, structural indices, and sound links for 10 full hymns and anthems independently of the main program scripts.

---

## Prerequisites
Before you begin, make sure you have the following installed:

* **Node.js (v14 or higher recommended)** — which includes npm (Node Package Manager).
* **A terminal / command prompt** (Command Prompt on Windows is highly recommended to avoid PowerShell script execution restrictions; Terminal on Mac/Linux).

To check if Node and npm are installed on your system, open your terminal and run:
```bash
node -v
npm -v

1. Clone Repository:
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

2. Navigate into project folder:
cd your-repo-name

3. Install Independecies
npm install

4. Navigate into the application subdirectory and start the server
!IMPORTANT: Run in CMD on VS CODE, NOT PowerShell.
cd app
npm start

Available Scripts
In the project directory, you can run:

npm start
Runs the app in local development mode at http://localhost:3000.

npm test
Launches the test runner in interactive watch mode. See the testing docs for more info.

npm run build
Builds the app for production into the build/ folder. The output is fully minified and optimized — ready to deploy.

npm run eject
⚠️ This is a strict one-way operation and cannot be undone. Ejects the app from Create React App's managed configuration, giving you full control over Webpack, Babel, ESLint, and other tooling. Only do this if you need advanced customization.

Deployment
Run npm run build to generate a production build, then deploy the build/ folder to your hosting provider of choice:

Netlify

Vercel

GitHub Pages

See the full Create React App deployment guide for more options.

Useful Links
Create React App documentation

React documentation

Node.js download page