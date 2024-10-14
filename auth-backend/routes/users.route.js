// users.route.js

import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import getUsers from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);

export default router;
