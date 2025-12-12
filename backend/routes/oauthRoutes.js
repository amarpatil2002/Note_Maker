const router = require('express').Router();
const passport = require('passport');
const jwt = require("jsonwebtoken")

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async(req, res) => {
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

      user.refreshToken = refreshToken
      await user.save()
      res.redirect(`http://localhost:5173/oauth/success?accessToken=${accessToken}`);

    } catch (error) {
      res.redirect("http://localhost:5173/login");
    }

    // // successful login
    // res.redirect('/'); // or send token / cookie to client
  });

module.exports = router;