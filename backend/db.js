// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add this line to handle the self-signed certificate issue
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = {
    /**
     * Executes a database query.
     * @param {string} text - The SQL query string.
     * @param {Array} params - The parameters for the query.
     * @returns {Promise<Object>} The query result.
     */
    query: (text, params) => pool.query(text, params),
};