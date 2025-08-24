// setup.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Corrected line to load .env from the parent directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); 

const runSetup = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Successfully connected to the database.');

        // This path is already correct since setup.js and schema.sql are in the same directory
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        await client.query(schemaSQL);
        console.log('Database schema and initial data created successfully!');
    } catch (err) {
        console.error('Error creating database schema:', err);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
};

runSetup();