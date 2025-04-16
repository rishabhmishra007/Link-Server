const express = require("express");
const connectDB = require("./database/db");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const userRoute = require("./Routes/userRoutes");
const postRoute = require("./Routes/postRoutes");
const commentRoute = require("./Routes/commentRoute");
const messageRoute = require("./Routes/messageRoute");
const adminRoute = require("./Routes/adminRoute.js");
const { verify } = require("./controllers/authController");
const User = require("./Models/User");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const {app, server} = require("./socket/socket.js");
const isAuthenticated = require("./middleware/authMidddleware.js");

// const app = express();

const PORT = 8000;

// Connect to the database
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
    }
  },
});

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/admin", adminRoute);

app.get('/api/v1/auth/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(401).json({ status: 'failure', message: 'Unauthorized' });
    }
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ status: 'failure', message: 'Server error' });
  }
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).send(`${req.method} Route ${req.path} not found`);
});

// Start server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
