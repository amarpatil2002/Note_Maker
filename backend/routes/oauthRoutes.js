const router = require('express').Router();
const passport = require('passport');
const jwt = require("jsonwebtoken")

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      const user = req.user

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRETE_KEY, { expiresIn: "1m" })
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRETE_KEY, { expiresIn: "7d" })

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: '/'
      })

      res.status(200).json({ success: true, message: "Login Successfull", user, accessToken })

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" })
    }

    // // successful login
    // res.redirect('/'); // or send token / cookie to client
  });

module.exports = router;