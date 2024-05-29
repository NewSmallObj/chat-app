"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import React from 'react';
import { UserType } from '@/app/db/models/user';
import serviceRequest from '@/libs/serviceRequest';
import { useRouter } from "next/navigation";
import { URL } from '@/app/action/stants';
import type { ConversationType } from "@/app/db/models/conversation"
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"
import { Dropdown,message } from 'antd';
import type { MenuProps } from 'antd';
import { useSession } from 'next-auth/react';
import { get } from 'lodash';
interface UserListProps {
  user:UserType
  getUserList:Function
}
const UserItem = ({user,getUserList}:UserListProps) => {

  const router = useRouter();
  const startActivity = async ()=>{
    const res = await serviceRequest.post<{code:number,data:ConversationType}>(
      URL.CONVERSATION.CREATE_CONVERSATION,
      {params:{receiverId:user._id},cacheTime:1000}
      )
    if(res.code === 200){
      router.push(`/user/conversations/${res.data._id}/${user._id}`)
    }
  }

  const delUser = async ()=>{
    const { code } = await serviceRequest.post<{code:number,msg:string}>(URL.USER.Follow,
      {params:{userId:user._id,follow:false},cacheTime:10})
    if(code === 200){
      message.success("操作成功")
      getUserList()
    }
  }

  const items: MenuProps['items'] = [
    {
      label: '删除',
      key: '1',
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    delUser()
  };
  
  return (
  <Dropdown menu={{ items,onClick }} trigger={['contextMenu']}>
    <div className='
      w-full 
      h-[60px] 
      overflow-hidden
      border-b
      border-inherit
      border-solid
      '>
      <div 
        className='
          w-full 
          snap-mandatory 
          snap-x 
          flex 
          justify-start 
          items-center 
          overflow-x-scroll
          scroll-smooth
        '
        >
        <div 
          onClick={startActivity}
          className="
            snap-start
            w-full
            relative
            flex
            items-center
            space-x-3
            p-3
            hover:bg-neutral-100
            rounded-lg
            transition
            cursor-pointer
            ease-in-out
            duration-200
            shrink-0
          ">
            <Avatar className='w-8 h-8 md:h-9 md:w-9 rounded-sm'>
              <AvatarImage className='w-8 h-8 md:h-9 md:w-9 rounded-sm' 
              src={
                user.avatar ? AVATARBASEURL + user.avatar : 
                "https://q2.itc.cn/q_70/images03/20240401/f74179c3516c4f0685dd5c817898520b.jpeg"
              } 
              alt="@shadcn" />
              <AvatarFallback>{user.username.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">
                    {get(user, 'name', get(user, 'username', ''))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        <div 
        onClick={delUser}
        className='
          snap-start 
          bg-red-500 
          w-16 
          h-[60px] 
          text-xs 
          text-white 
          text-center 
          shrink-0' 
          style={{lineHeight:'60px'}}>
          删除
        </div>
      </div>
    </div>
  </Dropdown>
  );
};

export default UserItem;