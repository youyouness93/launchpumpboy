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

    // Vérifier que c'est une requête POST
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
    }

    const { wallet } = req.body;

    // Valider l'adresse du wallet
    if (!wallet || !/^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(wallet)) {
        res.status(400).json({ success: false, message: 'Invalid wallet address format' });
        return;
    }

    try {
        // Vérifier si le wallet existe déjà
        const check = await pool.query('SELECT * FROM wallets WHERE address = $1', [wallet]);
        if (check.rows.length > 0) {
            res.status(400).json({ success: false, message: 'Wallet already registered' });
            return;
        }

        // Insérer le nouveau wallet
        await pool.query(
            'INSERT INTO wallets (address, timestamp) VALUES ($1, NOW())',
            [wallet]
        );

        res.status(200).json({ success: true, message: 'Wallet saved successfully' });
    } catch (error) {
        console.error('Error saving wallet:', error);
        res.status(500).json({ success: false, message: 'Error saving wallet' });
    }
};
