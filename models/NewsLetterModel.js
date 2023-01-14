import mongoose from "mongoose";
import validator from 'validator'


let NewsLetter=new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
          validator: validator.isEmail,
          message: 'Please provide a valid email',
        },
        unique: true,
      },
})


export default mongoose.model("RealEstateNewsletterEmails",NewsLetter)
