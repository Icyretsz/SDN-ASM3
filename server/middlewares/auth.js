const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const account = await Member.findById(decoded._id);
    if (!account) return res.status(401).json({ message: 'Account not found' });

    req.user = account;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const userCheck = async (req, res, next) => {

}

module.exports = authMiddleware;