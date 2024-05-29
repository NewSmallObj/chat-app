import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
import Conversation from "@/app/db/models/conversation";
import Message from "@/app/db/models/message";
import { NextRequest,NextResponse } from "next/server";
import getSession from '@/app/action/getSession';

dbConnect();
export async function GET(
  request: NextRequest,
) {
  const session = await getSession();
  const users = await User.findOne({_id:session?.user?.userId})
    .populate({
      path:'conversationIds',model:Conversation,
      populate:[
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
      ]
    });

  return NextResponse.json({code:200,data:users.conversationIds,msg:"操作成功"})
}


export async function DELETE(
  request: NextRequest,
) {
  const session = await getSession();
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') || null;
  const users = await User.findByIdAndUpdate(session?.user?.userId,{
    $pull: {
      conversationIds: id
    }
  })
  return NextResponse.json({code:200,data:users.conversationIds,msg:"操作成功"})
}