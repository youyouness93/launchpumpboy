// Basic Auth Middleware
export function basicAuth(req, res) {
    // Make auth header string
    const expectedAuth = 'Basic ' + Buffer.from('pumpboy:tothemoon').toString('base64');
    
    // Get auth header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader !== expectedAuth) {
        res.setHeader('WWW-Authenticate', 'Basic realm="PumpBoy Admin"');
        res.status(401).json({ message: 'Authentication required' });
        return false;
    }
    
    return true;
}
