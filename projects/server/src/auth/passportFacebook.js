const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const {sequelize} = require('../../models')
const {Op} = require('sequelize')

require('dotenv').config()

const db = require('../../models/index')
const users = db.users

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
    profileFields: ['displayName', 'email']
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        console.log(profile, 'profile')
        const checkEmail = await users.findOne({
            where: {
                [Op.and]: [
                    { email: profile?.emails[0].value },
                    {
                        [Op.or]: [
                        { provider: 'website' },
                        {provider: "google"}       
                    ]}
               ]
            }
        })
        if (checkEmail) return cb(null, false, { message: 'Email already registered' })
        
        const checkUser = await users.findOne({
            where: {
                provider_id: profile.id
            }
        })
        
        if (checkUser) {
            cb(null, checkUser)
        } else {
            if (profile.emails === undefined) {
                const newUser = await users.create({
                username: profile.displayName,
                provider: 'facebook',
                provider_id: profile.id,
                is_verified: true
                })
                return cb(null, newUser)
            } else {

                const newUser = await users.create({
                    username: profile.displayName,
                    email: profile.emails[0]?.value || "",
                    provider: 'facebook',
                    provider_id: profile.id,
                    is_verified: true
                })
                return cb(null, newUser)
            }
        }

    } catch (error) {
        console.log(error)
    }
}
))

module.exports = passport