const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

// API endpoint to save wallet
app.post('/api/wallet', async (req, res) => {
    console.log('Received wallet submission:', req.body);
    const { wallet } = req.body;
    
    // Validate wallet address
    if (!wallet || !/^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(wallet)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid wallet address format' 
        });
    }

    try {
        // Insert wallet into database
        const result = await pool.query(
            'INSERT INTO wallets (address) VALUES ($1) ON CONFLICT (address) DO NOTHING RETURNING id',
            [wallet]
        );

        // Check if wallet was actually inserted
        if (result.rowCount === 0) {
            return res.json({ 
                success: false, 
                message: 'Wallet address already registered' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Wallet address saved successfully' 
        });
    } catch (err) {
        console.error('Error saving wallet:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving wallet address' 
        });
    }
});

// API endpoint to get all wallets
app.get('/api/wallets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wallets ORDER BY timestamp DESC');
        res.json({ success: true, wallets: result.rows });
    } catch (err) {
        console.error('Error fetching wallets:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching wallet addresses' 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}`);
});
