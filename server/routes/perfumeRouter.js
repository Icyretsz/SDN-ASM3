var express = require('express')
var perfumeRouter = express.Router()
const PerfumeController = require('../controllers/perfumeController')
const {authMiddleware, adminCheck, userCheck} = require("../middlewares/auth");

perfumeRouter.route('/')
    .get(PerfumeController.getAllPerfumes)
    .post(authMiddleware, adminCheck, PerfumeController.createPerfume)

perfumeRouter.route('/:id/comment/:commentId')
    .get(PerfumeController.getDetailOfComment)
    .put(authMiddleware, adminCheck, PerfumeController.updateComment)
    .delete(authMiddleware, adminCheck, PerfumeController.deleteComment)

perfumeRouter.route('/:id/comment')
    .get(PerfumeController.getAllComments)
    .post(authMiddleware, userCheck, PerfumeController.addComment)

perfumeRouter.route('/:id')
    .get(PerfumeController.getDetailOfPerfume)
    .put(authMiddleware, adminCheck, PerfumeController.updatePerfume)
    .delete(authMiddleware, adminCheck, PerfumeController.deletePerfume)

module.exports = perfumeRouter
