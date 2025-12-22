const express = require('express')
const cors = require("cors")
const connectDB = require('./config/db')
const authRouter = require('./routes/authRoutes')
const oauthRouter = require('./routes/oauthRoutes')
require('dotenv').config();
const cookieParser = require("cookie-parser")
const passport = require("passport")
const session = require('express-session');
//Important for OAuth login
require("./config/passport"); 
const notekeeperRoutes = require('./routes/notekeeperRoutes')

const port = process.env.PORT || 8080
const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


// OAuth login
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// db connection
connectDB()

//user authenticaton Login + OAuth routes
app.use('/api/auth' , authRouter)
app.use('/api/auth' , oauthRouter)

//notekeeper routes
app.use('/api', notekeeperRoutes)

app.listen(port , () => {
    console.log(`Server is listening on ${port}`);
})