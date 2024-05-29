import getPost from "@/app/action/getPost";
import PostContent from "@/app/user/components/PostContent";
import PostHead from "@/app/user/components/PostHead";
import PostContentInput from "../../components/PostContentInput";

interface IParams {
  postId: string;
}


const PostView = async({ params }: { params: IParams }) => {

  const post = await getPost(params.postId);

  return (
    <div className="flex flex-col gap-4 justify-between items-start h-full">
      <div className="flex-1 w-full">
        <PostHead />
        <PostContent data={post} />
        {/* <CommentList comments={post?.comment || []} /> */}
      </div>
      <PostContentInput />
    </div>
  )
}

export default PostView;