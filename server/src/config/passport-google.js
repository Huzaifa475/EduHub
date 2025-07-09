import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import { User } from "../model/user.model.js";
import { generateAccessRefreshToken } from "../controller/user.controller.js";
import dotenv from "dotenv";

passport.use(
    new GoogleStrategy(
        {
            callbackURL: "https://eduhub-aj7z.onrender.com/api/v1/users/google-login/callback",
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({googleId: profile.id})

                if(!user){

                    const googleUser = {
                        id: profile.id,
                        displayName: profile.name.givenName || profile.displayName,
                        email: profile.emails[0].value
                    }

                    user = await User.create({
                        userName: googleUser.displayName,
                        isGoogleUser: true,
                        googleId: googleUser.id,
                        email: googleUser.email
                    })
                }
                // if (!user) {
                //     const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
                
                //     if (existingEmailUser) {
                //         existingEmailUser.googleId = profile.id;
                //         existingEmailUser.isGoogleUser = true;
                //         user = await existingEmailUser.save();
                //     } else {
                //         const googleUser = {
                //             id: profile.id,
                //             displayName: profile.name.givenName || profile.displayName,
                //             email: profile.emails[0].value
                //         };
                
                //         user = await User.create({
                //             userName: googleUser.displayName,
                //             isGoogleUser: true,
                //             googleId: googleUser.id,
                //             email: googleUser.email
                //         });
                //     }
                // }

                const tokens = await generateAccessRefreshToken(user?._id)

                done(null, {user, tokens})
            } catch (error) {
                done(error, null)
            }
        }
    )
)

passport.serializeUser((userId, done) => {
    done(null, userId)
})

passport.deserializeUser((userId, done) => {
    done(null, userId)
})

export default passport;