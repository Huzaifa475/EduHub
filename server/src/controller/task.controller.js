import { isValidObjectId } from "mongoose";
import { Task } from "../model/task.model.js";
import apiError from "../util/apiError.js";
import apiResponse from "../util/apiResponse.js";
import asyncHandler from "../util/asyncHandler.js";

const createTask = asyncHandler(async(req, res) => {

    const {title, tasks} = req.body
    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    if(!title || !tasks){
        throw new apiError(400, "Please provide the required fields")
    }

    const task = await Task.create({
        title,
        tasks,
        creator: req.user?._id,
        room: roomId
    })

    if(!task){
        throw new apiError(501, "Server error while creating task")
    }

    return res
    .status(200)
    .json(new apiResponse(200, task, "Task created successfully"))
})

const deleteTask = asyncHandler(async(req, res) => {

    const {taskId} = req.params

    if(!isValidObjectId(taskId)){
        throw new apiError(404, "Error not found")
    }

    await Task.findByIdAndDelete(taskId)

    return res
    .status(200)
    .json(new apiResponse(200, "Task deleted successfully"))
})

const getATask = asyncHandler(async(req, res) => {

    const {taskId} = req.params

    if(!isValidObjectId(taskId)){
        throw new apiError(404, "Error not found")
    }

    const task = await Task.findById(taskId)

    return res
    .status(200)
    .json(new apiResponse(200, task, "Task fetch successfully"))
})

const getRoomTasks = asyncHandler(async(req, res) => {

    const {roomId} = req.params

    if(!isValidObjectId(roomId)){
        throw new apiError(404, "Room not found")
    }

    const tasks = await Task.find({room: roomId}).sort({createdAt: -1})

    return res
    .status(200)
    .json(new apiResponse(200, tasks, "Tasks of a room fetch successfully"))
})

const toggleTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new apiError(404, "Task not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
        throw new apiError(404, "Task not found");
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    return res.status(200).json(new apiResponse(200, "Task toggled successfully"));
});


export {createTask, deleteTask, getATask, getRoomTasks, toggleTaskStatus}