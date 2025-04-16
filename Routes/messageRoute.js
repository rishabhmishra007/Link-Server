const express = require("express")
const isAuthenticated = require("../middleware/authMidddleware.js")
const upload = require("../middleware/multer.js")
const { getMessage, sendMessage } = require("../controllers/messageController.js")

const router = express.Router()

router.post('/send/:id', isAuthenticated, sendMessage);
router.get('/all/:id', isAuthenticated, getMessage);
 
module.exports = router;