import dbConnect from "@/app/db/dbConnect";
import Posts from "@/app/db/models/post";
import Comment from "@/app/db/models/comment";
import getSession from '@/app/action/getSession';
import { NextRequest,NextResponse } from "next/server";
dbConnect();


interface IParams {
  postId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
){

  const post = await Posts
  .findById(params.postId)
  .populate([
    {
      path:'userId'
    },
    {
      path:'comment',
      model:Comment,
      populate:[
        {
          path:'userId'
        },
        {
          path:'postId'
        }
      ]
    }
  ]);

  return NextResponse.json(
    {
      data:post,
      code:200,
      msg:"操作成功"
    }
  );
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: IParams }
){
  Promise.all([
    await Posts.deleteOne({_id:params.postId}),
    await Comment.deleteMany({postId:{$in:params.postId}})
  ])
  return NextResponse.json(
    {
      data:null,
      code:200,
      msg:"操作成功"
    }
  );

}