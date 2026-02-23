var express = require('express')
var perfumeRouter = express.Router()
const PerfumeController = require('../controllers/perfumeController')

// Perfume routes
perfumeRouter.route('/')
    .get(PerfumeController.getAllPerfumes)
    .post(PerfumeController.createPerfume)

perfumeRouter.route('/:id')
    .get(PerfumeController.getDetailOfPerfume)
    .put(PerfumeController.updatePerfume)
    .delete(PerfumeController.deletePerfume)

// Comment routes
perfumeRouter.route('/:id/comment')
    .get(PerfumeController.getAllComments)
    .post(PerfumeController.addComment)

perfumeRouter.route('/:id/comment/:commentId')
    .get(PerfumeController.getDetailOfComment)
    .put(PerfumeController.updateComment)
    .delete(PerfumeController.deleteComment)

module.exports = perfumeRouter
