import {User} from '../model/user.model.js';
import apiResponse from '../util/apiResponse.js';
import apiError from '../util/apiError.js';
import asyncHandler from '../util/asyncHandler.js';

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(user)

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



export {register, login}