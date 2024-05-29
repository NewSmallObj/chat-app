"use client";
import serviceRequest from "@/libs/serviceRequest";
import useConversation from '@/app/action/useConversation';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import ConversationListItem from './ConversationListItem';
import useUserConversation from "@/app/store/useConversation"
import type { MessageType } from "@/app/db/models/message"
import { useSession } from 'next-auth/react';
import type { ConversationType } from "@/app/db/models/conversation"
import { URL } from "@/app/action/stants";

const ConversationList =  () => {
 const { isOpen } = useConversation();
 const { conversationList,setConversationList } = useUserConversation();
 const session = useSession();

 
 useEffect(()=>{
  getConversationList()
 },[])

 const getConversationList = async ()=> {
  const res = await serviceRequest.get<{code:number,data:ConversationType[]}>(
    URL.USER.CONVERSATION,{cacheTime:1000})
    if(res.code === 200){
      setConversationList(res.data)
    }
 }

 const getMessageUnreadCount = (messages:MessageType[])=> {
  if(session.data?.user?.userId){
    const res = messages.filter((item)=> item.unReads.includes(session.data?.user?.userId!))
    return res.length
  }
  return 0
 }

  return (
    <div className={
      clsx(`
        fixed
        inset-y-0
        w-full
        overflow-y-auto
        border-r
        border-gray-200
        block
        left-0
        lg:w-80
        lg:pl-20
        lg:block
      `,{
        'hidden': isOpen
      })
    }>{
        conversationList.map((v)=><ConversationListItem 
          key={v._id} 
          participants={v.participants} 
          lastMessageAt={v.lastMessageAt}
          lastMessage={v.lastMessage}
          conversationId={v._id}
          messageCount={getMessageUnreadCount(v.messages)}
          getConversationList={getConversationList}
          />)
      }
    </div>
  );
};

export default ConversationList;