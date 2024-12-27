import {User} from '../model/user.model.js';
import apiResponse from '../util/apiResponse.js';
import apiError from '../util/apiError.js';
import asyncHandler from '../util/asyncHandler.js';
import { sendMail } from '../util/nodeMailer.js';
import uploadOnCloudinary from "../util/cloudinary.js";
import crypto from 'crypto';

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()

        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiError(501, "Server error while generating access token and refresh token")
    }
}

const register = asyncHandler(async (req, res) => {

    const {userName, email, password} = req.body;

    if(!userName || !email || !password) {
        throw new apiError(400, 'Please provide all required fields');
    }

    const isUserExist = await User.findOne({$or: [{userName}, {email}]})

    if(isUserExist){
        throw new apiError(403, 'User already exist');
    }

    const user = await User.create({userName, email, password});

    const createdUser = await User.findOne(user?._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(501, "Server error while creating the user")
    }

    return res
    .status(200)
    .json(new apiResponse(200, createdUser, "User registed successfully"))
})

const login = asyncHandler(async(req, res) => {

    const {userName, email, password} = req.body

    if(!password || (!userName && !email)){
        throw new apiError(400, 'Please provide all required fields')
    }

    const user = await User.findOne({$or: [{userName}, {email}]})

    if(!user){
        throw new apiError(400, 'User does not exists, Please Register!!!')
    }

    const isValidPassword = await user.isValidPassword(password)

    if(!isValidPassword){
        throw new apiError(406, 'Please enter valid Password')
    }

    const {refreshToken, accessToken} = await generateAccessRefreshToken(user._id)

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, {user: loggedInUser, refreshToken, accessToken}, "User logged In successfully"))
})

const logout = asyncHandler(async(req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: true
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, "User logged out successfully"))
})

const updateData = asyncHandler(async(req, res) => {

    const {userName, email} = req.body

    const updateFields = {}

    if(userName) updateFields.userName = userName
    if(email) updateFields.email = email

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                ...updateFields
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new apiResponse(200, "User data updated successFully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Current user fetch successfully"))
})

const forgotPassword = asyncHandler(async(req, res) => {

    const {email} = req.body

    if(!email){
        throw new apiError(400, "Please provide the email")
    }

    const user = await User.findOne({email})

    const resetToken = await user.createResetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`

    const message = `We have received a password reset request. Please use the below link to reset the password.\n\n${resetUrl}\n\nThis reset password link is valid only for 10 minutes.`
    try {
        await sendMail({
            email: user.email,
            subject: 'Password change request from EduHub',
            message: message
        })

        return res
        .status(200)
        .json(new apiResponse(200, "Email sent successfully"))
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpiry = undefined

        await user.save({validateBeforeSave: false})

        throw new apiError(500, 'Something went wrong while sending the email.')
    }
})

const resetPassword = asyncHandler(async(req, res) => {

    const {password, confirmPassword} = req.body

    if(!password || !confirmPassword){
        throw new apiError(402, "All fields are required")
    }

    const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken, passwordResetTokenExpiry: {$gt: Date.now()}}).select("-password -refreshToken")

    if(!user){
        throw new apiError(402, "Tokens are invalid or expired")
    }

    if(req.body.password !== req.body.confirmPassword){
        throw new apiError(406, "Please enter the correct password")
    }

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiry = undefined

    await user.save({validateBeforeSave: true})

    return res
    .status(200)
    .json(new apiResponse(200, user, "Password changed successfully"))
})

const uploadPhoto = asyncHandler(async(req, res) => {
    const photoPath = req.file?.path 

    if(!photoPath){
        throw new apiError(400, "Photo is not provided")
    }

    const photo = await uploadOnCloudinary(photoPath)

    if(!photo){
        throw new apiError(500, "Something went wrong will uploading the photo")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            photo: photo.url
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Photo uploaded successfully"))
})

export {register, login, logout, updateData, getCurrentUser, generateAccessRefreshToken, forgotPassword, resetPassword, uploadPhoto}