// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes, allowing the frontend to make requests
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------
// Core Affiliate Marketing Endpoints
// -----------------------------------------------------------------

/**
 * Click Tracking Endpoint
 * Example: GET /click?affiliate_id=1&campaign_id=10&click_id=abc123
 * Stores the click event in the database.
 */
app.get('/click', async (req, res) => {
    const { affiliate_id, campaign_id, click_id } = req.query;

    if (!affiliate_id || !campaign_id || !click_id) {
        return res.status(400).json({ status: 'error', message: 'Missing required click parameters.' });
    }

    // Trim the click_id to remove any whitespace or newlines
    const trimmedClickId = click_id.trim();

    try {
        const query = `
            INSERT INTO clicks (affiliate_id, campaign_id, click_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [affiliate_id, campaign_id, trimmedClickId]; // Use the trimmed ID
        const result = await db.query(query, values);

        console.log('Click tracked successfully:', result.rows[0]);
        res.status(200).json({ status: 'success', message: 'Click tracked' });
    } catch (err) {
        console.error('Error tracking click:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});http://localhost:3001/click?affiliate_id=2&campaign_id=2&click_id=abc12347


/**
 * Postback Endpoint (S2S Conversion)
 * Example: GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
 * Validates the click and logs the conversion.
 */
app.get('/postback', async (req, res) => {
    const { affiliate_id, click_id, amount, currency } = req.query;

    if (!affiliate_id || !click_id || !amount || !currency) {
        return res.status(400).json({ status: 'error', message: 'Missing required postback parameters.' });
    }

    try {
        // Step 1: Validate the click_id and affiliate_id
        const validationQuery = `
            SELECT id FROM clicks
            WHERE click_id = $1 AND affiliate_id = $2;
        `;
        const validationResult = await db.query(validationQuery, [click_id, affiliate_id]);

        if (validationResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Click not found or affiliate ID mismatch' });
        }

        // Step 2: Prevent duplicate conversions for the same click_id
        const duplicateCheckQuery = `
            SELECT id FROM conversions
            WHERE click_id = $1;
        `;
        const duplicateCheckResult = await db.query(duplicateCheckQuery, [click_id]);

        if (duplicateCheckResult.rows.length > 0) {
            return res.status(409).json({ status: 'error', message: 'Conversion for this click already exists' });
        }

        // Step 3: Insert the new conversion
        const conversionQuery = `
            INSERT INTO conversions (click_id, amount, currency)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const conversionValues = [click_id, amount, currency];
        const conversionResult = await db.query(conversionQuery, conversionValues);

        console.log('Conversion tracked successfully:', conversionResult.rows[0]);
        res.status(200).json({ status: 'success', message: 'Conversion tracked' });
    } catch (err) {
        console.error('Error tracking conversion:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// -----------------------------------------------------------------
// Endpoints for the Frontend Affiliate Dashboard
// -----------------------------------------------------------------

/**
 * Endpoint to get a list of all affiliates.
 * Used for the "login simulation" on the frontend.
 */
app.get('/api/affiliates', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name FROM affiliates;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching affiliates:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

/**
 * Endpoint to fetch all clicks and conversions for a specific affiliate.
 * Used to populate the dashboard view.
 */
app.get('/api/affiliate/:affiliate_id', async (req, res) => {
    const { affiliate_id } = req.params;
    
    // Simple validation for the affiliate ID from the URL
    if (!affiliate_id || isNaN(parseInt(affiliate_id))) {
        return res.status(400).json({ status: 'error', message: 'Invalid affiliate ID' });
    }

    try {
        // Query to get all clicks for the given affiliate, ordered by timestamp
        const clicksQuery = `
            SELECT
                c.id, c.click_id, c.timestamp,
                camp.name AS campaign_name,
                (SELECT COUNT(*) FROM conversions WHERE click_id = c.click_id) AS conversion_count
            FROM clicks c
            JOIN campaigns camp ON c.campaign_id = camp.id
            WHERE c.affiliate_id = $1
            ORDER BY c.timestamp DESC;
        `;
        const clicksResult = await db.query(clicksQuery, [affiliate_id]);

        // Query to get all conversions for the given affiliate's clicks
        const conversionsQuery = `
            SELECT
                conv.id, conv.click_id, conv.amount, conv.currency, conv.timestamp
            FROM conversions conv
            JOIN clicks c ON conv.click_id = c.click_id
            WHERE c.affiliate_id = $1
            ORDER BY conv.timestamp DESC;
        `;
        const conversionsResult = await db.query(conversionsQuery, [affiliate_id]);

        // Combine the results for a single, easy-to-use response for the frontend
        const responseData = {
            clicks: clicksResult.rows,
            conversions: conversionsResult.rows,
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error('Error fetching affiliate data:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});