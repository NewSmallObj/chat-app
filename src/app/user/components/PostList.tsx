"use client";
import { PUBSUBPOSTKEY } from "@/app/action/stants";
import { usePosts } from "@/app/action/usePosts";
import useSegmented from "@/app/store/useSegmented";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import PubSub from 'pubsub-js';
import { Fragment, useEffect, useMemo } from 'react';
import PostItem from './PostItem';

const PostList = () => {

  const {posts,run,deletPost} = usePosts();
  const session = useSession();
  const searchParams = useSearchParams();
  const { segmentedValue } = useSegmented();
  
  const userId = useMemo(()=>{
    return searchParams.get('userId') //|| session.data?.user?.userId
  },[searchParams])

  useEffect(() => {
    const subscription = PubSub.subscribe(PUBSUBPOSTKEY, (message,data) => {
      if(typeof data === 'object'){
        deletPost(data.postId)
      }else{
        run(Number(data),10,userId!)
      }
    });
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);

  useEffect(()=>{
    if(segmentedValue === '1'){
      run(1,10,userId!);
    }
    if(segmentedValue === '4'){
      run(1,10,userId!,1);
    }
  },[userId,segmentedValue])

  return (
    <Fragment>
      <div className={
        clsx(`w-full`,{ 'hidden': !['1','2','4'].includes(segmentedValue)})
      }>
        {posts.map((post) => (
          <PostItem key={post._id} data={post} />
        ))}
      </div>
    </Fragment>
  );
};

export default PostList;