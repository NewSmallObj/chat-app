'use client';
import { useUserInfo } from '@/app/action/useUserInfo';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import type { UserType } from '@/app/db/models/user';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"

const Usercover = () => {

  const searchParams = useSearchParams();
  const [ userInfo,setUserInfo ] = useState<UserType>();
  const { runAsync } = useUserInfo();

  const userId = useMemo(() => {
    return searchParams.get('userId') || ''
  }, [searchParams]);

  useEffect(()=>{
    getUserInfo()
  },[userId])

  const getUserInfo = ()=>{
    runAsync(userId).then((res)=>{
      setUserInfo(res)
    })
  }

  return (
    <div>
      <div className="bg-neutral-700 h-44 relative">
        {userInfo?.image && (
          <Image 
          priority={true}
          loader={({ src, width, quality })=>`${src}?w=${width}&q=${quality || 75}`}
          src={ POSTBASEURL + userInfo.image} 
          fill 
          alt="Cover Image" 
          style={{ objectFit: 'cover' }}/>
        )}
        <div className="absolute -bottom-6 md:-bottom-8 z-10 left-8">
          <Avatar className='w-16 h-16 md:h-20 md:w-20 rounded-md'>
            <AvatarImage className='w-16 h-16 md:h-20 md:w-20 rounded-md' 
            src={ AVATARBASEURL + userInfo?.avatar || ""} 
            alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Usercover;