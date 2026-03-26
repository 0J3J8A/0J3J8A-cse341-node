// config/passport.js
// Passport configuration for Google OAuth 2.0

require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session - stores only the user ID in the session
passport.serializeUser((user, done) => {
    console.log(' Serializing user:', user._id);
    done(null, user._id);
});

// Deserialize user from session - retrieves full user object from ID
passport.deserializeUser(async (id, done) => {
    try {
        console.log(' Deserializing user ID:', id);
        const user = await User.findById(id);
        if (!user) {
            console.log(' User not found for ID:', id);
            return done(null, null);
        }
        console.log(' User deserialized:', user.email);
        done(null, user);
    } catch (error) {
        console.error(' Deserialize error:', error);
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(' Google profile received:', profile.displayName);
            console.log(' Email:', profile.emails[0].value);
            
            // Check if user already exists with googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                console.log(' Existing user found (by googleId):', user.email);
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Check if user exists with same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                console.log(' Linking Google account to existing user:', user.email);
                user.googleId = profile.id;
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Create new user
            console.log(' Creating new user for:', profile.emails[0].value);
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                lastLogin: new Date()
            });

            console.log(' New user created:', user.email);
            done(null, user);
        } catch (error) {
            console.error(' Error in Google Strategy:', error);
            done(error, null);
        }
    }
));

console.log(' Passport Google Strategy configured');

module.exports = passport;