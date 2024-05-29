
import NextAuth,{AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
import { NextResponse } from "next/server";

dbConnect();

export const authOptions:AuthOptions = {
  pages: {
    signIn: `/`,
  },
	providers:[
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        
        if (!credentials?.username || !credentials?.password) {
          throw new NextResponse('用户不存在',{ status: 401 });
        }
        const user = await User.findOne({username:credentials.username}).select('+password');
        if(!user){
          throw new NextResponse('用户不存在',{ status: 401 });
        }
        const isPasswordMatched =  user.comparePassword(credentials.password);
        if (!isPasswordMatched) {
          throw new NextResponse('用户名或密码错误',{ status: 401 });
        }
        return user;
      }
    })
  ],
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt",maxAge: 60 * 60 * 24 * 7 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks:{
    jwt:async({token,user})=>{
      if(user){
        token.userId = user?._id
        token.avatar = user?.avatar
      }
      return token
    },
    session:async({session,token})=>{
      if (token && session.user) {
        session.user.userId = token.userId
        session.user.avatar = token.avatar
      }
      if (session.user && !token) {
        session.user.userId = null
        session.user.avatar = null
      }
      return session
    }
  }
}


const handler = NextAuth(authOptions);

export {handler as GET,handler as POST}