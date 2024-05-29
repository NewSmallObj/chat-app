import mongoose from "mongoose";
import type { UserType } from "./user";
import type { CommentType } from "./comment"

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default:[],
  },
  // 发送者id
  userId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  likedIds:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  comment:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    }
  ],
  // createdAt,updatedAt
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;


export type PostType = {
  _id:string
  body:string
  images:string[]
  userId: UserType[]
  likedIds: string[]
  comment:CommentType[]
  createdAt:string
  updatedAt:string
}
