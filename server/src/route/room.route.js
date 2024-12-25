import express from "express";
import { createRoom, deleteRoom, getMembers, getRequests, getRoom, removeAMember, requestProcess, requestToRoom, searchForRoom, updateRoomData, userRequestRooms, userRooms } from "../controller/room.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/create').post(verifyJwt, createRoom);

router.route('/update/:roomId').patch(updateRoomData);

router.route('/delete/:roomId').delete(deleteRoom);

router.route('/user-rooms').get(verifyJwt, userRooms);

router.route('/user-requests').get(verifyJwt, userRequestRooms);

router.route('/get-room/:roomId').get(getRoom)

router.route('/get-members/:roomId').get(getMembers);

router.route('/get-requests/:roomId').get(getRequests);

router.route('/remove/:roomId/:memberId').patch(removeAMember);

router.route('/request-room/:roomId').post(verifyJwt, requestToRoom);

router.route('/request-process/:roomId/:requestId').post(requestProcess);

router.route('/search-room').get(searchForRoom);

export default router;