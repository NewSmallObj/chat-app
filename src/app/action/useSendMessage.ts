import React,{useState} from "react"
import useConversation from "@/app/store/useConversation";
import serviceRequest from '@/libs/serviceRequest';
import type {MessageType} from "@/app/db/models/message"
import { URL } from "./stants";

export interface SendMessageProps {
  image?:string;
  message?:string;
  conversationId:string;
  receiverId:string;
}

const useSendMessage = ()=> {
  const [loading,setLoading] = useState(false);
  const { messages,setMessages } = useConversation();

  const sendMessage = async ({image,conversationId,message,receiverId}:SendMessageProps)=> {
    setLoading(true);
    try {
      const res = await serviceRequest.post<{code:number,data:MessageType}>(
        `${URL.CONVERSATION.CREATE_CONVERSATION}/${conversationId}`
        ,{params:{receiverId,body:message,image},cacheTime:10})

        serviceRequest.post('/api/socket/sendMessage',{
          params:res.data,
          cacheTime:10
        })

      if(res.code === 200){
        setMessages([...messages,res.data]);
      }
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  return {
    loading,
    sendMessage
  }
}

export default useSendMessage;