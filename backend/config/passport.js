const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/userAuthModel")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        //Check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id })

        // If not found, check if email exists (merge accounts)
        if (!user) {
            const email = profile.emails?.[0].value
            user = await User.findOne({ email })

            if (user) {
                user.googleId = profile.id,
                user.avatar = profile.photos?.[0]?.value
                await user.save()
            } else {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value
                })
            }

        }
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})
