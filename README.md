# Affiliate Postback MVP

This project is a Minimal Viable Product (MVP) of an affiliate marketing system that uses Server-to-Server (S2S) postback tracking for conversions. Instead of relying on client-side cookies, this system tracks conversions through direct communication between servers, which is more reliable and secure.

## ✨ Features
- **Click Tracking:** An endpoint to record affiliate clicks with a unique click_id.
- **Postback Endpoint:** A secure endpoint that receives and validates conversion notifications from an advertiser's server.
- **Affiliate Dashboard:** A frontend application that displays an affiliate's clicks and conversions.
- **Unique Postback URL Generation:** The dashboard shows a unique, personalized postback URL format for each affiliate.

## 💻 Technologies

- **Backend -** `Node.js, Express.js` 
     The core framework for the API endpoints.

- **Database -** `PostgreSQL`
    A relational database used to store all clicks, conversions, and affiliate data.

- **Frontend -** `Next.js` 
    A React framework used to build the affiliate dashboard.

- **Styling -** `Tailwind CSS`
    A utility-first CSS framework for a modern and clean design.

## 🚀 Local Development Setup
 - To run this project locally, you need to set up both the backend and frontend.

 ### Prerequisites

 - **Node.js & npm :** Make sure you have Node.js and npm installed.
 - **PostgreSQL :** A running instance of PostgreSQL (locally or hosted online).

## 1. Backend Setup

 **1. Navigate to the backend directory:**
```
cd backend
```

Install dependencies:
```
npm install
```

Configure environment variables: Create a .env file in the backend directory and add your database connection string.
```
PORT=3001

DATABASE_URL="postgres://your_user:your_password@your_host:your_port/your_database_name"
```


Initialize the database: Run the setup script to create the necessary tables and seed initial data.
```
node setup.js
```

Start the backend server:
```
node server.js
```

The server will run on `http://localhost:3001`.

```
-------------------------------------------------------------------------------------
```

## ➡️ Example API Endpoints

### You can use a tool like Postman or curl to test the backend endpoints.
**1. Track a Click (GET) :** 
This endpoint simulates a user clicking an affiliate link. A unique click_id is required.
```
"http://localhost:3001/click?affiliate_id=1&campaign_id=1&click_id=test_click_001"

Response: {"status": "success", "message": "Click tracked"}

```
**2. Send a Postback (GET):**


This endpoint simulates an advertiser sending a conversion notification. The click_id must match a click that was previously tracked.

```
"http://localhost:3001/postback?affiliate_id=1&click_id=test_click_001&amount=50.00&currency=USD"

Response: {"status": "success", "message": "Conversion tracked"}
```


**3. Fetch All Affiliates (GET):**

This is used by the frontend for the dashboard's "login simulation."
```
"http://localhost:3001/api/affiliates"

Response: [{"id":1,"name":"Affiliate A"}, {"id":2,"name":"Affiliate B"}]
```

**4. Fetch Affiliate Dashboard Data (GET):**

This provides all clicks and conversions for a specific affiliate ID.
```
"http://localhost:3001/api/affiliate/1"

Response: An object containing clicks and conversions arrays.
```


# Frontend
```
/affiliate-postback-mvp
├── /backend
│   └── ...
└── /frontend
    ├── package.json
    ├── tailwind.config.js
    └── /app
        ├── page.js          (Affiliate List Page)
        └── /dashboard
            └── /[affiliateId]
                └── page.js    (Affiliate Dashboard Page)
```


This is the frontend portion of the Affiliate Postback MVP. It is a dashboard built with Next.js and styled with Tailwind CSS. It serves as the user-facing interface for affiliates to see their clicks, conversions, and a personalized postback URL.

## Prerequisites

- A running instance of the backend server (http://localhost:3001).

- Node.js and npm installed.


**1. Navigate to the frontend directory :**

Open your terminal and change to the project's frontend directory.
```
cd frontend
```

**2. Install dependencies :**

Install all the required packages, including Next.js and Tailwind CSS.
```
npm install
```

**3. Start the development server :**

Run the following command to start the Next.js development server.
```
npm run dev
```

The affiliate dashboard will be available in your browser at http://localhost:3000.
