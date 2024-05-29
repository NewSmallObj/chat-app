import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { CommentType } from '../db/models/comment';
import { URL,UNREADCOMMENTKEY } from './stants';

export const useComment = ()=>{

  const fetch = async ()=>{
    let {code,data} = await serviceRequest.get<{code:number,data:CommentType[]}>(`${URL.USER.UNREADCOMMENT}`
      ,{cacheTime:10});
      if(code !== 200) return []
      return data
  }

  const { data, loading, refresh,run,params } = useRequest(fetch, {
    manual: true,
    cacheKey: UNREADCOMMENTKEY,
    refreshOnWindowFocus: false,
    // staleTime:1000
  });
    
  return {
    data, 
    loading,
    params,
    refresh,
    run,
  }
}