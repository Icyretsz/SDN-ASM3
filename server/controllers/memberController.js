const Member = require('../models/member')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const jwtSecret = process.env.JWT_SECRET
        const findAcc = await Member.findOne({ email })
        if (!findAcc) {
            return res.status(400).json('Username not found!')
        }
        const isMatch = await bcrypt.compare(password, findAcc.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({
            email: email,
            name: findAcc.name,
            yob: findAcc.yob,
            gender: findAcc.gender,
        }, jwtSecret, { expiresIn: '1h' })
        res.json({ success: true, accessToken })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.signUp = async (req, res) => {
    try {
        const { email, password, name, yob, gender } = req.body
        const findAcc = await Member.findOne({ email })
        if (findAcc) {
            return res.status(500).json({status: false, message: "User already exists"})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const newAccount = await Member.create({
            email: email,
            password: hashPassword,
            name: name,
            yob: yob,
            gender: gender,
        })
        res.status(201).json(newAccount)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}