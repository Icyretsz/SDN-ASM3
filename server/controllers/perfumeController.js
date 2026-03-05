const Perfume = require('../models/perfume')

// Perfume CRUD operations
exports.getAllPerfumes = async (req, res) => {
    try {
        const perfumes = await Perfume.find({}).populate('brand')
        res.json({status: true, data: perfumes})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.createPerfume = async (req, res) => {
    try {
        const perfume = await Perfume.create(req.body)
        res.status(201).json({status: true, data: perfume})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getDetailOfPerfume = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id).populate('brand').populate('comments.author')
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        res.status(200).json({status: true, data: perfume})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.updatePerfume = async (req, res) => {
    try {
        const perfume = await Perfume.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        res.status(200).json({status: true, data: perfume})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deletePerfume = async (req, res) => {
    try {
        const perfume = await Perfume.findByIdAndDelete(req.params.id)
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        res.status(200).json({status: true, data: 'delete ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Comment CRUD operations
exports.getAllComments = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id).populate('comments.author')
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        res.json({status: true, data: perfume.comments})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getDetailOfComment = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id).populate('comments.author')
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        const comment = perfume.comments.id(req.params.commentId)
        if (!comment) {
            return res.status(404).json({status: false, message: 'Comment not found!'})
        }
        res.status(200).json({status: true, data: comment})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.addComment = async (req, res) => {
    try {
        const authorId = req.user._id;
        console.log('user', authorId)
        const perfume = await Perfume.findById(req.params.id);
        if (!perfume) {
            return res.status(404).json({ status: false, message: 'Perfume not found!' });
        }
        console.log('perfume', perfume)
        const alreadyCommented = perfume.comments.some(
            (c) => c.author._id.toString() === authorId.toString()
        );
        if (alreadyCommented) {
            return res.status(400).json({ status: false, message: 'You already commented on this perfume' });
        }

        perfume.comments.push(req.body);
        await perfume.save();
        res.status(201).json({ status: true, data: req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id)
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        const comment = perfume.comments.id(req.params.commentId)
        if (!comment) {
            return res.status(404).json({status: false, message: 'Comment not found!'})
        }
        Object.assign(comment, req.body)
        await perfume.save()
        res.status(200).json({status: true, data: perfume})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id)
        if (!perfume) {
            return res.status(404).json({status: false, message: 'Perfume not found!'})
        }
        const comment = perfume.comments.id(req.params.commentId)
        if (!comment) {
            return res.status(404).json({status: false, message: 'Comment not found!'})
        }
        comment.deleteOne()
        await perfume.save()
        res.status(200).json({status: true, data: 'delete ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
