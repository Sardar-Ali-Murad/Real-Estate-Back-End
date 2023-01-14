import NewsModel from "../models/NewsLetterModel.js"
import {BadRequestError}  from "../errors/index.js"
import { StatusCodes } from "http-status-codes"

export const UserEmail=async (req,res)=>{
    let {email}=req.body

    if(!email){
        throw new BadRequestError("Please Provide the email")
    }

    let AlreadyExists=await NewsModel.findOne({email:email})
    if(AlreadyExists){
       throw new BadRequestError("You Have Already Suscribed With Us")
    }

    let Email=await NewsModel.create({email})

    res.status(StatusCodes.CREATED).json({msg:"Thanks For Subscribing!"})
}

