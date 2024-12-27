import express from "express";
import { getCurrentUser, login, logout, register, updateData, forgotPassword, resetPassword} from "../controller/user.controller.js";
import {verifyJwt} from "../middleware/auth.middleware.js";
import passport from "../config/passport-google.js";

const router = express.Router();

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/logout').post(verifyJwt, logout)

router.route('/update').patch(verifyJwt, updateData)

router.route('/get-current').get(verifyJwt, getCurrentUser)

router.route('/forgot-password').post(forgotPassword)

router.route('/reset-password/:token').patch(resetPassword)

// router.route('/google-login').get(passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     prompt: 'consent'
// }))

router.get('/google-login', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent'
}));

router.get(
    "/google-login/callback",
    passport.authenticate("google"),
    async(req, res) => {
        try {
            const {user, tokens} = req.user

            const options = {
                httpOnly: true,
                secure: true
            }

            res.cookie("accessToken", tokens.accessToken, options)
            res.cookie("refreshToken", tokens.refreshToken, options)
            res.redirect(`http://localhost:5173/home?login=${user.userName}`)
        } catch (error) {
            res.redirect("http://localhost:5173")
        }
    }
);

// router.route('/google-login/callback').get(passport.authenticate('google'), async(req, res) => {
//     try {
//         const {user, tokens} = req.user

//         const options = {
//             httpOnly: true,
//             secure: true
//         }

//         res.cookie("accessToken", tokens.accessToken, options)
//         res.cookie("refreshToken", tokens.refreshToken, options)
//     } catch (error) {
//         res.redirect("http://localhost:3000/api/v1/user")
//     }
// })

export default router;