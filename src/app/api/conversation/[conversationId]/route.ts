import dbConnect from "@/app/db/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import Conversation from "@/app/db/models/conversation";
import getSession from '@/app/action/getSession';
import Message from "@/app/db/models/message";
import User from "@/app/db/models/user";

dbConnect();

interface IParams {
  conversationId?: string;
}
export async function GET(
  request: NextRequest,
  { params }: { params: IParams }
){
  try {
    const conversation = await Conversation.findById(params.conversationId).populate("messages")
    return NextResponse.json({code:200,data:conversation,msg:"操作成功"})
  } catch (error) {
    console.log(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
){
  const data = await request.json()
  const session = await getSession();
  const senderId = session?.user?.userId;
  const { receiverId,body,image } = data;


  // 创建消息并添加消息
  const newMessage = new Message({
    senderId,
    receiverId,
    body,
    image,
    conversationId: params.conversationId,
    unReads:[receiverId] // 单聊时未读消息为单个接收者 群聊时未读消息为多个接收者
  });

  const [ conversation,_ ] = await Promise.all([
    Conversation.findByIdAndUpdate( 
      params.conversationId,
      { $push: { messages: newMessage._id } ,
        $set: { lastMessageAt: new Date(), lastMessage: body || "图片" } 
      },
      { new: true }
    ),
    // User.findOne({ _id: receiverId ,conversationIds: { $in: params.conversationId } }),
    newMessage.save(),
  ])

    const MessageRes = await Message.findById(newMessage._id).populate([
      { path: "senderId" },
      { path: "receiverId" }
    ]);

  // if(!receiver){
  //   User.findOneAndUpdate(
  //     { _id: receiverId },
  //     { $push: { conversationIds: params.conversationId } }
  //   );
  // }

  if(MessageRes){
    return NextResponse.json({code:200,data:MessageRes,msg:"操作成功"})
  }else{
    return NextResponse.json({code:500,msg:"操作失败"})
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: IParams }
) {
  const session = await getSession();

  const currentUser = User.findOneAndUpdate(
    {
      _id: session?.user?.userId,
      conversationIds: { $in: params.conversationId }
    },
    {
      $pull: { conversationIds: params.conversationId }
    },
    { new: true ,runValidators: true}
    );

  return NextResponse.json({code:200,data:currentUser,msg:"操作成功"})
}