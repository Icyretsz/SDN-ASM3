const Brand=require('../models/brand')

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find({})
        res.json({status: true, data: brands})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.createBrand = async (req, res) => {
    try {
        const brand = await Brand.create(req.body)
        res.status(201).json({status: true, data: brand})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getDetailOfBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
        if (!brand) {
            return res.status(404).json({status: false, message: 'Brand not found!'})
        }
        res.status(200).json({status: true, data: brand})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id)
        if (!brand) {
            return res.status(404).json({status: false, message: 'Brand not found!'})
        }
        res.status(200).json({status: true, data: 'delete ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}