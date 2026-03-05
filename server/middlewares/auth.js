const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const account = await Member.findById(decoded._id);
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

    req.user = account;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const adminCheck = async (req, res, next) => {
  try {
    const user = req.user
    if (!user.isAdmin) return res.status(401).json({success: false, message: 'Unauthorized'})

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Internal Server Error' });
  }
};

const userCheck = async (req, res, next) => {
  try {
    const user = req.user
    if (user.isAdmin) return res.status(401).json({success: false, message: 'Members only'})
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Internal Server Error' });
  }
}

module.exports = { authMiddleware, adminCheck, userCheck };