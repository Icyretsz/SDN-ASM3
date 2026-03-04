const Member = require('../models/member')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const jwtSecret = process.env.JWT_SECRET
        const findAcc = await Member.findOne({ email })
        if (!findAcc) {
            return res.status(400).json('Email not found!')
        }
        const isMatch = await bcrypt.compare(password, findAcc.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({
            _id: findAcc._id,
            email: email,
            name: findAcc.name,
            yob: findAcc.yob,
            gender: findAcc.gender,
            isAdmin: findAcc.isAdmin
        }, jwtSecret, { expiresIn: '1h' })
        res.json({ success: true, data: {
            accessToken: accessToken,
            user: {
                _id: findAcc._id,
                email: email,
                name: findAcc.name,
                yob: findAcc.yob,
                gender: findAcc.gender,
                isAdmin: findAcc.isAdmin
            }
            } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.signUp = async (req, res) => {
    try {
        const { email, password, name, yob, gender } = req.body
        const findAcc = await Member.findOne({ email })
        if (findAcc) {
            return res.status(500).json({status: false, message: "Email already exists"})
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
        res.status(500).json({success: false, message: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { email, name, yob, gender } = req.body
        const currentAccount = req.user
        const jwtSecret = process.env.JWT_SECRET

        if (id !== currentAccount.id && !currentAccount.isAdmin) {
            return res.status(403).json({ success: false, message: "Can't update other user's account" })
        }

        const updated = await Member.findByIdAndUpdate(
            id,
            { email, name, yob, gender },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const accessToken = jwt.sign({
            _id: updated._id,
            email: email,
            name: updated.name,
            yob: updated.yob,
            gender: updated.gender,
            isAdmin: updated.isAdmin
        }, jwtSecret, { expiresIn: '1h' })

        res.status(200).json({ success: true, data: {
            accessToken: accessToken,
            user: {
                _id: updated._id,
                email: email,
                name: updated.name,
                yob: updated.yob,
                gender: updated.gender,
                isAdmin: updated.isAdmin
            }
            } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { oldPassword, newPassword } = req.body
        const currentAccount = req.user

        if (id !== currentAccount.id) {
            return res.status(403).json({ success: false, message: "Can't change other user's password" })
        }

        const member = await Member.findById(id)
        if (!member) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(oldPassword, member.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8)

        await Member.findByIdAndUpdate(id, { password: hashedPassword })

        res.status(200).json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


exports.getUserComments = async (req, res) => {
    try {
        const { id } = req.params
        const Perfume = require('../models/perfume')

        const perfumes = await Perfume.find({ 'comments.author': id })
            .populate('brand')
            .populate('comments.author')

        const userComments = []
        perfumes.forEach(perfume => {
            perfume.comments.forEach(comment => {
                if (comment.author._id.toString() === id) {
                    userComments.push({
                        ...comment.toObject(),
                        perfume: {
                            _id: perfume._id,
                            perfumeName: perfume.perfumeName,
                            uri: perfume.uri,
                            brand: perfume.brand
                        }
                    })
                }
            })
        })

        res.status(200).json({ success: true, data: userComments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

