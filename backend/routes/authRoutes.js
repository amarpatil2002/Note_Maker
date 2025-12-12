const express = require("express")
const { registerUser, loginUser, refreshToken, dashboard, logout, revokeGoogle } = require("../controllers/authController")
const verifyToken = require('../middlware/authMiddleware')

const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , loginUser)
router.post('/refresh-token' , refreshToken)
router.post('/logout' , logout)
router.post('/revoke-google', revokeGoogle)

router.get('/dashboard',verifyToken , dashboard)

module.exports = router