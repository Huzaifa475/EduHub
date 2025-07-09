import express from "express";
import { getCurrentUser, login, logout, register, updateData, forgotPassword, resetPassword, uploadPhoto} from "../controller/user.controller.js";
import {verifyJwt} from "../middleware/auth.middleware.js";
import passport from "../config/passport-google.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/logout').post(verifyJwt, logout)

router.route('/update').patch(verifyJwt, updateData)

router.route('/get-current').get(verifyJwt, getCurrentUser)

router.route('/forgot-password').post(forgotPassword)

router.route('/reset-password/:token').patch(resetPassword)

router.route('/upload-photo').post(verifyJwt, upload.single('photo'), uploadPhoto)

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
                secure: true,
                path: '/'
            }

            res.cookie("accessToken", tokens.accessToken, options)
            res.cookie("refreshToken", tokens.refreshToken, options)
            res.redirect(`https://eduhub-client.onrender.com/home?login=${user.userName}&accessToken=${tokens.accessToken}`)
        } catch (error) {
            res.redirect("https://eduhub-client.onrender.com")
        }
    }
);

export default router;