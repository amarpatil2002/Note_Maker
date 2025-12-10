const express = require("express")
const { registerUser, loginUser, refreshToken, profile, logout } = require("../controllers/authController")
const verifyToken = require('../middlware/authMiddleware')

const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , loginUser)
router.post('/refresh-token' , refreshToken)
router.post('/logout' , logout)

router.get('/profile',verifyToken , profile)

module.exports = router