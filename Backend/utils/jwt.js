const jwt = require('jsonwebtoken');

// Use your secret key directly
const secretKey = process.env.JWT_SECRET;


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
