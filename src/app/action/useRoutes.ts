import React, { useMemo } from 'react';
import useConversation from './useConversation';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BsPersonLinesFill } from "react-icons/bs";
import useUserConversation from "@/app/store/useConversation"
import { MessageType } from '@/app/db/models/message';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdOutlineChromeReaderMode } from "react-icons/md";
import { RiUserHeartLine } from "react-icons/ri";
const useRoutes = () => {

  const { conversationId } = useConversation();
  const pathname = usePathname();
  const { data: session } = useSession();

  const { conversationList } = useUserConversation();

  const getMessageUnreadCount = (messages:MessageType[])=> {
    if(session?.user?.userId){
      const res = messages.filter((item)=> item.unReads.includes(session?.user?.userId!))
      return res.length
    }
    return 0
   }

   const count = useMemo(()=>{
    if(conversationList){
      return conversationList.map((item)=>getMessageUnreadCount(item.messages)).reduce((acc,cur)=>acc+cur,0)
    }
   },[conversationList])

  const routes = useMemo(() => [
    {
      label:'聊天',
      href: '/user/conversations',
      icon: HiChatBubbleLeftRight,
      active: pathname === '/user/conversations' || !!conversationId,
      count
    },
    {
      label:'关注',
      href: '/user/users',
      icon: RiUserHeartLine,
      active: pathname === '/user/users',
    },
    {
      label:'圈子',
      href: '/user/posts',
      icon: MdOutlineChromeReaderMode,
      active: pathname === '/user/posts',
    },
  ], [pathname,conversationId,count]);

  return routes
};

export default useRoutes;