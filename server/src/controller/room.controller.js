import { Room } from "../model/room.model.js";
import asyncHandler from "../util/asyncHandler.js";
import apiError from "../util/apiError.js";
import apiResponse from "../util/apiResponse";
import { Message } from "../model/message.model.js";
import { Task } from "../model/task.model.js";
import { File } from "../model/file.model.js";
import { User } from "../model/user.model.js";
import {isValidObjectId} from "mongoose";

const createRoom = asyncHandler(async(req, res) => {

    const {name, description, publicOrPrivate, tags} = req.body

    if(!name || !description || !publicOrPrivate || !tags){
        throw new apiError(400, 'Please enter the required fields')
    }

    const room = await Room.create({
        name,
        description,
        publicOrPrivate,
        tags,
        admin: req.user?._id
    })

    return res
    .status(200)
    .json(new apiResponse(200, room, "Room created successfully"))
})

const updateRoomData = asyncHandler(async(req, res) => {

    const {roomId} = req.params
    const {name, description, publicOrPrivate, tags} = req.body

    const updateFields = {}

    if(name) updateFields.name = name
    if(description) updateFields.description = description
    if(publicOrPrivate) updateFields.publicOrPrivate = publicOrPrivate
    if(tags) updateFields.tags = tags

    const room = await Room.findByIdAndUpdate(
        roomId,
        {
            ...updateFields
        },
        {
            new: true
        }
    )

    if(!room){
        throw new apiError(404, "Room not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200, room, "Room's Information updated successfully"))
})

const deleteRoom = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    await Room.findByIdAndDelete(roomId)
    await Message.DeleteMany({receiver: roomId})
    await Task.DeleteMany({room: roomId})
    await File.DeleteMany({room: roomId})

    return res
    .status(200)
    .json(new apiResponse(200, "Room deleted successfully"))
})

const userRooms = asyncHandler(async(req, res) => {

    const rooms = await Room.find({
        $or: [
            {admin: req.user._id}, 
            {members: {$in: [req.user._id]}}
        ]
    }).select("-members -requests")


    return res
    .status(200)
    .json(new apiResponse(200, rooms, "Rooms of a user fetch successfully"))
})

const userRequestRooms = asyncHandler(async(req, res) => {

    const rooms = await Room.find(
        {requests: {$in: [req.user?._id]}}
    ).select("-members -requests")

    return res
    .status(200)
    .json(new apiResponse(200, rooms, "Rooms for which user have requested are fetch successfully"))
})

const getRoom = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const room = await Room.findById(roomId).select("-members -requests")

    return res
    .status(200)
    .json(new apiResponse(200, room, "Room fetch successfully"))
})

const getMembers = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const room = await Room.findById(roomId).select("members")

    const users = await User.find({
        _id: {$in: room.members}
    }).select("-password -refreshToken")

    return res
    .status(200)
    .json(new apiResponse(200, users, "Members of the room are fetch successfully"))
})

const getRequests = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const room = await Room.findById(roomId).select("requests")

    const users = await User.find({
        _id: {$in: room.requests}
    }).select("-password -refreshToken")

    return res
    .status(200)
    .json(new apiResponse(200, users, "Requests of the room are fetch successfully"))
})

const removeAMember = asyncHandler(async(req, res) => {

    const {roomId, memberId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    if(!isValidObjectId(memberId)){
        throw new apiError(404, "Member not found")
    }

    await Room.findByIdAndUpdate(
        roomId, 
        {
            members: {
                $pull: {members: memberId}
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new apiResponse(200, "Member removed successfully"))
})

const requestToRoom = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const room = await Room.findById(roomId)

    if(room.publicOrPrivate === 'public'){
        await Room.findByIdAndUpdate(
            roomId,
            {
                $addToSet: {
                    members: req.user?._id
                }
            },
            {
                new: true
            }
        )
    }
    else{
        await Room.findByIdAndUpdate(
            roomId,
            {
                $addToSet: {
                    requests: req.user?._id
                }
            },
            {
                new: true
            }
        )

        const notification = await Notification.create({
            title: "Request to room",
            content: `New Request on room: ${room.name}`,
            receiver: room.admin
        })

        if(!notification){
            throw new apiError(500, "Server error while creating notification")
        }
    }

    return res
    .status(200)
    .json(new apiResponse(200, "Request send successfully"))
})

const requestProcess = asyncHandler(async(req, res) => {

    const {roomId, requestId} = req.params
    const {accept} = req.body

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    if(!isValidObjectId(requestId)){
        throw new apiError(404, "User not found")
    }

    if(accept === true){
        const room = await Room.findByIdAndUpdate(
            roomId,
            {
                $addToSet: {
                    members: requestId
                }
            },
            {
                new: true
            }
        )

        const notification = await Notification.create({
            title: "Request Accepted",
            content: `Your request to room ${room.name} is accepted`,
            receiver: requestId
        })

        if(!notification){
            throw new apiError(500, "Server error while creating notification")
        }
    }
    else{
        await Room.findByIdAndUpdate(
            roomId,
            {
                $pull: {memberId: requestId}
            },
            {
                new: true
            }
        )
    }

    return res
    .status(200)
    .json(new apiResponse(200, "Request Processed successfully"))
})

const searchForRoom = asyncHandler(async(req, res) => {

    const {prompt} = req.body
    const {page=1, limit=10} = req.query

    const words = prompt.match(/\b(\w+)\b/g)

    if (!words || words.length === 0) {
        throw new apiError(400, "Invalid search prompt")
    }

    const rooms = await Room.find({tags: {$in: words}}).skip((page-1) * limit).limit(Number(limit)).select("-members -requests")

    return res
    .status(200)
    .json(new apiResponse(200, rooms, "Rooms fetch successfully"))
})

export {createRoom, updateRoomData, deleteRoom, userRooms, userRequestRooms, getRoom, getMembers, getRequests, removeAMember, requestToRoom, requestProcess, searchForRoom}