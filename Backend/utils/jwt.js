const jwt = require('jsonwebtoken');

// Use your secret key directly
const secretKey = 'bc1e06add01f10cafe660f022492f1d144c9a0c77725cd846843208d70ed4e63';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
