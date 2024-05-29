
import serviceRequest from '@/libs/serviceRequest';
import React, { useEffect, useState } from 'react';
import useConversation from '../store/useConversation';
import { URL } from './stants';
import { MessageType } from '../db/models/message';

const useGetMessages = () => {
  const { messages,setMessages,selectedConversation } = useConversation();
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    if (selectedConversation) getMessages();
  },[selectedConversation,setMessages])

  const getMessages = async (offset:number = 0)=>{
    if(!selectedConversation) return;
    setLoading(true);
    try {
      const res = await serviceRequest.get<{code:number,data:MessageType[],msg:string}>(
        `${URL.CONVERSATION.CREATE_CONVERSATION}/${selectedConversation}/message`,
        {params:{offset},cacheTime:1000})
      if(res.code !== 200) throw new Error(res.msg);
      if(offset === 0){
        setMessages(res.data);
      }else{
        setMessages(res.data.concat(messages));
        return true;
      }
    } catch (error) {
      
    }finally{
      setLoading(false);
    }
  }

  return {getMessages,messages,loading};
};

export default useGetMessages;