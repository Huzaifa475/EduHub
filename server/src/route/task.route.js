import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createTask, deleteTask, getATask, getRoomTasks, toggleTaskStatus } from "../controller/task.controller.js";

const router = express.Router();

router.route('/create/:roomId').post(verifyJwt, createTask);

router.route('/delete/:taskId').delete(deleteTask);

router.route('/get-task/:taskId').get(getATask);

router.route('/get-tasks/:roomId').get(getRoomTasks);

router.route('/toggle-status/:taskId').patch(toggleTaskStatus);

export default router;