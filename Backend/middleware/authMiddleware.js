const jwt = require('jsonwebtoken');
const User = require('../models/users');

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from the environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the decoded token and attach the user object to the request
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error:', error);
      res.status(401).send('Not authorized, token failed');
    }
  } else {
    // If no token is found, return an unauthorized status
    res.status(401).send('Not authorized, no token');
  }
};

module.exports = protect;
