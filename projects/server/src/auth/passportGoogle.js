// import passport
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// import sequelize
const { sequelize } = require('../../models')

// import modals
const db = require('../../models/index')
const users = db.users

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, cb) => {
        try {
            // get users data
            const checkUser = await users.findOne({ where: { 
                provider_id: profile.id
            } })

            // check if users exist or not
            if (checkUser === null) {
                const newUser = await users.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    provider: profile.provider,
                    provider_id: profile.id,
                    is_verified: true
                })

                return cb(null, newUser)
            }
    
            return cb(null, checkUser)
        } catch (error) {
            console.log(error)
        }
    }
))

module.exports = passport