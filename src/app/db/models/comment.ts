import mongoose from "mongoose";
import type { PostType } from "./post";
import type { UserType } from "./user";

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: false,
  },
  // 发送此评论的用户id
  userId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  // 评论所属的postId
  postId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  ],
  isRead: {
    type: Boolean,
    default: false,
  },
  // createdAt,updatedAt
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;


export type CommentType = {
  _id:string
  body:string
  image:string
  userId: UserType[]
  postId: PostType[]
  createdAt:string
  updatedAt:string
}
