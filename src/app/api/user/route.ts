import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
import { NextRequest,NextResponse } from "next/server";
import getSession from '@/app/action/getSession';

dbConnect();
export async function GET(
  request: NextRequest,
) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || null;

  const session = await getSession();
  const users = await User.findOne({_id: userId || session?.user?.userId}).populate({
    path:"followingIds",
    select:"-password",
  })

  return NextResponse.json({data:users,code:200,msg:"操作成功"})
}

export async function POST(
  request: NextRequest,
) {
  const data = await request.json();
  const { userId } = data;
  const users = await User.findOne({_id:userId})
  return NextResponse.json({data:users,code:200,msg:"操作成功"})
}