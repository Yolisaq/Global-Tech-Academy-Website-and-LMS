# 🌍 Global Tech Academy LMS

### 🎓 Learn · 💻 Build · 🏆 Certify · 💼 Work

**A modern Learning Management System for digital skills development, learner management, training administration, and career-focused learning.**

Welcome to the **Global Tech Academy Learning Management System (LMS)** repository! 🚀

Global Tech Academy LMS is a web-based platform designed to connect learners with practical digital education, structured learning programmes, assessment activities, and career development opportunities.

Built with React and Node.js technologies, the application combines a public-facing academy website with dedicated learner and administrator portals.

---

## 📌 Table of Contents

- 🌟 [About the Project](#-about-the-project)
- ✨ [Key Features](#-key-features)
- 🎓 [Learner Portal](#-learner-portal)
- 🛡️ [Admin Portal](#️-admin-portal)
- 🔐 [Authentication and Security](#-authentication-and-security)
- 🧰 [Technology Stack](#-technology-stack)
- 📁 [Project Structure](#-project-structure)
- ⚙️ [Getting Started](#️-getting-started)
- 🚀 [Running the Application](#-running-the-application)
- 🔗 [Local Development URLs](#-local-development-urls)
- 🌐 [API Configuration](#-api-configuration)
- 🛠️ [Troubleshooting](#️-troubleshooting)
- 🔒 [Security Best Practices](#-security-best-practices)
- 🗺️ [Future Development](#️-future-development)
- 🤝 [Contributing](#-contributing)
- 📄 [Licence](#-licence)

---

## 🌟 About the Project

**Global Tech Academy LMS** is being developed to support technology-focused learning, learner administration, and training operations through one integrated digital platform.

The application provides:

- 🌐 A public academy website.
- 🎓 A dedicated learner experience.
- 🛡️ An administration workspace.
- 📚 Programme and course management.
- 📝 Assessment and submission management.
- 📊 Learning progress and reporting.
- 💳 Finance and invoice record management.
- 🔔 Notifications and audit activity.
- 🔑 Authentication and role-based navigation.

The project is designed for ongoing development, with functionality implemented through a React frontend and a backend API.

### 🎯 Our Mission

To make practical digital learning more accessible, support skills development, and help learners build pathways towards further education, certification, and employment.

### 💡 Our Motto

> Learn. Build. Certify. Work.

---

## ✨ Key Features

<details>
<summary><strong>🌐 1. Public Academy Website</strong></summary>

The public website introduces visitors to Global Tech Academy and its learning opportunities.

Features include:

- 🏠 Home page with academy messaging.
- ℹ️ About the Academy.
- 🧑‍💻 Services and training information.
- 📚 Programme and course discovery.
- 🌱 Impact and portfolio pages.
- 📩 Contact form for enquiries.
- 🔏 Privacy information page.
- 📝 Learner registration.
- 🔑 Learner and administrator sign-in pages.

</details>

<details>
<summary><strong>🎓 2. Learner Portal</strong></summary>

The learner portal provides authenticated learners with access to their learning workspace.

Available navigation modules include:

- 📊 Learning overview.
- 📚 My Courses.
- 📖 Lessons.
- 📈 Progress.
- 📅 Attendance.
- 📝 Assessments.
- 📤 Submissions.
- 💬 Feedback.
- 💳 Payments.
- 🧾 Invoices.
- 🏆 Certificates.
- 👤 Profile management.

The information displayed depends on the backend API, the learner's account, and the data available to that account.

</details>

<details>
<summary><strong>🛡️ 3. Administration Portal</strong></summary>

The administrator portal provides a central workspace for supported academy management operations.

Administrative modules include:

- 📊 Overview dashboard.
- 👥 User management.
- 🔐 User role management.
- 📝 Learner applications.
- 🎓 Programme management.
- 📚 Course management.
- 🧑‍🤝‍🧑 Cohort management.
- 📅 Attendance records.
- 📝 Assessments.
- ✅ Marking and submissions.
- 🔎 Moderation.
- 💰 Finance records.
- 📈 Reports.
- 🔔 Notifications.
- 🧾 Audit logs.
- ⚙️ System settings.

Depending on the module and backend implementation, the interface supports record listing, searching, creating, editing, deleting, and updating selected information.

</details>

<details>
<summary><strong>🔑 4. Authentication and Account Recovery</strong></summary>

The application includes frontend workflows for:

- Learner registration.
- Learner sign-in.
- Administrator sign-in.
- Password-reset requests.
- Password-reset confirmation.
- Sign-out.
- Token-based API requests.
- Role-aware portal navigation.

Authentication requests are sent to the backend API. The server must validate credentials, issue tokens securely, enforce permissions, and implement password recovery correctly.

</details>

<details>
<summary><strong>📊 5. Dashboards and Reporting</strong></summary>

The portal interfaces include dashboard summaries and quick links.

Administrator dashboard indicators can include:

- 👥 Total users.
- 🎓 Active learners.
- 📚 Programmes.
- 📖 Courses.
- 📝 Applications.
- 💳 Outstanding invoices.

Learner dashboard indicators can include:

- 📚 Available courses.
- 📝 Assessments.
- 📤 Submissions.
- 🏆 Certificates.

The administrator interface also includes a CSV report export workflow and recent audit activity display, subject to backend support.

</details>

---

## 🎓 Learner Portal

The learner experience is designed around a simple principle: **make learning progress easier to access and manage.**

| Module | Purpose |
|---|---|
| 📊 Overview | View learning dashboard information |
| 📚 My Courses | Access available or assigned courses |
| 📖 Lessons | Access lesson-related information |
| 📈 Progress | Review learning and submission information |
| 📅 Attendance | Review attendance records |
| 📝 Assessments | Review assessment information |
| 📤 Submissions | View assessment submission records |
| 💬 Feedback | Review available feedback |
| 💳 Payments | Review payment records |
| 🧾 Invoices | View invoice information |
| 🏆 Certificates | Review issued certificate records |
| 👤 Profile | Access account profile information |

---

## 🛡️ Admin Portal

The administration workspace is intended to support the management of academy operations from one interface.

### 👥 User and Access Management
Manage user records and selected user roles.

### 🎓 Programme and Course Management
Create and update supported programme and course records.

### 📝 Assessment Management
Review assessment records, submissions, marking, and moderation information.

### 💰 Finance Management
Access supported payment, invoice, and finance records.

### 📈 Reporting and Monitoring
Review dashboard counts, export available report data, and inspect audit activity.

### ⚙️ System Settings
View and update settings exposed by the backend API.

**Important:** The frontend interface alone does not guarantee that an operation is secure or fully functional. Each operation must be supported and authorised by the backend.

---

## 🔐 Authentication and Security

The application uses a bearer-token pattern for authenticated API requests.

The frontend currently reads its API base URL from:

```javascript
const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:4000/api';
```

After successful sign-in, the current implementation stores the authentication token and user information in browser `localStorage` using:

- `gta_token`
- `gta_user`

The frontend also checks user roles to determine which portal and navigation items to display.

### 🛡️ Security considerations

Before production deployment:

- 🔒 Enforce all permissions on the backend.
- 🔑 Use secure password hashing.
- 🧱 Validate and sanitise incoming data.
- 🔐 Protect password-reset tokens and authentication sessions.
- 🚫 Prevent unauthorised role escalation.
- 🕵️ Restrict access to sensitive learner and financial records.
- 🌐 Configure CORS for approved application origins.
- 🔏 Use HTTPS in production.
- 🧾 Protect audit logs from unauthorised modification.
- 🔄 Review token expiry, revocation, and logout behaviour.

Browser `localStorage` can be exposed if malicious JavaScript executes in the application. Review the authentication storage approach and associated XSS risks before handling real learner information.

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | User interface and reusable components |
| ⚡ Vite | Frontend development server and build tooling |
| 🧭 React Router | Client-side navigation |
| 🎨 CSS | Application styling and layouts |
| 🖼️ Lucide React | Interface icons |
| 🟢 Node.js | Backend JavaScript runtime |
| 🚏 Express.js | Backend API framework |
| 🔗 Fetch API | HTTP communication between frontend and backend |
| 📦 npm | Dependency and package management |
| 🧪 Git | Version control |
| 💻 Visual Studio Code | Development environment |

---

## 📁 Project Structure

The repository is organised into separate frontend and backend areas.

```text
Global_Tech_Academy_LMS/
│
├── 📂 client/
│   ├── 📂 public/
│   │   └── 📂 images/
│   │       └── global-tech-academy-logo.png
│   ├── 📂 src/
│   │   ├── Main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
│
├── 📂 server/
│   ├── 📂 src/
│   │   └── index.js
│   └── package.json
│
├── 📂 backup-auth-20261021-151712/
│
├── 📂 .vscode/
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 .gitignore
└── 📄 README.md
```

*Note: This is an illustrative structure. Your repository may contain additional files, components, routes, or configuration files. Check the actual folder contents if filenames differ.*

---

## ⚙️ Getting Started

Follow these instructions to run the project locally on Windows.

### ✅ Prerequisites

Install the following:

- 🟢 [Node.js](https://nodejs.org/)
- 📦 npm, included with Node.js
- 💻 [Visual Studio Code](https://code.visualstudio.com/)
- 🧪 [Git](https://git-scm.com/)

Verify your installation:

```powershell
node --version
npm.cmd --version
git --version
```

### 📥 Step 1: Open the project

Open the existing project folder in Visual Studio Code.

Example:

```text
C:\Users\Tech Nexus Academy\Pictures\Global_Tech_Academy_LMS
```

### 📦 Step 2: Install dependencies

Open the integrated VS Code terminal.

From the project root, run:

```powershell
npm.cmd install
```

If the client and server have their own `package.json` files and their dependencies have not been installed, run:

```powershell
cd client
npm.cmd install
cd ..\server
npm.cmd install
cd ..
```

### 🚀 Step 3: Start the application

From the project root:

```powershell
npm.cmd run dev
```

The root development script is expected to start the frontend and backend processes.

When the services start successfully, the terminal should display messages similar to:

```text
Global Tech Academy API running at http://localhost:4000
VITE ready
Local: http://localhost:5173/
```

The exact output may differ depending on your configuration.

### 🌐 Step 4: Open the website

Open the following URL in your browser:

**👉 http://localhost:5173/**

Keep the terminal open while the application is running.

---

## 🚀 Running the Application Separately

If you need to troubleshoot the frontend and backend independently, open two VS Code terminals.

### 💻 Terminal 1 — Frontend

```powershell
cd client
npm.cmd run dev
```

### 🟢 Terminal 2 — Backend

```powershell
cd server
npm.cmd run dev
```

These commands assume the corresponding `dev` scripts are defined in the client and server `package.json` files.

To inspect the available scripts in a directory, run:

```powershell
npm.cmd run
```

---

## 🔗 Local Development URLs

| Service | URL |
|---|---|
| 🌐 Public website | http://localhost:5173/ |
| 🔌 Backend server | http://localhost:4000 |
| 🔗 API base path | http://localhost:4000/api |
| 🎓 Learner sign-in | http://localhost:5173/learner/login |
| 🛡️ Admin sign-in | http://localhost:5173/admin/login |
| 📝 Registration | http://localhost:5173/register |
| 🔑 Password recovery | http://localhost:5173/learner/forgot-password |

The backend root URL may not display a webpage. API routes depend on the server implementation.

---

## 🌐 API Configuration

The frontend uses the following environment variable to configure its backend:

```dotenv
VITE_API_URL=http://localhost:4000/api
```

Create a `.env` file in the client directory if required by your Vite configuration.

If `VITE_API_URL` is not set, the frontend falls back to `http://localhost:4000/api`.

### 🔌 API operations used by the frontend

The current React code references API routes for:

| Area | Example endpoint |
|---|---|
| Public programmes | `/public/programmes` |
| Public courses | `/public/courses` |
| Contact form | `/public/contact` |
| Registration | `/auth/register` |
| Sign-in | `/auth/login` |
| Sign-out | `/auth/logout` |
| Password recovery | `/auth/forgot-password` |
| Password reset | `/auth/reset-password` |
| Learner overview | `/learner/overview` |
| Admin overview | `/admin/overview` |
| Admin settings | `/admin/settings` |
| Report export | `/admin/reports/export.csv` |

The frontend also references module endpoints for courses, assessments, attendance, submissions, feedback, payments, invoices, certificates, applications, cohorts, notifications, and audit logs.

The backend must implement compatible routes and response formats for these features to work.

---

## 🛠️ Troubleshooting

### ❌ PowerShell blocks npm

If you see an error stating that `npm.ps1` cannot be loaded because script execution is disabled, use:

```powershell
npm.cmd install
npm.cmd run dev
```

This avoids invoking the PowerShell script wrapper.

### ⚪ The website displays a blank white screen

1. Open the website in Chrome.
2. Press `F12` to open Developer Tools.
3. Select **Console**.
4. Check for JavaScript errors.
5. Inspect the **Network** tab for failed files or API requests.
6. Review the terminal output from Vite and the backend.

### 🔌 The backend API is unavailable

- Confirm that the backend is running on port `4000`.
- Check the backend terminal for errors.
- Confirm that `VITE_API_URL` points to the correct API.
- Verify that the relevant endpoint exists.
- Check CORS configuration if the browser blocks requests.

### 🔑 Sign-in does not work

- Confirm that the backend authentication routes are running.
- Verify the request payload and expected response format.
- Check whether the server returned an authentication error.
- Confirm that the server returns both a valid token and user object.
- Verify role assignment and protected-route handling.

### 📦 A development command is unavailable

Inspect the scripts defined in the relevant `package.json`:

```powershell
npm.cmd run
```

Do not assume that every script is configured in the root, client, and server directories.

---

## 🗺️ Future Development

Potential development priorities include:

- 🗄️ Reliable database integration and persistent storage.
- 🔐 Production-ready authentication and permission controls.
- 📚 Course content and lesson delivery.
- 📤 Assessment document uploads and submission workflows.
- ✅ Marking, feedback, and moderation workflows.
- 📅 Attendance management.
- 🏆 Certificate generation and verification.
- 💳 Finance and invoice integrations.
- 📧 Email notifications and password recovery.
- 📊 Expanded reporting and analytics.
- ☁️ Production deployment and monitoring.
- 📱 Further mobile and accessibility improvements.

These items represent potential improvements, not a claim that every feature is already implemented.

---

## 🤝 Contributing

Contributions and improvements should support the stability, security, accessibility, and usability of Global Tech Academy LMS.

1. 🌿 Create a branch for your changes.
2. 🛠️ Make focused updates.
3. 🧪 Test the frontend and backend.
4. 🔍 Review security and access permissions.
5. 📝 Update documentation when necessary.
6. 🚀 Submit your changes for review.

Please do not commit passwords, secret keys, real learner records, or other confidential information.

---

## 📄 Licence

A licence has not yet been specified for this repository.

Add an appropriate licence before authorising public reuse, redistribution, or modification of the source code.

---

## 💙 Global Tech Academy

**Building skills. Creating futures.**

🌍 Digital learning | 💻 Technology | 🎓 Skills development | 🚀 Career pathways

*Learn today. Build tomorrow. Create your future.*

