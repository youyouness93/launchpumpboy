import prisma from '../lib/prisma'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'POST') {
      console.log('Received request body:', req.body); // Debug log
      
      // Get wallet address from request body
      const { wallet } = req.body

      // Validate wallet address
      if (!wallet) {
        console.log('No wallet provided'); // Debug log
        return res.status(400).json({
          success: false,
          message: 'No wallet address provided'
        })
      }

      try {
        console.log('Saving wallet:', wallet); // Debug log
        // Save wallet to database
        const savedWallet = await prisma.wallet.create({
          data: {
            address: wallet
          }
        })
        console.log('Wallet saved:', savedWallet); // Debug log

        return res.status(200).json({
          success: true,
          message: 'Wallet address saved successfully',
          wallet: savedWallet
        })
      } catch (error) {
        console.error('Database error:', error); // Debug log
        // Handle unique constraint violation
        if (error.code === 'P2002') {
          return res.status(200).json({
            success: false,
            message: 'Wallet address already registered'
          })
        }
        throw error
      }
    } else if (req.method === 'GET') {
      const wallets = await prisma.wallet.findMany({
        orderBy: {
          timestamp: 'desc'
        }
      })
      return res.status(200).json({
        success: true,
        wallets
      })
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}
