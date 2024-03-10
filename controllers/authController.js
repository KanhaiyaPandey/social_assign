import { StatusCodes } from "http-status-codes";
import User from "../models/User.js"
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtil.js";
import { UnauthenticatedError } from "../errors/customErrors.js";

//REGISTER
export const register = async (req, res) => {
  const isFirst = await User.countDocuments() === 0;
  req.body.isAdmin = isFirst;

  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    req.profilePicture = response.secure_url;
  }


  const user = await User.create(req.body)
  const {password, ...other} = user._doc;
  res.status(StatusCodes.CREATED).json({ msg: "user created", user: other });
  };


//LOGIN
export const login = async (req, res) =>{
  const user = await User.findOne({email: req.body.email});  
  const isValidUser = user && (await comparePassword(req.body.password, user.password));
  if(!isValidUser) throw new UnauthenticatedError("invalid credentials");

    const token = createJWT({userId: user._id, role: user.isAdmin, username: user.username, followings: user.followings});
    const oneDay = 60*60*1000*24;

    res.cookie("token", token,{ 
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production"
    })
      res.status(StatusCodes.OK).json({msg: "logged in successfully"})
    
};