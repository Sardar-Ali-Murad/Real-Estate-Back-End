import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import sendResetPassswordEmail from '../utils/sendResetPasswordEmail.js';
import createHash from "../utils/createHash.js" 
import crypto from "crypto"

const register = async (req, res) => {
  let ifAdmin=await User.countDocuments({})
  
  if(ifAdmin===0){
    req.body.role="admin"
  }
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password,role });

  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    // user: {
    //   email: user.email,
    //   lastName: user.lastName,
    //   location: user.location,
    //   name: user.name,
    //   role:user.role,

    // },
    user:user,

    location: user.location,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  attachCookie({ res, token });
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name) {
    throw new BadRequestError('Please provide all values');
  }
  // const user = await User.findOne({ _id: req.user.userId });

  // user.email = email;
  // user.name = name;
  // user.lastName = lastName;
  // user.location = location;

  // await user.save();
  const updatedUser = await User.findByIdAndUpdate(
    req.user.userId,
    {
      $set: req.body,
    },
    { new: true }
  );

  const token = updatedUser.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user:updateUser, location: updateUser.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};


const updatePassord=async (req,res)=>{
  let {password,confirmPassword}=req.body

  if(!password || !confirmPassword){
    throw new BadRequestError("Please Provide the both values")
  }

  if(password!==confirmPassword){
    throw new BadRequestError("The Passswords Not Match")
  }

  let user=await User.findOne({_id:req.user.userId})

  user.password=password

  await user.save()

  res.status(StatusCodes.OK).json({msg:"The Password is modified successfully"})
}

const updateImage=async (req,res)=>{
   let {image}=req.body
   let user=await User.findOne({_id:req.user.userId})
   user.image=image
   await user.save()
   res.status(StatusCodes.OK).json({msg:"Success"})
}


// Forget Password Stuff Below

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide  email');
  }

  const user = await User.findOne({ email });

  if(!user){
    throw new BadRequestError("This user does not exists in our system")
  }

  // console.log(email)

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');
    // send email
    const origin = 'http://localhost:3000';
    await sendResetPassswordEmail ({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' });
};



const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email });

  const currentDate = new Date();
  
  if( user.passwordToken !== createHash(token)){
    throw new BadRequestError("Your Token Is Incorrect Please Try Again!")
  }

  if( user.passwordTokenExpirationDate < currentDate){
     throw new BadRequestError("Sorry Your Token Is Expired Try Again!")
  }


  if (user) {
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({msg:"Password Reset Successfully!"});
  
};



export { register, login, updateUser, getCurrentUser, logout, updatePassord,updateImage, forgotPassword,resetPassword };


