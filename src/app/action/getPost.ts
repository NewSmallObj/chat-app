import getSession from "./getSession";
import dbConnect from "@/app/db/dbConnect";
import Post from "@/app/db/models/post"
dbConnect();

const getPost = async (postId?: string) => {
  try {
    let posts
    if(postId){
      posts = await Post.findById(postId).populate('userId');
    }else{
      posts = await Post.find().populate('userId');
    }

    if (!posts) {
      return null;
    }

    return posts;
  } catch (error: any) {
    return null;
  }
};

export default getPost;
