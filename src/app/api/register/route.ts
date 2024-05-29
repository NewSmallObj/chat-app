import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user";
import { random } from "lodash"

dbConnect();

export async function POST(
  request: Request,
) {
  const body = await request.json();
  const {username,password,confirmPassword} = body;
  // const user = await User.findOne({username}).select('+password')

  if(password !== confirmPassword){
    return new NextResponse('两次密码不一致', { status: 401 });
  }

  let user = await User.findOne({username})
  if (user) {
      return new NextResponse('此用户已存在', { status: 401 });
  }



  user = await User.create({
    username,
    password,
    avatar: `avatar0${random(0,6)}`
  })

  return NextResponse.json(
    {
      data:user,
      code:200,
      msg:"操作成功"
    }
  );
}
