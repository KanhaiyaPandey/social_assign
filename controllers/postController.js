import Post  from "../models/Post.js";
import User  from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/customErrors.js";

//create a post

export const createPost = async (req, res) => {
    req.body.createdBy = req.user.userId
    req.body.title = req.user.username;
    const post = await Post.create(req.body);

    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      post.img = response.secure_url;
    }
    res.status(StatusCodes.CREATED).json({ post });
  };


//update a post

export const updatePost = async (req, res) => {

    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.userId) {
      await post.updateOne({ $set: req.body });
      res.status(StatusCodes.OK).json({msg: "the post has been updated"});
    } else {
      throw new UnauthenticatedError("You can only update your ouw posts")
    }
};


//delete a post

export const deletePost = async (req, res) => {

    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({msg: "the post has been deleted"});
    } else {
      throw new UnauthenticatedError("You can delete you own posts");
    }
};

//like / dislike a post

export const likePost = async (req, res) => {

    const post = await Post.findById(req.params.id);
    

    if (!post.likes.includes(req.user.userId)) {
      await post.updateOne({ $push: { likes: req.user.userId } });
      res.status(StatusCodes.OK).json({msg: "The post has been liked", creator: post.createdBy, followings: req.user.followings});
    } else {
      await post.updateOne({ $pull: { likes: req.user.userId } });
      res.status(StatusCodes.OK).json({msg: "The post has been disliked"});
    }
};

// comment on a post 

export const comment = async (req, res) => {

  const post = await Post.findById(req.params.id);


  const comment = {
      user : req.user.userId,
      text : req.body.comment
  }
  await post.updateOne({ $push: { comments: comment } });
  res.status(StatusCodes.OK).json("Commented succesfully");

}

//get a post

export const getSinglePost = async (req, res) => {

    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
    
};

//get timeline posts

export const getAllPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });

    // Check if the user has any friends (followings)
    if (req.user.followings.length === 0) {
      res.status(StatusCodes.OK).json(userPosts);
    } else {
      const friendPosts = await Promise.all(
        req.user.followings.map(async (friendId) => {
          const posts = await Post.find({ createdBy: friendId }).sort({ createdAt: -1 });
          return posts;
        })
      );
      const allPosts = userPosts.concat(...friendPosts).sort((a, b) => b.createdAt - a.createdAt);
      res.status(StatusCodes.OK).json(allPosts);
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};
