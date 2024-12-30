import asyncHandler from "../util/asyncHandler.js";
import apiError from "../util/apiError.js";
import apiResponse from "../util/apiResponse.js";
import {deleteFromGoogleCloud, uploadOnGoogleCloud} from "../util/googleCloud.js";
import {File} from "../model/file.model.js";
import { isValidObjectId } from "mongoose";

const uploadFile = asyncHandler(async(req, res) => {

    const filePath = req.file?.path 
    const {roomId} = req.params

    if(!filePath){
        throw new apiError(402, "Please provide the file")
    }

    const result = await uploadOnGoogleCloud(filePath, req.file.originalname);

    if(!result){
        throw new apiError(501, 'Server error while uploading the file')
    }

    const file = await File.create({
        fileName: result[0].metadata.name,
        fileType: result[0].metadata.contentType,
        fileUrl: result[0].metadata.mediaLink,
        uploader: req.user?._id,
        room: roomId
    })

    if(!file){
        throw new apiError(501, "Server error occured while creating file document")
    }

    return res
    .status(200)
    .json(new apiResponse(200, file, "File uploaded successfully"))
})

const getAFile = asyncHandler(async(req, res) => {

    const {fileId} = req.params

    if(!isValidObjectId(fileId)){
        throw new apiError(404, "File not found")
    }

    const file = await File.findById(fileId)

    return res
    .status(200)
    .json(new apiResponse(200, file, "File fetch successfully"))
})

const getRoomFiles = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const files = await File.find({room: roomId})

    return res
    .status(200)
    .json(new apiResponse(200, files, "Files of a room are fetch successfully"))
})

const deleteAFile = asyncHandler(async(req, res) => {

    const {fileId} = req.params

    if(!isValidObjectId(fileId)){
        throw new apiError(404, "File not found")
    }

    const file = await File.findByIdAndDelete(fileId)

    const result = await deleteFromGoogleCloud(file.fileName)

    return res
    .status(200)
    .json(new apiResponse(200, result, "File deleted successfully"))
})

export {uploadFile, getAFile, getRoomFiles, deleteAFile}