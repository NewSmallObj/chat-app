"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import type {UserType} from "@/app/db/models/user";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import clsx from 'clsx';
import useConversation from '@/app/action/useConversation';
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"
import { Dropdown,message } from 'antd';
import type { MenuProps } from 'antd';
import serviceRequest from "@/libs/serviceRequest";
import { URL } from "@/app/action/stants";
import { useRouter } from 'next/navigation';
import { get } from 'lodash';

interface ConversationListItemProps {
  participants: UserType[]
  lastMessageAt:string
  lastMessage:string
  conversationId:string
  messageCount:number
  getConversationList:Function
}

const ConversationListItem = (
  {
    participants,
    lastMessageAt,
    conversationId,
    lastMessage,
    messageCount,
    getConversationList
  }:ConversationListItemProps,
) => {
  const {data} = useSession();
  const { conversationId:pathConversationId } = useConversation();
  const router = useRouter()

  const user = useMemo(()=>{
    if(participants){
      return participants.find(v=>v._id !== data?.user?.userId);
    }
    return null
  },[participants])

  const delUser = async ()=>{
    const res = await serviceRequest.delete<{code:number,data:any}>(
      URL.USER.CONVERSATION,{
        params:{
          id:conversationId
        },
        cacheTime:1000
      })
      if(res.code === 200){
        getConversationList()
        message.success("操作成功");
        if(pathConversationId[0]){
          router.back();
        }
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
    <Link
    href={`/user/conversations/${conversationId}/${user?._id}`} 
    className={
      clsx(`
        snap-start
        shrink-0
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
        `,{
          'bg-neutral-100': conversationId === pathConversationId[0]
        }
      )
    }>
      <Avatar className='w-8 h-8 md:h-9 md:w-9 rounded-sm relative overflow-visible'>
        <div className={
          clsx(`
            rounded-full 
            z-10 
            translate-x-1/2 
            -translate-y-1/2 
            bg-red-600 
            text-xs 
            w-5
            h-5
            text-center 
            leading-5
            text-white 
            absolute 
            right-0 
            top-0
          `,{'hidden': !messageCount})}>
          { messageCount > 99 ? '99+' : messageCount }
        </div>
        <AvatarImage className='w-8 h-8 md:h-9 md:w-9 rounded-sm' 
        src={ AVATARBASEURL + user?.avatar}
        alt="@shadcn" />
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900 flex-1">
              <div className='w-full truncate'>
                {get(user, 'name', get(user, 'username', ''))}
              </div>
              <div className="ml-1 text-xs text-gray-400 w-full truncate">{lastMessage}</div>
            </div>
            <p className="text-xs text-gray-500">
              {dayjs(lastMessageAt).format('YYYY-MM-DD HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </Link>
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

export default ConversationListItem;