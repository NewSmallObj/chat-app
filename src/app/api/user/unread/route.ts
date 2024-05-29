import dbConnect from "@/app/db/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import Comment from "@/app/db/models/comment"
import Message from "@/app/db/models/message"
import Conversation from "@/app/db/models/conversation"
import getSession from '@/app/action/getSession';
dbConnect();

// 查询当前用户未读的评论信息
export async function GET(
  request: NextRequest,
){
  const session = await getSession();
  const comment = await Comment.find({ isRead: false}) //{postId:{ $size : { $gt: 0 }}}
                        .populate([
                          {
                            path:'postId',
                            match:{
                              userId:{$in:session?.user?.userId},
                            }
                          },
                          {
                            path:'userId',
                          }
                        ])
  return NextResponse.json({data:comment.filter((v)=>v.postId.length),code:200,msg:"操作成功"})
}


// 根据评论id或帖子id 帖子只有当前用户可以设置已读 将评论设为已读 
export async function PUT(
  request: NextRequest,
) {
  const data = await request.json();
  const { commentIds , postId } = data;

  let comment;
  if(postId){
    comment = await Comment.find({ postId }).updateMany({
      $set: {
        isRead: true,
      },
    });
  }else{
    comment = await Comment.find({ _id: { $in: commentIds } }).updateMany({
      $set: {
        isRead: true,
      },
    });
  }

  

  return NextResponse.json({data:comment,code:200,msg:"操作成功"})
}