var express = require('express')
var brandRouter = express.Router()
const BrandController = require('../controllers/brandController')
const {authMiddleware, adminCheck} = require("../middlewares/auth");

brandRouter.use(authMiddleware)
brandRouter.use(adminCheck)

brandRouter.route('/')
    .get(BrandController.getAllBrands)
    .post(BrandController.createBrand)

brandRouter.route('/:id')
    .get(BrandController.getDetailOfBrand)
    .delete(BrandController.deleteBrand)

module.exports = brandRouter
