Affiliate Postback MVP - Backend
This project is a Minimal Viable Product (MVP) for an affiliate marketing Server-to-Server (S2S) postback system. It includes API endpoints for tracking clicks and logging conversions, with a PostgreSQL database as its foundation.

⚙️ System Overview
In affiliate marketing, a postback is a server-to-server communication method used to track conversions. Instead of relying on client-side cookies or pixels, the advertiser's server sends a direct notification (a "postback") to the affiliate's server when a sale or lead occurs. This method is more reliable and secure, as it isn't affected by ad blockers or browser privacy settings.

This system handles two core events:

Click Tracking: When a user clicks an affiliate link, a click_id is generated and recorded on our server.

Postback Conversion: When that user makes a purchase, the advertiser's server sends a postback request with the original click_id, and our system logs the conversion to the correct affiliate.

🚀 Local Development Setup
Follow these steps to get the backend running on your local machine.

Prerequisites
Node.js: Make sure you have Node.js and npm installed.

PostgreSQL: You need an accessible PostgreSQL database, either locally or hosted online.

Backend Setup
Install Dependencies: Navigate to the backend directory and install the required Node.js packages.

Bash

npm install
Environment Variables: Create a .env file in the backend directory to store your database connection string.

PORT=3001
DATABASE_URL="your_postgresql_connection_string"
Replace your_postgresql_connection_string with your actual database URL.

Database Initialization: Run the setup script to create the necessary tables in your database.

Bash

# Run this command from the backend/database directory if you haven't moved setup.js
node setup.js 
Start the Server: Once the database is ready, start the backend server.

Bash

node server.js
The server will be running on http://localhost:3001.

➡️ Example API Requests
You can use curl or a tool like Postman to test the backend endpoints.

1. Track a Click
This request simulates a user clicking an affiliate link. Use a unique click_id for each test.

Bash

curl "http://localhost:3001/click?affiliate_id=1&campaign_id=1&click_id=TEST_CLICK_001"
2. Send a Postback
This request simulates an advertiser notifying you of a conversion. It must use a click_id that was already tracked.

Bash

curl "http://localhost:3001/postback?affiliate_id=1&click_id=TEST_CLICK_001&amount=25.50&currency=USD"
3. Fetch All Affiliates
This endpoint is used by the frontend to list available affiliates.

Bash

curl "http://localhost:3001/api/affiliates"
4. Fetch Affiliate Data for Dashboard
This endpoint provides all clicks and conversions for a specific affiliate.

Bash

curl "http://localhost:3001/api/affiliate/1"