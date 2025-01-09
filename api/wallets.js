import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (pour CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Créer la table si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        address VARCHAR(255) UNIQUE NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (req.method === 'POST') {
      const { wallet } = req.body;

      // Valider l'adresse du wallet
      if (!wallet || !/^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(wallet)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid wallet address format'
        });
      }

      // Sauvegarder le wallet
      try {
        await sql`
          INSERT INTO wallets (address)
          VALUES (${wallet})
          ON CONFLICT (address) DO NOTHING;
        `;

        return res.status(200).json({
          success: true,
          message: 'Wallet address saved successfully'
        });
      } catch (error) {
        if (error.code === '23505') { // Code d'erreur pour violation de contrainte unique
          return res.status(400).json({
            success: false,
            message: 'Wallet address already registered'
          });
        }
        throw error;
      }
    }

    if (req.method === 'GET') {
      // Récupérer tous les wallets
      const wallets = await sql`
        SELECT address, timestamp
        FROM wallets
        ORDER BY timestamp DESC;
      `;

      return res.status(200).json({
        success: true,
        wallets: wallets.rows
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
