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
      // Get wallet address from request body
      const { wallet } = req.body

      // Validate wallet address
      if (!wallet || !/^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(wallet)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid wallet address format'
        })
      }

      try {
        // Save wallet to database
        const savedWallet = await prisma.wallet.create({
          data: {
            address: wallet
          }
        })

        return res.json({
          success: true,
          message: 'Wallet address saved successfully',
          wallet: savedWallet
        })
      } catch (error) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
          return res.json({
            success: false,
            message: 'Wallet address already registered'
          })
        }
        throw error
      }
    }
    
    else if (req.method === 'GET') {
      // Get all wallets
      const wallets = await prisma.wallet.findMany({
        orderBy: {
          timestamp: 'desc'
        }
      })

      return res.json({
        success: true,
        wallets
      })
    }
    
    else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
