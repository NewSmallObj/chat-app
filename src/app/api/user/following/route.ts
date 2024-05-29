import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
import { NextRequest,NextResponse } from "next/server";
import getSession from '@/app/action/getSession';
dbConnect();
export async function POST(
  request: NextRequest,
) {
  const data = await request.json();
  const session = await getSession();
  const { userId,follow } = data;
  let users
  if(follow){
    users = await User.findByIdAndUpdate(session?.user?.userId,{
      $push:{
        followingIds:userId
      }
    },{new:true})
  }else{
    users = await User.findByIdAndUpdate(session?.user?.userId,{
      $pull:{
        followingIds:userId
      }
    },{new:true})
  }
  return NextResponse.json({data:users,code:200,msg:"操作成功"})
}