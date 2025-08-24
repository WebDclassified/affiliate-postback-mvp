const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = {
    /**
     * @param {string} text - The SQL query string.
     * @param {Array} params - The parameters for the query.
     * @returns {Promise<Object>} The query result.
     */
    query: (text, params) => pool.query(text, params),
};