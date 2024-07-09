# Real Estate Project

## Introduction

This real estate project is under development, which allows users to view and manage real estate properties. The project includes a backend server and a frontend client.

## Getting Started

### Installation

1. Install backend dependencies:

   ```sh
   npm install
   ```

2. Change to the frontend directory and install frontend dependencies:

   ```sh
   cd frontend
   npm install
   ```

### Running the Project

1. Start the backend server:

   ```sh
   npm run dev
   ```

2. In a new terminal window, start the frontend development server:

   ```sh
   cd frontend
   npm run dev
   ```

3. The backend server will run on `http://localhost:3000` and the frontend will be available on `http://localhost:5000`.

## Environment Variables

Set the following environment variables for the project:

### In the Root Directory

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URI=YOUR MONGODB DATABASE URI
JWT_SECRET=YOUR JWT SECRET
NODE_ENV=development
```

### In the Frontend Directory

Create a `.env` file in the `frontend` directory and add the following:

```env
VITE_FIREBASE_API_KEY=YOUR FIREBASE APIKEY
VITE_FIREBASE_APP_ID=YOUR FIREBASE APPID
```

configure your own firebase and add to `frontend/src/firebase.js`;