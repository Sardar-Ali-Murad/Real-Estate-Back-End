import mongoose from "mongoose"

let CartSchema=new mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:"RealEstateProperty",
        required:[true,"Provide the Product"]
    },
    quantity:{
        type:Number,
        required:[true,"Provide the Quantity"]
    },
    color:{
      type:String,
      required:[true,"Provide the color"]  
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"RealEstateUsers",
        required:[true,"Provide the User"]
    }
})

export default mongoose.model("RealEstateOrders",CartSchema)