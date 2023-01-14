import User from "../models/User.js"
import Property from "../models/PropertyModel.js"
import Orders from "../models/CartModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnAuthenticatedError,NotFoundError } from "../errors/index.js"
import checkPermission from "../utils/checkPermissions.js"

export const CreateOrder=async (req,res)=>{
    let {product}=req.body
    let AlreadyExists=await Orders.findOne({product:product,user:req.user.userId})
    if(AlreadyExists){
        throw new BadRequestError("The Orders is Already In The Cart")
    }

    let COrder=await Property.findOne({_id:product})
    if(!COrder){
        throw new BadRequestError("This product notexists")
    }

    req.body.user=req.user.userId
    let Order=await Orders.create(req.body)
    res.status(StatusCodes.CREATED).json({msg:"Success",Order})
}


export const DeleteOrder=async (req,res)=>{
    let DOrder=await Orders.findOne({_id:req.params.id})
    if(!DOrder){
        throw new BadRequestError("The Product is not present")
    }
    if(DOrder.user.toString()!==req.user.userId.toString()){
        throw new UnAuthenticatedError("This product is not yours")
       }
      

    await DOrder.remove()

    res.status(StatusCodes.OK).json({msg:"Success",DOrder})
}

export const getCurrentUserOrders=async (req,res)=>{
    let AllOrders=await Orders.find({user:req.user.userId}).populate("product")
    res.status(StatusCodes.OK).json({AllOrders})
}


export const updateOrder=async (req,res)=>{
   let {quantity}=req.body
   let UOrder=await Orders.findOne({_id:req.params.id})
   if(!UOrder){
    throw new NotFoundError("Sorry the product is not present")
   }
   if(!quantity){
    throw new BadRequestError("Provide the quantity")
   }

   if(UOrder.user.toString()!==req.user.userId.toString()){
    throw new UnAuthenticatedError("This product is not yours")
   }
  

    UOrder.quantity=quantity

    UOrder.save()

    res.status(StatusCodes.OK).json({msg:"Success",UOrder})

}

export const DeleteAllCart=async (req,res)=>{
    let DAOrders=await Orders.deleteMany({user:req.user.userId})
    res.status(StatusCodes.OK).json({msg:"Success"})
}

