import dbConnect from "@/app/db/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import User from "@/app/db/models/user"
import Message from "@/app/db/models/message"
import Conversation from "@/app/db/models/conversation"
import getSession from '@/app/action/getSession';
dbConnect();

// 此方法查询所有的会话列表 暂时无用
export async function GET(
  request: NextRequest,
){

  const session = await getSession();
  const res = await User.findOne({ _id: session?.user?.userId})
                        .populate('conversationIds')
  if(!res) return new NextResponse('error',{status:500})
  return NextResponse.json({data:res.conversationIds,code:200,msg:"操作成功"})
}

export async function POST(
  request: NextRequest,
){
  try{
    const data = await request.json()
    const session = await getSession();
    const senderId = session?.user?.userId;
    const { receiverId } = data;

    // 根据当前的发送者id及接收者id查询会话信息 会话不存在则创建会话
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate([
        {
          path:'participants',
          select:'name avatar _id image username',
        },
        {
          path:'messages',
          model:Message,
          options:{sort:{createdAt:-1},limit:100},
          match:{unReads:{$in:session?.user?.userId}},  //关联查询当前用户的未读消息
          populate:[
            {
              path:'receiverId',
            },
            {
              path:'senderId',
            }
          ]
        }
      ]);
      
    if(!conversation){
      await Conversation.create({
        participants: [senderId, receiverId]
      })
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      }).populate([
          {
            path:'participants',
            select:'name avatar _id image username',
          },
          {
            path:'messages',
            model:Message,
            options:{sort:{createdAt:-1},limit:100},
            match:{unReads:{$in:session?.user?.userId}},  //关联查询当前用户的未读消息
            populate:[
              {
                path:'receiverId',
              },
              {
                path:'senderId',
              }
            ]
          }
        ]);

    }

    // 查询当前用户的会话列表是否存在该会话 没有则添加
    const userCoversations = await User.findOne({
      _id:senderId,
      conversationIds:{$in:conversation._id}
    })
    if(!userCoversations){
      await User.findByIdAndUpdate(senderId, { $push: { conversationIds: conversation._id } });
    }

    return NextResponse.json({data:conversation,code:200,msg:"操作成功"})
  }catch(error){
    console.log("发送消息出错",error);
  }
}
