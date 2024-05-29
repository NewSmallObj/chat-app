'use client';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { useCallback, useMemo,useEffect } from "react";
import { useCurrentUser } from '@/app/action/useCurrentUser';
import { useLike } from '@/app/action/useLike';
import type { PostType } from '@/app/db/models/post';
import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/app/action/usePost';
import useComment from '@/app/store/useComment';
import PubSub from 'pubsub-js';
import { MdDeleteOutline  } from "react-icons/md";
import { URL,PUBSUBPOSTKEY,PUBSUBCOMMENTKEY } from "@/app/action/stants";
import {message} from "antd"
import clsx from "clsx";
import serviceRequest from "@/libs/serviceRequest";

export default function PostConentLike() {

  const params = useParams();

  const { currentUser } = useCurrentUser();
  const { toggleLike } = useLike({ postId: params.postId as string});
  const { post,updatePost,run,refresh } = usePost()
  const { visible,open,close,setCurrentPost } = useComment();
  const router = useRouter()

  useEffect(()=>{
    run(params.postId as string)
  },[params.postId])


  useEffect(() => {
    const subscription = PubSub.subscribe(PUBSUBCOMMENTKEY, (message,data) => {
      refresh()
    });
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);



  const toogleVisible = (post: PostType)=>{
    if(visible){
      close()
    }else{
      setCurrentPost(post)
      open()
    }
  }

  
  const hasLiked = useMemo(()=>{
    if(!currentUser) return false;
    return (post?.likedIds as string[]).includes(currentUser?._id!);
  },[currentUser,post,post?.likedIds.length]);

  const LikeIcon = useMemo(()=>{
    return hasLiked ? AiFillHeart : AiOutlineHeart;
  },[hasLiked])

  
  const handlerLikeClick = useCallback((ev: any) => {
    ev.stopPropagation();
    toggleLike(hasLiked).then((currentPost)=>{
      if(currentPost && post){
        refresh()
      }
    });
  },[toggleLike,hasLiked])

  const handlerDeleteClick = useCallback(async (ev: any) => {
    ev.stopPropagation();
    let {code,data} = await serviceRequest.delete<{code:number,data:any}>(`${URL.POST.CREATE_POST}/${post._id}`,
      {cacheTime:10});
    if(code === 200){
      message.success("操作成功");
      PubSub.publish(PUBSUBPOSTKEY, {
        postId:post._id
      });
      router.back()
    }else{
      message.error("操作成功");
    }
  },[post])

  return (
    <>
    <div 
        className="
          flex 
          flex-row 
          items-center 
          text-neutral-500 
          gap-2 
          cursor-pointer 
          transition 
          hover:text-sky-500
        "
        onClick={()=>toogleVisible(post)}
      >
        <AiOutlineMessage size={20} />
        <p>
          {post?.comment?.length || 0 }
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
        {post?.likedIds?.length || 0}
      </p>
    </div> 
    <div 
      onClick={handlerDeleteClick}
      className={
        clsx(`text-neutral-500`)
      }>
      <MdDeleteOutline color="rgb(239 68 68)" />
    </div>
    </>
  );
}