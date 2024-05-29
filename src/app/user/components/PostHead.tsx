"use client";
import { usePost } from '@/app/action/usePost';
import Link from 'next/link';
import React,{useEffect} from 'react';
import { MdOutlineChevronLeft } from "react-icons/md";
import { useParams, useRouter } from 'next/navigation';

const PostHead = () => {
  const params = useParams();
  const { post,updatePost,run } = usePost();
  const router = useRouter()

  useEffect(()=>{
    run(params.postId as string)
  },[params.postId])

  return (
    <div className="
      bg-white 
      w-full 
      flex 
      border-b-[1px] 
      sm:px-4 
      py-3 
      px-4 
      lg:px-6 
      justify-between 
      items-center 
      shadow-sm
      ">
        <div className="flex gap-3 items-center">
          {/* lg:hidden */}
          <div 
            onClick={()=> router.back()}
            className="
              block
              text-sky-500
              hover:text-sky-600
              transition
              cursor-pointer
            ">
              <MdOutlineChevronLeft size={32} />
          </div>
          <div className="flex-1 truncate">
              详情 
          </div>
        </div>
    </div>
  );
};

export default PostHead;