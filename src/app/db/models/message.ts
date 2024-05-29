import mongoose from "mongoose";
import { UserType } from "./user";

const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  senderId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  receiverId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  conversationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  unReads:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // createdAt,updatedAt
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;


export type MessageType = {
  _id:string
  body:string
  image:string
  senderId: UserType[]
  receiverId: UserType[]
  conversationId:string;
  unReads:string[];
  createdAt:string
  updatedAt:string
}
