import Auth from "../models/User.js"
import { OAuth2Client } from "google-auth-library"
const client = new OAuth2Client("36805434232-210bfjp0a9rkvj96fj8f7dq6jgo8oahs.apps.googleusercontent.com");
import User from "../models/User.js"
import {StatusCodes} from "http-status-codes"
import attachCookie from '../utils/attachCookie.js';



const Login=async (req,res)=>{
    
  let {idToken}=req.body
  let data=await client.verifyIdToken({idToken,audience:"705164632277-vhv4q8ki9tntsbiv8n0do8l9rdbd1knk.apps.googleusercontent.com"})
  let {email,name,email_verified}=data.payload
  
  if(email_verified){

      
      let AlreadyExistsUser=await User.findOne({email})

      if(AlreadyExistsUser){
            const user = await User.findOne({ email }).select('+password')
            const token = user.createJWT();
            attachCookie({ res, token });
            user.password = undefined;
            res.status(StatusCodes.OK).json({ user, location: user.location })
    }
    
    else{
        let ifAdmin=await User.countDocuments({})
        if(ifAdmin===0){
            req.body.role="admin"
        }
        const user = await User.create({ name, email, password:"2cesqxue",role:req.body.role});
        const token = user.createJWT();
        attachCookie({ res, token });
        res.status(StatusCodes.CREATED).json({
            user:user,
            location: user.location,
        })
    }

    res.status(StatusCodes.OK).json({msg:"Success"})

}



}


export {Login}