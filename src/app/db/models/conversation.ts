import mongoose from "mongoose";
import { UserType } from "./user";
import { MessageType } from "./message";

const conversationSchema = new mongoose.Schema({
  lastMessageAt: { 
    type: Date, 
    default: Date.now 
  },
  name: { 
    type: String, 
    default: "" 
  },
  image: { 
    type: String, 
    default: "" 
  },
  lastMessage: { 
    type: String, 
    default: "" 
  },
  isGroup:{
    type: Boolean,
    default: false
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: []
    },
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},{timestamps: true});

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default Conversation;



export type ConversationType = {
  _id:string
  name:string
  isGroup:boolean
  lastMessageAt:string
  lastMessage:string
  messages:MessageType[]
  image:string
  participants:UserType[];
  createdAt:string
  updatedAt:string
}