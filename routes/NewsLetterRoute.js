import express from "express"
let router=express.Router()

import {UserEmail} from "../controllers/NewsLetterController.js"

router.route("/").post(UserEmail)

export default router