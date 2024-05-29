"use client";
import serviceRequest from "@/libs/serviceRequest";
import { useEffect,useMemo } from "react";
import type { MessageType } from "../db/models/message";
import { useSocketContext } from "../providers/SocketContext"
import useConversation from "../store/useConversation";
import { URL } from "@/app/action/stants";
import type { ConversationType } from "@/app/db/models/conversation"
import { useParams } from "next/navigation";
import {isArray,head,last} from "lodash";
import { useSession } from "next-auth/react";

const useListenMessages = ()=>{
  const { socket }:{ socket:any } = useSocketContext();
  const { messages,setMessages,conversationList,setConversationList} = useConversation();
  const { conversationId } = useParams();
  const session = useSession()

  const currentConversationId = useMemo(()=>{
    if(isArray(conversationId)){
      return head(conversationId)
    }
    return null
  },[conversationId])


  // useEffect(()=>{
  //   getConversationList()
  //  },[])
  
  //  const getConversationList = async ()=> {
  //   const res = await serviceRequest.get<{code:number,data:ConversationType[]}>(
  //     URL.USER.CONVERSATION,{cacheTime:1000})
  //     if(res.code === 200){
  //       setConversationList(res.data)
  //     }
  //  }
  
  useEffect(()=>{
    // console.log("socket",socket)
    if(!socket) return;
      socket.on('newMessage',(message:MessageType)=>{
        setMessages(messages.concat(message))
      })
  },[socket,setMessages])

  useEffect(()=>{
    const message = last(messages)
    if(message) {
      setTimeout(() => {
        updateConversationList(message)
      }, 20);
    }
  },[messages])

  const updateConversationList = async (message:MessageType)=>{
    // console.log("当前的会话列表",conversationList)
    const isHas = conversationList.some((v)=>v._id === message.conversationId)
    if(!isHas){
      const res = await serviceRequest.post<{code:number,data:ConversationType}>(
        URL.CONVERSATION.CREATE_CONVERSATION,
        {params:{receiverId:message.receiverId[0]._id},cacheTime:1000}
      )
      if(res.code === 200){
        setConversationList([res.data,...conversationList])
      }
    }
    // console.log('currentConversationId',currentConversationId)
    // 当前打开的会话移除会话信息中未读消息内当前人的id
    const data = conversationList.map(v=>{
      if(v._id === currentConversationId){
        v.messages.forEach((m)=>{
          const index = m.unReads.indexOf(session?.data?.user?.userId!)
          if(index !== -1){
            m.unReads.splice(index,1)
          }
        })
      }
      if(v._id === message.conversationId){
        if(!v.messages.some((v)=>v._id === message._id)){
          if(v._id === currentConversationId){
            const index = message.unReads.indexOf(session?.data?.user?.userId!)
            if(index !== -1){
              message.unReads.splice(index,1)
            }
          }
          v.messages.push(message)
        }
        return {
          ...v,
          lastMessage:message.body || message.image,
          lastMessageAt:message.createdAt
        }
      }
      return v
    })
    setConversationList(data)
  }



}

export default useListenMessages