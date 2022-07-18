const Comment = require("../models/Comment");

exports.addOne = async(req, res) => {
    try {
        if(!req.body.text || !req.body.userID || !req.body.blogID){
            return res.status(404).json({
                message: "please fill All fields properly",
                success: true
            });
        }
        const newRecord = new Comment({
            text: req.body.text,
            createdBy: req.body.userID,
            blog: req.body.blogID,
        });
        await newRecord.save();
        return res.status(201).json({
            message: "comment created successfully",
            success: true,
            data: newRecord
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

exports.getAll = async(req, res) => {
    try {
        const comments = await Comment.find();
        if(!comments) {
            return res.status(404).json({
                message: "comments not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "comments fetched successfully",
            success: true,
            comments
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};
exports.removeOne = async(req, res) => {
    try {
        const deleted = await Comment.findByIdAndDelete(req.params.id);
        if(!deleted) {
            return res.status(404).json({
                message: "Item not found",
                success: false,
            });
        }
        return res.status(204).json({
            message: "Item successfully deleted",
            success: true,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

