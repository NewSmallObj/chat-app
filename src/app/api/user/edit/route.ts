import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
import { NextRequest,NextResponse } from "next/server";

dbConnect();
export async function POST(
  request: NextRequest,
) {
  const data = await request.json();
  const { userId,name,image,avatar,remark } = data;
  const users = await User.findByIdAndUpdate(userId,{name,image,avatar,remark});
  return NextResponse.json({data:users,code:200,msg:"操作成功"})
}