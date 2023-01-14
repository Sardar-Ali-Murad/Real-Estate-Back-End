import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false,
  },

  // For the reset password
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },

  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'lastName',
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
  role:{
    type:String,
    enum:["user","admin"],
    required:[true,"Provide the role of the person"],
    default:"user"
  },
  publicName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  position: {
    type: String,
    // minlength: 3,
    maxlength: 20,
    trim: true,
  },
   license: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  mobileNo: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  whatsAppNo: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  taxNo: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  language:{
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  company:{
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  address:{
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  serviceAreas:{
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  about:{
    type: String,
    minlength: 3,
    maxlength: 200,
    trim: true,
  },
  facebook:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  twitter:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  linkedin:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  instagram:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  googlePlus:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  youtube:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  skype:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  website:{
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },

  image:{
    type:String,
  }

})

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('RealEstateUsers', UserSchema)
