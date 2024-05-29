
import dbConnect from "@/app/db/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import Commnet from "@/app/db/models/comment"
import Posts from "@/app/db/models/Post"
import getSession from "@/app/action/getSession";
dbConnect();

export async function GET(
  request: NextRequest,
){

}


export async function POST(
  request: NextRequest,
){
  try{
    const body = await request.json();
    const { content,postId,isRead } = body;
    const session = await getSession();
    const userId = session?.user?.userId;
  
    const comment = await Commnet.create({
      body:content,
      userId,
      postId,
      isRead
    })
  
    await Posts.findByIdAndUpdate(postId, {
      $push: {
        comment: comment._id
      }
    })
    
  return NextResponse.json({data:null,code:200,msg:"操作成功"})
  }catch(e){
    return NextResponse.json({data:null,code:500,msg:"操作失败"})
  }
}

export async function DELETE(
  request: NextRequest,
){
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id') || null;
    const postId = searchParams.get('postId') || null;
    if(!id) NextResponse.json({data:null,code:500,msg:"缺少id"})
    if(!postId) NextResponse.json({data:null,code:500,msg:"缺少postId"})

    Promise.all([
      await Commnet.deleteOne({_id:id}),
      await Posts.findByIdAndUpdate(postId, {
        $pull: {
          comment: id
        }
      })
    ])

    return NextResponse.json({data:null,code:200,msg:"操作成功"})
  } catch (error) {
    return NextResponse.json({data:null,code:500,msg:"操作失败"})
  }
}