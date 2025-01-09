const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Basic auth middleware
const basicAuth = (req, res, next) => {
    // Disable auth in development
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }

    const auth = req.headers.authorization;
    const expectedAuth = process.env.ADMIN_AUTH || 'Basic ' + Buffer.from('admin:pumpboy').toString('base64');

    if (!auth || auth !== expectedAuth) {
        res.set('WWW-Authenticate', 'Basic realm="PumpBoy Admin"');
        return res.status(401).send('Authentication required');
    }

    next();
};

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Initialize PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Successfully connected to database');
    }
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

// API endpoint to get all wallets (for admin purposes)
app.get('/api/wallets', basicAuth, async (req, res) => {
    console.log('Fetching all wallets');
    try {
        const result = await pool.query('SELECT * FROM wallets ORDER BY timestamp DESC');
        console.log('Found wallets:', result.rows);
        res.json({ success: true, wallets: result.rows });
    } catch (err) {
        console.error('Error fetching wallets:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching wallet addresses' 
        });
    }
});

// Admin route
app.get('/admin', basicAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route for static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('- GET / (main page)');
    console.log('- POST /api/wallet');
    console.log('- GET /api/wallets (protected)');
    console.log('- GET /admin (protected)');
});
