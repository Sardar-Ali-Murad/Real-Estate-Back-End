import express from "express"

let router=express.Router()
import {AddProperty,DelProperty,AllProperty,updateProperty,getFeaturedProducts,getSingleProperty,AllPropertiesWithOutFilters}  from '../controllers/PropertyController.js'
import Authenticate from "../middleware/auth.js"
import UploadImage from "../controllers/UploadImage.js"

router.route("/").post(Authenticate,AddProperty).get(AllProperty)
router.route("/featured").get(getFeaturedProducts)
router.route("/allProperties").get(AllPropertiesWithOutFilters)
router.route("/:id").delete(Authenticate,DelProperty).patch(Authenticate,updateProperty).get(getSingleProperty)
router.route("/Image").post(UploadImage)

export default router

