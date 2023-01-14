import mongoose from "mongoose"


let Property=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide the name"]
    },
    price:{
        type:Number,
        required:[true,"Provide the price"]
    },
    image:{
        type:String,
        required:[true,"Provide the iamge"]
    },
    company:{
        type:String,
        required:[true,"Provide the company"]
    },
    description:{
        type:String,
        required:[true,"Provide the description"]
    },
    category:{
        type:String,
        required:[true,"Provide the category"]
    },
    shipping:{
        type:Boolean,
        default:false
    },
    colors:{
        type:Array,
        required:[true,"Provide the array"]
    },
    featured:{
        type:Boolean,
        default:false
    }

})

export default mongoose.model('RealEstateProperty', Property)


