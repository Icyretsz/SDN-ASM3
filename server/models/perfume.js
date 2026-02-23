const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    rating:{ type: Number, min: 1, max:3, require: true},
    content: {type: String, require: true},
    author:{ type: mongoose.Schema.Types.ObjectId, ref: "Members", require: true }
},{timestamps: true});

const perfumeSchema = new mongoose.Schema({
    perfumeName:{ type: String, require: true},
    uri:{ type: String, require: true},
    price: {type: Number, require: true},
    concentration:{type: String, require: true}, // nồng độ của nước hoa: Extrait, EDP, EDT,…
    description:{type: String, require: true},
    ingredients:{ type: String, require: true},
    volume:{type: Number, require: true},
    targetAudience:{ type: String, require: true},// male, female, unisex
    comments: [commentSchema],
    brand:{type: mongoose.Schema.Types.ObjectId, ref: "Brands", require: true},
},{ timestamps: true, });
const Perfume = mongoose.model('Perfumes', perfumeSchema)
module.exports = Perfume