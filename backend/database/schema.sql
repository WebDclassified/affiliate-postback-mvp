-- schema.sql

-- Drop tables if they exist to allow for easy recreation
DROP TABLE IF EXISTS conversions;
DROP TABLE IF EXISTS clicks;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS affiliates;

-- Create the affiliates table
CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the campaigns table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the clicks table
-- This is the core table that stores every click event
CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INT NOT NULL,
    campaign_id INT NOT NULL,
    click_id VARCHAR(255) NOT NULL UNIQUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Create the conversions table
-- This table is linked to a click and records a conversion
CREATE TABLE conversions (
    id SERIAL PRIMARY KEY,
    click_id VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (click_id) REFERENCES clicks(click_id) ON DELETE CASCADE
);

-- Seed some initial data for testing
INSERT INTO affiliates (name) VALUES ('Affiliate A'), ('Affiliate B');
INSERT INTO campaigns (name) VALUES ('Summer Sale'), ('Winter Clearance');