MERN Dashboard App

A full-stack MERN (MongoDB, Express, React, Node.js) application with user authentication, protected routes, and a dashboard for managing entries (add, edit, delete).


#Acknowledgement
  ~ Thanks to my trainers and mentors for continuous support and guidance.  
  ~ Grateful to peers and friends who support me in building of this app.  


# Features:
  1)User registration and login
  2)Google OAuth authentication
  3)JWT-based authentication
  4)Protected routes
  5)Form validation
  6)Responsive design
  7)Protected Routes (Users can’t access /login when already logged in, or /dashboard without login)
  8)Dashboard with Entry Form
       1)Add new entries
       2)Edit existing entries
       3)Delete entries
       4)Client-side form validation with inline error messages

Action Column:
  1)CRUD Operations
  2)Download CSV File
  3)Multiple Entries Delete
  4)Sorting
  5)Pagination

# Technologies Used:
Frontend
  1)React
  2)React Router
  3)Axios
  4)React Toastify (for success messages)
  5)CSS

Backend
  1)Node.js
  2)Express
  3)MongoDB
  4)Mongoose
  5)Passport.js
  6)JWT (JSON Web Tokens)
  7)Google OAuth2 Strategy

# Installation and Setup
Prerequisites
  1)Node.js installed
  2)MongoDB installed and running
  3)Google OAuth credentials (for Google login)



Follow these steps to set up the project locally:

#Clone the Repository
bash
git clone https://github.com/navneetsheokand/mern-dashboard-app.git

bash
cd mern-dashboard-app

# Install dependencies

For backend:
bash
cd server
npm install

For frontend:
bash
cd AdminPanel
npm install

# Environment Variables

Create a .env file in the server directory and add the following:
env
PORT=3088
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-secret-key
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET= google_secret_key
SECRET_KEY=

### Run the Project

Start backend server:
bash
cd server
npm start

Start frontend client:
bash
cd AdminPanel
npm run dev



# Project Structure:
mern-dashboard-app/
│── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── App.css
│   │   │── App.jsx
│   │   │── AuthContext.jsx
│   │   │── Dashboard.css
│   │   │── Dashboard.jsx
│   │   ├── GoogleCallback.jsx          
│   │   │── Login.jsx
│   │   ├── main.jsx            
│   │   │── MainPage.jsx
│   │   │── Pagination.jsx
│   │   │── ProtectedRoute.jsx
│   │   ├── Registration.css
│   │   ├── Registration.jsx
│   │   └── TableHeader.jsx
│   ├── package.json
│   └── vite.config.js
│
│── server/                   # Backend (Express + MongoDB)
│   ├── Models/               # Mongoose models
│   │   ├── userModel.js
│   │   └── tableModel.js
│   ├── Routes/               # Express routes
│   │   ├── authRoutes.js
│   │   └── tableRoutes.js
│   ├── Middlewares/          # Custom middlewares
│   │   └── AuthMiddleware.js
│   │ ── Controllers/          # Route Controllers
│   │   └── authControllers.js
│   ├── app.js  
│   │── passport.js          #Passport library for google OAuth
│   └── package.json
│
│── README.md


# API Endpoints
Authentication
  1)POST /api/auth/register - Register a new user
  2)POST /api/auth/login - Login with email and password
  3)POST /api/auth/logout - Logout user
  4)GET /api/auth/verify - Verify JWT token
  5)GET /api/auth/google - Initiate Google OAuth
  6)GET /api/auth/google/callback - Google OAuth callback


# How to Use
Registration:
  1)Navigate to the registration page
  2)Fill in your name, email, and password
  3)Submit the form
  4)Upon successful registration, you'll be redirected to the login page
  

Login:
  1)Navigate to the login page
  2)Enter your email and password
  3)Submit the form
  4)Upon successful login, you'll be redirected to the dashboard

Google OAuth:
  1)On the login page, click "Sign in with Google"
  2)You'll be redirected to Google for authentication
  3)After authenticating with Google, you'll be redirected back to the application
  4)If it's your first time, a new account will be created
  5)You'll be redirected to the dashboard

Dashboard:
   1)On the dashboard page, click on the add Entry.
   2)You will be able to add new entries.
   3)You can delete and edit the existing entries.
   4)You can select multiple delete to delete a no. of entries in one time.
   5)You can download the csv file of sorted entries.
   6)Pagination and sorting is applied on the entries list.
   7)When you logout from the dashboard page, you are redirected to the login page.

#Usage:
->Register a new account
Navigate to the Register page and create an account.

->Login with credentials
Use the Login page to sign in with your email and password.

->Google OAuth Login
Sign in with your Google account via OAuth 2.0.

->Access Dashboard
After login, you will be redirected to the dashboard to manage profiles.

->Manage Profiles
Create a new profile by filling in details
Edit existing profiles using the edit icon
Delete profiles with the delete icon

->Logout
Log out securely when you’re done



# Contributing
Contributions are always welcome!

Steps to contribute:
1)Fork the repository
2)Create a new branch (git checkout -b feature/your-feature)
3)Commit changes (git commit -m "Added your feature")
4)Push to your fork (git push origin feature/your-feature)
5)Open a Pull Request
