'use client';
import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import { URL,PUBSUBCOMMENTKEY } from "@/app/action/stants";
import { usePost } from '@/app/action/usePost';
import { useParams } from 'next/navigation';
// post详情页面评论区域

export default function PostConentComment() {

  const { run,refresh,post } = usePost();
  const params = useParams();

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

  return (
    <>
      <CommentList comments={post?.comment || []} />
    </>
  )
}