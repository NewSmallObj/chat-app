'use client';
import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import { useComment } from '@/app/action/useComment';
import { clsx } from "clsx";
import useSegmented from "@/app/store/useSegmented";
import { PUBSUBCOMMENTUNREADKEY } from "@/app/action/stants"
import PubSub from 'pubsub-js';

export default function PostComment() {

  const { run,refresh,data } = useComment();
  const { segmentedValue } = useSegmented();

  useEffect(()=>{
    if(segmentedValue === "3") run()
  },[segmentedValue])

  useEffect(() => {
    const subscription = PubSub.subscribe(PUBSUBCOMMENTUNREADKEY, (message,data) => {
      refresh()
    });
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);

  return (
    <div className={
      clsx(`w-full`,{ 'hidden': segmentedValue !== '3'})
    }>
      <CommentList comments={data || []} />
    </div>
  )
}