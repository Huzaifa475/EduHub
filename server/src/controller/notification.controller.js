import { Notification } from "../model/notification.model.js";
import asyncHandler from "../util/asyncHandler.js";
import apiResponse from "../util/apiResponse.js";

const deleteNotifications = asyncHandler(async(req, res) => {

    await Notification.deleteMany({receiver: req.user._id})

    return res
    .status(200)
    .json(new apiResponse(200, "Notifications deleted successfully"))
})

const deleteSingleNotification = asyncHandler(async(req, res) => {

    const {notificationId} = req.params;

    await Notification.findByIdAndDelete(notificationId)

    return res
    .status(200)
    .json(new apiResponse(200, "Notification deleted successfully"))
})

const getNotifications = asyncHandler(async(req, res) => {

    const notifications = await Notification.find({receiver: req.user?._id})

    return res
    .status(200)
    .json(new apiResponse(200, notifications, "Notifications fetch successfully"))
})

export {deleteNotifications, deleteSingleNotification, getNotifications}