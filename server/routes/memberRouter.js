var express = require('express')
var memberRouter = express.Router()
const MemberController = require('../controllers/memberController')
memberRouter.route('/login')
    .post(MemberController.login)
memberRouter.route('/signup')
    .post(MemberController.signUp)
module.exports = memberRouter
