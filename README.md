<div align="center">

![Header](https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MmJib2kxbDc2NjF0cnN4YTczNTdjaWo1Y2dzN2FiZmpqM29peGI1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hV0VrMCPMKqTK2fl89/giphy.gif)

# 🎫 Suvidha CRM — Ticket Management System

**A full-stack Customer Relationship Management and Support Ticket System built with React, Node.js, MongoDB, and real-time communication via Telegram & Firebase.**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Push%20Notifications-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-File%20Uploads-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot%20Integration-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots)
[![Styled Components](https://img.shields.io/badge/Styled--Components-CSS--in--JS-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)

</div>

---

## 📖 About

Suvidha CRM is a robust customer support ticket management platform designed for businesses to handle user complaints, track ticket status, and communicate with customers in real time. It features a **dual-role system** (User & Admin), OTP-based email verification, Telegram-integrated messaging, Firebase push notifications, Cloudinary media uploads, and a complete client analytics dashboard for admins.

The Admin panel includes a searchable client dashboard, full CRUD for client records (with invoice image uploads), ticket status management, real-time chat per ticket, and a dedicated analytics view — all protected behind session-based authentication with a secret code requirement for admin registration.

---

## ✨ Features

| Feature | User | Admin |
|---|---|---|
| Register / Login with OTP verification | ✅ | ✅ |
| Forgot / Reset Password via Email | ✅ | ✅ |
| Create, Edit & Delete Tickets | ✅ | — |
| Upload Invoice & Product Images | ✅ | — |
| Real-time Chat per Ticket | ✅ | ✅ |
| Telegram Bot Messaging | ✅ | ✅ |
| Firebase Push Notifications | ✅ | ✅ |
| View & Search Tickets | ✅ | ✅ |
| Update Ticket Status (Pending / Resolved) | — | ✅ |
| Manage Client Records (Add / Edit / Delete) | — | ✅ |
| View Order Invoice Images | — | ✅ |
| Client Analytics Dashboard | — | ✅ |
| Submit Feedback with Star Rating | ✅ | — |
| Update Profile & Password | ✅ | ✅ |
| Delete Account | ✅ | ✅ |
| Email Change with OTP Re-verification | ✅ | ✅ |
| Admin Secret Code Registration Guard | — | ✅ |
| Responsive Mobile Navigation | ✅ | ✅ |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18+ | UI framework |
| React Router v6 | Client-side routing & protected routes |
| Axios | HTTP requests with session credentials |
| Styled Components | Component-scoped CSS-in-JS (Login & Register forms) |
| Firebase SDK (FCM) | Push notification listener |
| Lottie / DotLottie React | Animated illustrations (empty states, loaders) |
| React Toastify | Toast notification system |
| Bootstrap 5 | Utility classes & JS components |
| Vite | Build tool & dev server |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Passport.js | Session-based auth (local-user + local-admin strategies) |
| passport-local-mongoose | Password hashing & authentication |
| connect-mongo | MongoDB session store |
| Cloudinary + Multer | Image/file upload & cloud storage |
| Nodemailer | OTP & reset password emails |
| node-telegram-bot-api | Telegram bot for ticket messaging |
| firebase-admin | Server-side push notification delivery |
| Joi | Request body validation |
| bcryptjs | Additional password hashing |
| dotenv | Environment variable management |

---
## 🗄️ Database Schema

> 🔗 **[View Interactive Schema Diagram →](https://anubhav-03042004.github.io/Suvidha-crm-schema/)**

> The link above opens a live, interactive entity-relationship diagram
> showing all collections, fields, types, and relationships.

## 🚀 Local Setup

### Prerequisites

- Node.js v18+
- MongoDB URI (local or Atlas)
- Cloudinary account
- Firebase project (for push notifications)
- Telegram Bot Token & Chat ID
- Gmail account (for Nodemailer)

### Step 1 — Clone & Install

```bash
git clone https://github.com/your-username/suvidha-crm.git
cd suvidha-crm

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Step 2 — Configure Environment Variables

Create `.env` in the `server/` directory:

```env
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://your-cluster-url/suvidha

# Session
SESSION_SECRET=your_super_secret_session_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Firebase Admin SDK
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_UNIVERSE_DOMAIN=googleapis.com

# Admin Registration Secret
ADMIN_SECRET_CODE=your_admin_secret_code
```

Create `.env` in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_API_KEY=your_firebase_api_key
VITE_API_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_API_PROJECTID=your-project-id
VITE_API_MESSAGING_SENDERID=your_sender_id
VITE_API_APPID=your_app_id
VITE_API_VAPID_KEY=your_vapid_key
```

### Step 3 — Run

```bash
# Start backend (from server/)
npm run dev        # with nodemon
# or
node app.js

# Start frontend (from client/)
npm run dev
```

Frontend runs at `http://localhost:5173` — backend at `http://localhost:4000`.

---

## 📁 Project Structure

```
suvidha-crm/
│
├── server/                              # Node.js Express backend
│   ├── app.js                           # Entry point, middleware, route mounting
│   ├── config/
│   │   ├── passport.js                  # Dual Passport strategies (user + admin)
│   │   └── cloudinary.js                # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js                      # ensureAuthenticated, isAdminAuthenticated
│   ├── models/
│   │   ├── User.js                      # User schema (passport-local-mongoose)
│   │   ├── Admin.js                     # Admin schema (passport-local-mongoose)
│   │   ├── Ticket.js                    # Ticket schema
│   │   ├── Chat.js                      # Chat message schema
│   │   ├── Client.js                    # Client record schema
│   │   └── feedback.js                  # Feedback schema
│   └── routes/
│       ├── auth.js                      # Register, login, OTP, reset password
│       ├── admin.js                     # Admin profile management
│       ├── profile.js                   # User profile management
│       ├── ticket.js                    # Admin ticket view + Telegram + Firebase
│       ├── editticket.js                # User ticket CRUD + Cloudinary uploads
│       ├── client.js                    # Client management (admin only)
│       └── feedback.js                  # Feedback submission + Telegram alert
│
└── client/                              # React + Vite frontend
    ├── src/
    │   ├── App.jsx                      # Route definitions + Firebase push setup
    │   ├── main.jsx                     # React root + AuthProvider
    │   ├── firebase.js                  # Firebase FCM configuration
    │   ├── context/
    │   │   └── AuthContext.jsx          # Global auth state (login, logout, user)
    │   ├── ProtectedRoute/
    │   │   └── ProtectedRoute.jsx       # User & admin route guards
    │   ├── assets/
    │   │   └── img/logo.png             # Brand logo
    │   ├── home/
    │   │   └── Loader.jsx               # Full-page loading spinner
    │   ├── pages/
    │   │   ├── register/                # User registration
    │   │   ├── login/                   # User login
    │   │   ├── forgot_password/         # Forgot password flow
    │   │   ├── reset_password/          # Reset password with token
    │   │   └── otp/                     # OTP verification (6-digit input)
    │   ├── User-functionalities/
    │   │   ├── User-dashboard.jsx       # Dashboard with polling notifications
    │   │   ├── ticket_table.jsx         # Ticket list with search & actions
    │   │   ├── logout.css               # Shared logout modal styles
    │   │   ├── add_new_ticket/          # Create ticket with file upload
    │   │   ├── Edit_New_Ticket.jsx      # Edit ticket form
    │   │   ├── chat/chatuser.jsx        # Real-time ticket chat
    │   │   ├── profile/profile.jsx      # User profile & password settings
    │   │   └── feedback/                # Feedback form with star rating
    │   └── Admin-functionalities/
    │       ├── Admin_dashboard.jsx      # Admin client list + live search
    │       ├── Admin_dashboard.css      # Shared admin styles (nav, footer, forms)
    │       ├── Admin_header.jsx         # Sticky nav with logout confirmation modal
    │       ├── Admin_footer.jsx         # Fixed footer
    │       ├── dashboard_table.jsx      # Client table with edit/delete/invoice
    │       ├── Editclient.jsx           # Edit client details & invoice form
    │       ├── AdminLogin.jsx           # Admin login (styled-components)
    │       ├── AdminRegister.jsx        # Admin register with secret code guard
    │       ├── AdminRegister.css        # Admin auth page base styles
    │       ├── show_hide.jsx            # Animated thank-you screen
    │       ├── Admin-profile/           # Admin profile settings
    │       ├── Admin-chats/             # Admin chat with ticket users
    │       ├── add_new_client/          # Add client records with invoice upload
    │       └── Client_Analytics/        # Client analytics charts
    └── public/
        └── _redirects                   # Netlify SPA fix: /* /index.html 200
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/register/admin` | Register new admin (requires secret code) | Public |
| `POST` | `/login` | Login (session-based) | Public |
| `POST` | `/verify-otp` | Verify email OTP | Public |
| `POST` | `/resend-otp` | Resend OTP | Public |
| `POST` | `/forgot` | Send password reset email | Public |
| `POST` | `/reset/:id/:token` | Reset password with token | Public |
| `GET` | `/check` | Check user session validity | Session |

### Tickets — `/api/tickets`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get all tickets | User/Admin |
| `POST` | `/` | Create ticket + file upload | User |
| `GET` | `/:ticketId` | Get single ticket | User/Admin |
| `PUT` | `/:ticketId` | Edit ticket / update status | User/Admin |
| `DELETE` | `/:ticketId` | Delete ticket | User/Admin |
| `POST` | `/send/:ticketId` | Send chat message | User/Admin |
| `GET` | `/messages/:ticketId` | Get chat messages | Any |
| `DELETE` | `/delete/:ticketId` | Clear chat history | Any |
| `POST` | `/save-token` | Save FCM push token | User/Admin |

### User Profile — `/api/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/me` | Get current user | User |
| `PUT` | `/me` | Update username / email | User |
| `PUT` | `/password` | Change password | User |
| `DELETE` | `/me` | Delete account | User |

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/me` | Get admin profile | Admin |
| `PUT` | `/me` | Update admin profile | Admin |
| `PUT` | `/password` | Change admin password | Admin |
| `DELETE` | `/me` | Delete admin account | Admin |
| `GET` | `/check` | Verify admin session | Admin |

### Clients — `/api/clients`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get all clients | Admin |
| `POST` | `/` | Add client + invoice upload | Admin |
| `GET` | `/:id` | Get single client | Admin |
| `PUT` | `/:id` | Update client + invoice | Admin |
| `DELETE` | `/:id` | Delete client | Admin |

### Feedback — `/api/feedback`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/submit` | Submit feedback + Telegram alert | User |

---

## 🔐 Authentication Flow

```
User Registration
      │
      ▼
  POST /api/auth/register
      │
      ▼
  OTP sent to email via Nodemailer
      │
      ▼
  POST /api/auth/verify-otp  (6-digit code)
      │
      ▼
  Session created (Passport.js + connect-mongo)
      │
      ▼
  Redirect → /user-dashboard
```

```
Admin Registration  (requires ADMIN_SECRET_CODE)
      │
      ▼
  POST /api/auth/register/admin
      │
      ▼
  OTP verification → session → /admin-dashboard
```

---

## 💬 Real-Time Chat Architecture

```
User sends message
      │
      ▼
POST /api/tickets/send/:ticketId
      │
      ├──▶ Saved to MongoDB  (Chat model)
      │
      ├──▶ Forwarded to Telegram Bot  (prefixed [issue title])
      │
      └──▶ Firebase Push Notification  →  Admin FCM token

Admin replies via Telegram or Admin Chat UI
      │
      ▼
Telegram bot receives message → saved to MongoDB
      │
      └──▶ Firebase Push Notification  →  User FCM token
```

---

## 🖥️ Admin Panel Overview

The Admin panel consists of the following key components:

**`AdminLogin.jsx` / `AdminRegister.jsx`** — Styled-components-based auth forms with purple (`#b782d8`) branding, show/hide password toggle, FCM token capture on login, and secret code validation on registration.

**`Admin_header.jsx`** — Fixed navigation bar with links to Dashboard, Add New Client, Client Analytics, Chats, and Profile. Includes a logout confirmation modal powered by `AuthContext`.

**`Admin_dashboard.jsx`** — Fetches all client records from the API on mount, provides live search filtering by client name or company, and renders the client table. Displays a `Loader` component while fetching data.

**`dashboard_table.jsx`** — Renders the client data table with Edit, View Invoice, and Delete actions per row. Delete action triggers a confirmation modal. Invoice images open in a full-screen lightbox modal. Empty state displays a Lottie animation with a friendly message.

**`Editclient.jsx`** — Pre-populated edit form for updating client records. Supports invoice image replacement with file type (JPEG/PNG) and size (max 5MB) validation. Redirects back to the dashboard after a successful update.

**`Admin_footer.jsx`** — Fixed bottom footer with copyright notice.

---

## 🗂️ Database Schema Overview

```
Users                     Admins                    Tickets
─────────────────         ────────────────          ──────────────────────
_id                       _id                       _id
username                  username                  userId  →  Users._id
email                     email                     issue
password (hashed)         password (hashed)         description
isVerified                isVerified                status (pending/resolved)
otp                       otp                       invoice  (Cloudinary URL)
otpExpires                otpExpires                product_image (Cloudinary URL)
resetPasswordToken        resetPasswordToken        createdAt / updatedAt
fcmToken                  fcmToken
                          secretCode
                          isAdmin: true

Chats                     Clients                   Feedback
─────────────────         ────────────────────      ─────────────────────
ticketId                  name                      username
userId (string)           address                   email
message                   mobileNumber              rating (1–5)
isAdmin (bool)            company                   comments
createdAt                 totalOrder                userId  →  Users._id
                          orderId                   createdAt
                          order_invoice (Cloudinary URL)
                          createdBy  →  Admins._id
```

---

## 🧪 Sample API Calls

```js
// Create a new support ticket with file uploads
const formData = new FormData();
formData.append('issue', 'Product not delivered');
formData.append('description', 'My order #1234 has not arrived after 2 weeks.');
formData.append('invoice', invoiceFile);        // JPEG/PNG, max 5MB
formData.append('product_image', productFile);  // JPEG/PNG, max 5MB

const response = await fetch('https://your-backend.onrender.com/api/tickets', {
  method: 'POST',
  body: formData,
  credentials: 'include',
});

const ticket = await response.json();
/*
{
  _id: "64f...",
  userId: "64e...",
  issue: "Product not delivered",
  description: "My order #1234...",
  invoice: "https://res.cloudinary.com/...",
  product_image: "https://res.cloudinary.com/...",
  status: "pending",
  createdAt: "2025-03-06T...",
  updatedAt: "2025-03-06T..."
}
*/
```

```js
// Edit a client record (Admin only)
const data = new FormData();
data.append('name', 'Anubhav Kumar');
data.append('company', 'Suvidha Pvt Ltd');
data.append('totalOrder', 5);
data.append('orderId', 1021);
data.append('order_invoice', newInvoiceFile); // optional replacement

const res = await axios.put(`/api/clients/${clientId}`, data, {
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

---

## ☁️ Deployment

### Frontend — Netlify

1. Set build command: `npm run build`, publish directory: `dist`
2. Add all `VITE_*` environment variables in **Site Settings → Environment Variables**
3. Ensure `client/public/_redirects` contains exactly:

```
/*    /index.html    200
```

### Backend — Render

1. Set start command: `node app.js`
2. Add all server `.env` variables under the **Environment** tab
3. Set `NODE_ENV=production` to enable secure cookies and `sameSite: none`

> ⚠️ Make sure `CLIENT_URL` in your backend `.env` matches your deployed Netlify URL exactly to avoid CORS errors.

---

## 🤝 Contributing

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

Please follow conventional commit messages: `feat:` · `fix:` · `docs:` · `refactor:` · `chore:`

---

## 🗺️ Roadmap

- [ ] Replace polling with WebSocket (Socket.io) for real-time chat
- [ ] Switch Telegram integration from polling to webhooks (production-safe)
- [ ] Add pagination to ticket and client lists
- [ ] Export tickets / clients to CSV or PDF
- [ ] Email notification when ticket is resolved
- [ ] Multi-admin support with role-based permissions
- [ ] Dark mode UI
- [ ] Mobile app (React Native)

---

## 💡 Motivation

| Problem | Solution |
|---|---|
| Businesses struggle to track customer complaints centrally | Unified ticket dashboard for all issues |
| Support agents miss messages without real-time alerts | Telegram bot + Firebase push notifications |
| File sharing in support is cumbersome | Cloudinary-powered invoice & product image uploads |
| No visibility into client order history | Admin client analytics with order tracking |
| Manual email threads are unorganized | Structured per-ticket chat with full history |
| Unauthorized admin access | Secret code guard on admin registration |

---

## 👤 Author

**Anubhav Kumar Srivastava**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/ANUBHAV-03042004)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/anubhav-kumar-srivastava-b7a4293b3/)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

![Footer](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2xiaWc0cHJ3dXNnM3plaXFhMzZkazIycGJkZmR6emUyYTJ0MnRvZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/f1JaQyF57OgpO/giphy.gif)

*Built with ❤️ for seamless customer support — © 2025 Suvidha CRM*

</div>
