const express = require('express')
const connectDB = require('./config/db')
const authRouter = require('./routes/authRoutes')
const oauthRouter = require('./routes/oauthRoutes')
require('dotenv').config();
const cookie = require("cookie-parser")
const passport = require("passport")
const session = require('express-session');
//Important for OAuth login
require("./config/passport"); 

const port = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use(cookie())

// OAuth login
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// db connection
connectDB()


app.use('/api/auth' , authRouter)
app.use('/api/auth' , oauthRouter)

app.listen(port , () => {
    console.log(`Server is listening on ${port}`);
})