'use client';
import { usePost } from '@/app/action/usePost';
import { Image as AntImage } from 'antd';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function PostConentLike() {

  const params = useParams();
  
  const { post,updatePost,run } = usePost()
  const [isOpen,setIsOpen] = useState(false);

  useEffect(()=>{
    run(params.postId as string)
  },[params.postId])

  return (
      <>
        {
          post?.images?.map((image,index)=>(
            <div key={index} onClick={(ev:any)=>ev.stopPropagation()}>
            <AntImage 
              className='hidden'
              preview={{
                visible:isOpen,
                src: image,
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
              onClick={()=>setIsOpen(true)} // 
              src={image}
              />
            </div>
          ))
        } 
      </>
  );
}