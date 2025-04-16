const User = require("../Models/User.js");

const isAdmin = async (req, res, next) => {
    try {
        // req.id is set by your isAuthenticated middleware
        const user = await User.findById(req.id);
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false,
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

module.exports = isAdmin