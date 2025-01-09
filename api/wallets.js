const { Pool } = require('pg');

// Configuration de la base de données PostgreSQL
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Gérer les requêtes OPTIONS (pour CORS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Récupérer tous les wallets
        const result = await pool.query('SELECT * FROM wallets ORDER BY timestamp DESC');
        res.status(200).json({ success: true, wallets: result.rows });
    } catch (error) {
        console.error('Error fetching wallets:', error);
        res.status(500).json({ success: false, message: 'Error fetching wallets' });
    }
};
