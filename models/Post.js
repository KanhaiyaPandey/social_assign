import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
        ref: "User"
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default:[]
    }
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
