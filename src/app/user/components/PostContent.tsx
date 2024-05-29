import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import type { PostType } from '@/app/db/models/post';
import dayjs from 'dayjs';
import PostConentComment from "./PostConentComment";
import PostConentLike from "./PostConentLike";
import PostContentImage from "./PostContentImage";
import { AVATARBASEURL } from "@/app/action/stants"
import { get } from 'lodash';

interface PostItemProps
{
  data: PostType;
}

export default function ({data:post}:PostItemProps){
  return (
    <>
    <div 
      className="
        border-b-[1px] 
        border-neutral-200 
        p-5 
        cursor-pointer 
        hover:bg-neutral-100 
        transition
        flex
        flex-col
        items-start
        justify-between
      ">
      <div className="flex-1 flex flex-row items-start gap-3">
        <Avatar className='w-16 h-16 md:h-14 md:w-14 rounded-md'>
          <AvatarImage className='w-16 h-16 md:h-14 md:w-14 rounded-md' 
          src={ AVATARBASEURL + post?.userId[0]?.avatar || ''} 
          alt="@shadcn" />
          <AvatarFallback>{post?.userId[0]?.username?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-row items-center gap-2">
            <p 
              className="
                text-block 
                font-semibold 
                cursor-pointer 
                hover:underline
            ">
              {get(post, 'userId[0].name', get(post, 'userId[0].username', ''))} 
            </p>
            <span className="text-neutral-500 text-sm">
              { post?.createdAt ? dayjs(post?.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
            </span>
          </div>
          <div className="text-block mt-1">
            { post?.body || '' }
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <PostContentImage />
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <PostConentLike />
          </div>
        </div>
      </div>
    </div>
      {/* 评论内容 */}
      <PostConentComment />
    </>
  );
}