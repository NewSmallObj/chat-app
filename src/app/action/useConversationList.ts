import type { ConversationType } from "@/app/db/models/conversation";
import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { URL } from './stants';

// 此方法查询所有的会话列表 暂时无用
export const useConversationList = ()=>{

  const fetch = async ()=>{
    const {data} = await serviceRequest.get<{code:number,data:ConversationType[]}>(URL.CONVERSATION.LIST
      ,{cacheTime:10});
    return data
  }

  const { data, loading, refresh,run } = useRequest(fetch, {
    cacheKey: 'cacheKey-conversation-list',
  });


  return {
    data, 
    loading, 
    refresh,
    run
  }
}

