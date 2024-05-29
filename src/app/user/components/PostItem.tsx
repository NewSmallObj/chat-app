import { useCurrentUser } from "@/app/action/useCurrentUser";
import { useLike } from "@/app/action/useLike";
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import type { PostType } from '@/app/db/models/post';
import { Image as AntImage } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"
import { get } from "lodash";

interface PostItemProps
{
  data: PostType;
}

const PostItem = (
  {
    data,
  }: PostItemProps
) => {

  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { toggleLike } = useLike({ postId: data._id});
  const [post,setPost] = useState<PostType>(data);
  const [isOpen,setIsOpen] = useState(false);


  const hasLiked = useMemo(()=>{
    if(!currentUser) return false;
    return post.likedIds.includes(currentUser?._id!);
  },[currentUser,post,post.likedIds]);

  const LikeIcon = useMemo(()=>{
    return hasLiked ? AiFillHeart : AiOutlineHeart;
  },[hasLiked])


  const handlerPostClick = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/user/posts/${post._id}`)
  },[])

  const handlerPreview = (ev:any)=>{
    ev.stopPropagation();
    setIsOpen(true)
  }

  const handlerUserClick = useCallback((ev: any) => {
    router.push('/user?userId='+ post.userId[0]._id)
    ev.stopPropagation();
  },[])

  const handlerLikeClick = useCallback((ev: any) => {
    ev.stopPropagation();
    toggleLike(hasLiked).then((currentPost)=>{
      if(currentPost){
        const {likedIds} = currentPost as PostType;
        setPost({...post,likedIds});
      }
    });
  },[toggleLike,hasLiked])
  
  

  return (
    <div 
      className="
        border-b-[1px] 
        border-neutral-200 
        p-5 
        cursor-pointer 
        hover:bg-neutral-100 
        transition
      ">
      <div className="flex flex-row items-start gap-3">
        <Avatar className='w-16 h-16 md:h-14 md:w-14 rounded-md'>
          <AvatarImage className='w-16 h-16 md:h-14 md:w-14 rounded-md' 
          src={ AVATARBASEURL + post?.userId[0]?.avatar || ''} 
          alt="@shadcn" />
          <AvatarFallback>{post?.userId[0]?.username?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-row items-center gap-2">
            <p 
              onClick={handlerUserClick} 
              className="
                text-block 
                font-semibold 
                cursor-pointer 
                hover:underline
            ">
              {get(post, 'userId[0].name', get(post, 'userId[0].username', ''))}
            </p>
            <span className="text-neutral-500 text-sm">
              { dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </div>
          <div className="text-block mt-1" onClick={handlerPostClick}>
            { post.body }
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            {
              post.images?.map((image,index)=>(
                <div key={index}>
                <AntImage 
                  className='hidden'
                  preview={{
                    visible:isOpen,
                    src: POSTBASEURL + image,
                    onVisibleChange: (value) => {
                      setIsOpen(value);
                    },
                  }}
                  />
                <Image className="
                  object-cover
                  cursor-pointer
                  hover:scale-105 
                  transition 
                  translate
                  w-24 
                  h-24 
                  md:w-28 
                  md:h-28
                " 
                  alt='Image'
                  width={20} 
                  height={20}
                  priority={true}
                  loader={({ src, width, quality })=>`${src}?w=${width}&q=${quality || 75}`}
                  onClick={handlerPreview}
                  src={ POSTBASEURL + image}
                  />
                </div>
              ))
            }
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div 
              onClick={handlerPostClick}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-sky-500
            ">
              <AiOutlineMessage size={20} />
              <p>
                {post.comment.length}
              </p>
            </div>
            <div
              onClick={handlerLikeClick}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            ">
              <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
              <p>
                {post.likedIds.length}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;