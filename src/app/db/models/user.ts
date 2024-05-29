import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
    minlength: [6, '密码最小长度6个字符'],
    select: false
  },
  followingIds:{
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    default: []
  },
  avatar: {
    type: String,
  },
  remark:{
    type: String,
    default: ''
  },
  conversationIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: []
    }
  ],
},{timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword:string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose?.models?.User || mongoose.model("User", userSchema);




export type UserType = {
  _id:string
  name:string
  username:string
  password:string
  followingIds:UserType[]
  avatar:string
  image:string
  status:string
  remark:string
  conversationIds:string[];
  createdAt:string
  updatedAt:string
}