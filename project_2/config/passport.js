// config/passport.js
// Setting up Google OAuth

require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Store user id in session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Get user from session id
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, null);
        }
        done(null, user);
    } catch (error) {
        console.error('Deserialize error:', error);
        done(error, null);
    }
});

// Google OAuth setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists with google id
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Check if user exists with same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                user.googleId = profile.id;
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                lastLogin: new Date()
            });

            done(null, user);
        } catch (error) {
            console.error('Google Strategy error:', error);
            done(error, null);
        }
    }
));

module.exports = passport;