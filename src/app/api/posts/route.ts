import dbConnect from "@/app/db/dbConnect";
import Posts from "@/app/db/models/post";
import Comment from "@/app/db/models/comment";
import getSession from '@/app/action/getSession';
import { NextRequest,NextResponse } from "next/server";
dbConnect();

export async function GET(
  request: NextRequest,
){
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || null;
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const isLike = searchParams.get('isLike') || null;
  const offset = (Number(page) - 1) * Number(limit);
  const session = await getSession()
  
  const islikeParams = isLike ? {likedIds:{$in:[session?.user?.userId]}} : {};

  try{
    let posts;
    if(userId){
      posts = await Posts.find({userId})
      .sort({ createdAt: -1 })
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
      ])
      .skip(offset)
      .limit(Number(limit));
    }else{
      posts = await Posts.find({...islikeParams})
      .sort({ createdAt: -1 })
      .populate('userId')
      .skip(offset)
      .limit(Number(limit));
    }
    return NextResponse.json({code:200,data:posts,msg:'操作成功'})
  }catch(e){
    return NextResponse.json({code:500,data:null,msg:'操作失败'})
  }
}

export async function POST(
  request: NextRequest,
){
  const data = await request.json();
  const {images,body} = data;
  const session = await getSession();
  
  const post = await Posts.create({
    images,
    body,
    userId:session?.user?.userId
  })

  return NextResponse.json(
    {
      data:post,
      code:200,
      msg:"操作成功"
    }
  );
}