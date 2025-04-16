const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMidddleware");
const isAdmin = require("../middleware/isAdmin");
const User = require("../Models/User");
const Post = require("../Models/postModel");
const Comment = require("../Models/commentModel");

// Get all users (admin only)
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete any user (admin only)
router.delete("/user/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update any user (admin only)
router.put("/user/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/user/:id/posts", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .populate("comments")
            .populate("user", "username email");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update any post
router.put("/post/:postId", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete any post
router.delete("/post/:postId", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update any comment
router.put("/comment/:commentId", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete any comment
router.delete("/comment/:commentId", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;