const MemberController = require('../models/member')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        const jwtSecret = process.env.JWT_SECRET
        const findAcc = await MemberController.findOne({ username })
        if (!findAcc) {
            return res.status(400).json('Username not found!')
        }
        const isMatch = await bcrypt.compare(password, findAcc.password)
        if (!isMatch) {
            return res.status(400).json({ messeage: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({
            memberId: findAcc._id,
            username: findAcc.username
        }, jwtSecret, { expiresIn: '1h' })
        res.json({ success: true, accessToken })
    } catch (error) {
        res.status(500).json({ messeage: error.messeage })

    }
}

exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body
        const findAcc = await MemberController.findOne({ username })
        if (findAcc) {
            res.status(500).json({status: false, message: "User already exists"})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const newAccount = await MemberController.create({
            username: username,
            password: hashPassword
        })
        res.status(201).json(newAccount)
    } catch (error) {
        throw new Error(error.message);
    }
}