const Brand=require('../models/brand')
const Perfume=require('../models/perfume')

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
        const { brandName } = req.body
        
        // Check for duplicate brand name (case-insensitive)
        const existingBrand = await Brand.findOne({ 
            brandName: { $regex: new RegExp(`^${brandName}$`, 'i') } 
        })
        
        if (existingBrand) {
            return res.status(409).json({
                status: false, 
                message: 'A brand with this name already exists'
            })
        }
        
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

exports.updateBrand = async (req, res) => {
    try {
        const { brandName } = req.body
        
        // Check for duplicate brand name (case-insensitive), excluding current brand
        const existingBrand = await Brand.findOne({ 
            brandName: { $regex: new RegExp(`^${brandName}$`, 'i') },
            _id: { $ne: req.params.id }
        })
        
        if (existingBrand) {
            return res.status(409).json({
                status: false, 
                message: 'A brand with this name already exists'
            })
        }
        
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {new: true})
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
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ status: false, message: 'Brand not found!' });
    }

    await Perfume.deleteMany({ brand: req.params.id });
    await Brand.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: true, data: 'delete ok' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};