const mongoose = require('mongoose')
const memberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    yob: { type: String, required: true },
    gender: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true })
const Member=mongoose.model('Members', memberSchema)
module.exports=Member