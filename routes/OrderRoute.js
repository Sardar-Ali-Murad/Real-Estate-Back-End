import express from "express"

let router=express.Router()

import {CreateOrder,DeleteOrder,getCurrentUserOrders,updateOrder,DeleteAllCart}  from "../controllers/OrderController.js"


router.route("/").post(CreateOrder).get(getCurrentUserOrders)

router.route("/deleteAll").delete(DeleteAllCart)

router.route("/:id").delete(DeleteOrder).patch(updateOrder)


export default router