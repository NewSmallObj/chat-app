import getSession from "@/app/action/getSession";
import dbConnect from "@/app/db/dbConnect";
import Message from "@/app/db/models/message";
import { NextRequest,NextResponse } from "next/server";

dbConnect();

interface IParams {
  conversationId?: string;
}


// 分页获取会话下的消息内容 每页100条
export async function GET(
  request: NextRequest,
  { params }: { params: IParams }
) {
  const searchParams = request.nextUrl.searchParams
  const offset = searchParams.get('offset') || 0;
  const limit = 100

  let { conversationId } = params;
  if(!conversationId){
    return NextResponse.json({
      msg: "参数错误",
      code:400,
    })
  }
  
  const res = await Message.find(
    { conversationId:conversationId!.split(',')[0] })
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(limit)
    .populate([
      {
        path: 'senderId'
      },
      {
        path: 'receiverId'
      }
    ])

  return NextResponse.json({
    msg: "获取成功",
    code:200,
    data:res.sort((a,b)=>{
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  })

}



// 将未读消息设置为已读 (将某会话下的Message中unReads数组移除当前的用户id)
export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
){
  const { conversationId } = params;
  const session = await getSession();
  const { messageId } = await request.json();

  if(session?.user?.userId){
    if(!messageId){
      await Message.updateMany(
        { conversationId, unReads: {$in:session?.user?.userId}},
        { $pull: { unReads: session?.user.userId } }
      )
    }else{
      await Message.updateOne(
        { _id: messageId },
        { $pull: { unReads: session?.user.userId } }
      )
    }
    return NextResponse.json({
      msg: "已读成功",
      code:200,
      data:null
    })
  }
  return NextResponse.json({
    msg: "未登录",
    code:401,
    data:null
  })
}