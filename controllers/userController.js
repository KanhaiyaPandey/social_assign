import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { BadRequestError } from "../errors/customErrors.js";

// update user

export const updatetUser = async(req, res) =>{
    const { username, email, profilePic } = req.body;
 
     const user = await User.findById(req.user._id);
 
     if (!user) {
       return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
     }
 
     if (username) user.username = username;
     if (email) user.email = email;
     if (profilePic) user.profilePic = profilePic;
 
     await user.save();
 
     res.status(StatusCodes.OK).json({ user });
  }

//   delete a user

//delete user
export const deleteUser =  async (req, res) => {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  };

//   get a user

 export const getSingleUser =  async (req, res) => {



    // Fetch user details excluding sensitive information
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;

    if(!req.user.followings.includes(req.params.id)){
      const { password, updatedAt, email,followings, followers,isAdmin, ...other } = user._doc;
     res.status(StatusCodes.OK).json(other)
   }

   else{

        // Fetch posts of the user and sort them by createdAt
        const userPosts = await Post.find({ createdBy: req.params.id }).sort({ createdAt: -1 });

        // Include user details and posts in the response
        res.status(200).json({ user: other, posts: userPosts });

     }

  };

  //follow a user

export const follow =  async (req, res) => {
    if (req.user.userId !== req.params.id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userId);
        if (!user.followers.includes(req.user.userId)) {
          await user.updateOne({ $push: { followers: req.user.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(StatusCodes.OK).json("You are now following this profile");
        } else {
          throw new BadRequestError("You allready follow this profile ")
        }
 
    } else {
      throw new BadRequestError("you can't follow yourself");
    }
  };

//  unfollow a user 

export const unfollow = async (req, res) => {
    if (req.user.userId !== req.params.id) {

        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userId);
        if (user.followers.includes(req.user.userId)) {
          await user.updateOne({ $pull: { followers: req.user.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(StatusCodes.OK).json("user unfollowed");
        } else {
          throw new BadRequestError("you dont follow this user");
        }
  
    } else {
      throw new BadRequestError("you can't unfollow yourself");
    }
  };
 