"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import { MessageType } from "@/app/db/models/message"
import useGetMessages from '@/app/action/useGetMessages';
import { debounce } from "lodash";
import { useParams } from 'next/navigation';
import useConversation from '@/app/store/useConversation';
// import useListenMessages from '@/app/action/useListenMessages';
import {isArray,head,last} from "lodash";
import { useSession } from "next-auth/react";
import serviceRequest from '@/libs/serviceRequest';
import { URL } from "@/app/action/stants"
import { Spin } from 'antd';

const Body = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<any>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0); // 触顶
  const [scrollBottom, setScrollBottom] = useState(0); // 触底
  const scrollClientHeight = useRef(0) // 容器高度


  // useListenMessages()
  const params = useParams();
  const session = useSession()
  const {
    conversationList,
    selectedConversation, 
    setSelectedConversation,
    setConversationList,
  } = useConversation();
  const { messages,getMessages,loading } = useGetMessages();

  // 当前的会话ID
  const currentConversationId = useMemo(()=>{
    if(isArray(params.conversationId)) return head(params.conversationId)
    return null
  },[params.conversationId])


  useEffect(()=>{
    if(Array.isArray(params.conversationId)){
      setSelectedConversation((params.conversationId as any)[0])
    }
    return ()=>{
      setSelectedConversation(null)
    }
  },[params.conversationId])

  // 已选中的会话列表中的消息置为已读(未读消息id中移除自己的id)
  useEffect(()=>{
    if(conversationList.length){   
      setConversationList(conversationList.map(v=>{
        if(v._id === currentConversationId){
          v.messages.forEach((m)=>{
            const index = m.unReads.indexOf(session?.data?.user?.userId!)
            if(index !== -1){
              m.unReads.splice(index,1)
            }
          })
        }
        return v
      }))
      readMessage()
    }
  },[selectedConversation])

  // 已读消息
  const readMessage = async (messageId?:string)=>{
    if(!selectedConversation) return
    await serviceRequest.post<{code:number,msg:string}>(
      `${URL.CONVERSATION.CREATE_CONVERSATION}/${selectedConversation}/message`,
      {params:{messageId},cacheTime:0})
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(()=>{
    if(scrollBottom < 300) scrollToBottom()
    // if(messages.length <= 100 && scrollBottom < 300) scrollToBottom()
    setRead()
  },[messages])


  useEffect(()=>{
    if(scrollTop < 20 && !loading) loadingMore();
  },[scrollTop])


  // 聊天记录最后一条数据不是自己发送的则设置已读
  const setRead = ()=>{
    const lastMessage = last(messages)
    if(lastMessage && lastMessage.senderId[0]._id !== session?.data?.user?.userId!){
      readMessage(lastMessage._id)
    }
  }
  

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      setScrollTop(scrollTop);
      setScrollBottom(scrollHeight - (scrollTop + clientHeight));
    }
  };

  const debouncedScroll = useMemo(() => debounce(handleScroll, 100), []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current?.addEventListener('scroll', debouncedScroll);
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current?.removeEventListener('scroll', debouncedScroll);
      }
    };
  }, []);

  const isEmpty = useMemo(()=>{
    return messages?.length === 0; // 没有数据
  },[messages])


  // 加载更多后滚动条回滚
  const loadingMore = async () => {
    if(loading) return;
    scrollClientHeight.current = messageContainerRef.current?.clientHeight!
    const isLoadMore = await getMessages(messages.length);
    if(isLoadMore){
      const newHeight = scrollContainerRef.current?.scrollHeight;
      if(newHeight){
        const scrollDistance = newHeight - scrollClientHeight.current;
        scrollContainerRef.current.scrollTop = scrollDistance
      }
    }
  }
   
  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
      <div className='w-full' ref={messageContainerRef}>
      <button
        className='w-full'
        disabled={loading}
        onClick={() => loadingMore}
      >
        {loading ?? <Spin />}
      </button>
      {isEmpty ? <p className='hidden'>Yay, no issues found.</p> : null}
      
        {messages.map((message:MessageType,i) => {
          return (
            <MessageBox
              key={message._id}
              data={message}
              isLast={messages.length - 1 === i}
            />
          );
        })}
        <div className="pt-24" ref={bottomRef} />
      </div>
    </div>
  );
};

export default Body;