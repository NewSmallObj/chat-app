import dbConnect from "@/app/db/dbConnect";
import Posts from "@/app/db/models/post";
import getSession from '@/app/action/getSession';
import { NextRequest,NextResponse } from "next/server";
dbConnect();
export async function POST(
  request: NextRequest,
){
  const data = await request.json();
  const {postId,hasLiked} = data;
  const session = await getSession();
  const aa = await Posts.findById(postId)

  let post;
  if(hasLiked){
    post = await Posts.findByIdAndUpdate(postId,
      {
        $pull:{
          likedIds:session?.user?.userId
        }
      },
      { new: true}
    )
  }else{
    post = await Posts.findByIdAndUpdate(postId,
      {
        $push:{
          likedIds:session?.user?.userId
        }
      },
      { new: true}
    )
  }

  return NextResponse.json(
    {
      data:post,
      code:200,
      msg:"操作成功"
    }
  );
}