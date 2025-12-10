const express = require('express')
const connectDB = require('./config/db')
const router = require('./routes/authRoutes')
require('dotenv').config();
const cookie = require("cookie-parser")

const port = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use(cookie())

connectDB()

app.use('/api/auth' , router)

app.listen(port , () => {
    console.log(`Server is listening on ${port}`);
})