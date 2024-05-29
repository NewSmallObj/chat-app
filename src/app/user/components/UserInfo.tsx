"use client";
import { URL } from "@/app/action/stants";
import { useCurrentUser } from '@/app/action/useCurrentUser';
import { useUserInfo } from '@/app/action/useUserInfo';
import type { ConversationType } from "@/app/db/models/conversation";
import { UserType } from '@/app/db/models/user';
import serviceRequest from '@/libs/serviceRequest';
import { Button, message } from "antd";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";

interface InfoProps {
  children: React.ReactNode;
}

const Info = ({children}:InfoProps) => {

  const searchParams = useSearchParams();
  const { currentUser,refresh } = useCurrentUser();
  const [ userInfo,setUserInfo ] = useState<UserType>();
  const { runAsync } = useUserInfo();
  const router = useRouter();
  
  const userId = useMemo(() => {
    return searchParams.get('userId') || ''
  }, [searchParams]);

  useEffect(()=>{
    getUserInfo()
  },[userId,searchParams.get('userId')])

  const getUserInfo = ()=>{
    runAsync(userId).then((res)=>{
      setUserInfo(res)
    })
  }

  const currentUserId = useMemo(()=>{
    return currentUser?._id
  },[currentUser])

  const isFollow = useMemo(()=>{
    if(!currentUser?.followingIds) return false;
    return currentUser?.followingIds.some((v)=>v._id === userId);
  },[currentUser?.followingIds,currentUser?.followingIds.length])

  const fetchFollow = async (userId:string,follow:boolean)=>{
    return await serviceRequest.post<{code:number,msg:string}>(URL.USER.Follow
      ,{params:{userId,follow},cacheTime:10})
  }

  const toggleFollow = useCallback( async ()=>{
    // TODO: 切换关注与非关注状态
    if(isFollow){
      // 取消关注
      await fetchFollow(userId,false)
      message.success('已取消关注')
    }else{
      // 关注
      await fetchFollow(userId,true)
      message.success('关注成功')
    }
    refresh()
  },[isFollow,userId])

  // 打开消息页
  const startActivity = async (id:string)=>{
    const res = await serviceRequest.post<{code:number,data:ConversationType}>(
      URL.CONVERSATION.CREATE_CONVERSATION,
      {params:{receiverId:id},cacheTime:1000}
      )
    if(res.code === 200){
      router.push(`/user/conversations/${res.data._id}/${id}`)
    }
  }

  return (
    <div className="border-b-[1px] border-neutral-200 pb-4 px-4 -translate-y-4 lg:flex lg:gap-5">
      <div className="w-full max-h-[350px] p-2 pb-6 bg-white rounded-md shadow-lg shadow-neutral-500/10 lg:w-1/3">
        <div className='flex justify-end pb-4 md:pb-6'>
        
          {userInfo?._id === currentUserId ? (
            <Button onClick={()=>{
              router.push("/user/edit");
            }}>编辑</Button>
          ) : (
            isFollow ? 
            <div className="flex gap-2">
              <Button
                onClick={toggleFollow} //toggleFollow 切换关注与非关注状态
                icon={<SlUserFollowing className="h-4 w-4" />}
              >
              </Button>
                <Button
                onClick={()=>{startActivity(userId)}} // 发送消息
                icon={<IoIosSend className="h-4 w-4 animate-pulse" />}
              >
              </Button>
            </div>
            :
            <Button
              onClick={toggleFollow} //toggleFollow 切换关注与非关注状态
              icon={<SlUserFollow className="h-4 w-4 animate-pulse" />}
            >
            </Button>
          )}
        </div>
        <div className="flex flex-col px-4">
          <p className="text-2xl font-semibold">
            { userInfo?.name || '暂无昵称'}
          </p>
          <p className="text-md text-neutral-500">
            { userInfo?.username }
          </p>
          <p className="text-sm text-neutral-500 mt-2 h-[120px]">
            { userInfo?.remark }
          </p>
        </div>
        {/* <div className="flex px-4 py-0 justify-start mt-4 divide-x divide-inherit">
          <div className="p-4 py-2 flex flex-col gap-2 items-center text-sm  text-neutral-600">
            <CiHeart />
            <span>我关注的</span>
          </div>

          <div className="p-4 py-2 flex flex-col gap-2 items-center text-sm text-neutral-600">
            <BiCommentDetail />
            <Badge count={0} offset={[10,0]}>
              <span>评论我的</span>
            </Badge>
          </div>
        </div> */}
      </div>
      <div className="px-4 bg-white rounded-md shadow-lg shadow-neutral-500/10 lg:w-2/3">
          {children}
      </div>
    </div>
  );
};

export default Info;