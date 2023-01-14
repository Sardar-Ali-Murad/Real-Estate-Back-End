import Property from "../models/PropertyModel.js"
import { StatusCodes } from "http-status-codes"

import {BadRequestError,NotFoundError,UnAuthenticatedError} from "../errors/index.js"

import User from "../models/User.js"


export const AddProperty=async (req,res)=>{
    let user=await User.findOne({_id:req.user.userId})

    if(user.role!=="admin"){
        throw new UnAuthenticatedError("You cannot access this route")
    }

    let CProperty=await Property.create(req.body)

    res.status(StatusCodes.CREATED).json({msg:"Success",CProperty})
}


export const DelProperty=async (req,res)=>{
    let user=await User.findOne({_id:req.user.userId})

    if(user.role!=="admin"){
        throw new UnAuthenticatedError("You cannot access this route")
    }

    let dProperty=await Property.findOne({_id:req.params.id})

    if(!dProperty){
        throw new NotFoundError("The Product is not present")
    }

    await dProperty.remove()

    res.status(StatusCodes.CREATED).json({msg:"Success",dProperty})
}


export const AllProperty=async (req,res)=>{
    const { search,category,company,color,freeShipping,sort,price } = req.query;

    const queryObject = {
    }
  
  
    if (category && category !== 'All') {
      queryObject.category = category;
    }

    if (company && company !== 'All') {
      queryObject.company = company;
    }

    if (search) {
      queryObject.name = { $regex: search, $options: 'i' };
    }
   
    if(price){
      queryObject.price={$gte:price}
    }
    console.log(color)

    if(color){
      queryObject.colors={$in:[color]}
    }
    // if(freeShipping!==undefined){
    //   queryObject.shipping=freeShipping
    // } 

    // NO AWAIT
  
    let result = Property.find(queryObject);
  
    // chain sort conditions
  
    if (sort === 'price (Lowest)') {
      result = result.sort('price');
    }
    if (sort === 'price (highest)') {
      result = result.sort('-price');
    }
    if (sort === 'name(a-z)') {
      result = result.sort('name');
    }
    if (sort === 'name(z-a)') {
      result = result.sort('-name');
    }

    
    const Properties = await result

    res.status(StatusCodes.OK).json({Properties})
    
    // result=result.filter((product)=>product?.colors.includes(color))
    
    // result=result.status(StatusCodes.OK).json({ Properties });


//    Properties=Properties.filter((all)=>all?.price>=Number(price))

  
 
    
    // db.collection.find({
    //     "skill": {
    //       "$in": [ "python", "css" ]
    //     }
    //   })

    // db.collection.find({price: {$gte: 501, $lte: 1000}}).sort({price:1})
}




export const updateProperty=async (req,res)=>{
    let user=await User.findOne({_id:req.user.userId})

    if(user.role!=="admin"){
        throw new UnAuthenticatedError("You cannot access this route")
    }

    const updatedVideo = await Property.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(StatusCodes.OK).json({msg:"Updated Successflly", updatedVideo})

}

export const getFeaturedProducts=async (req,res)=>{
   let FProperty=await Property.find({featured:true})
   res.status(StatusCodes.OK).json({featured:FProperty}) 
}


export const getSingleProperty=async (req,res)=>{
  let SProperty=await Property.findOne({_id:req.params.id})
  res.status(StatusCodes.OK).json({Property:SProperty})
}



export const AllPropertiesWithOutFilters=async (req,res)=>{
  let PropertiesAll=await Property.find({})
  res.status(StatusCodes.OK).json({PropertiesAll})
}