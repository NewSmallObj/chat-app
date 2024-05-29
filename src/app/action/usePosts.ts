import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { PostType } from '../db/models/post';
import { URL,POSTKEYS } from './stants';

export const usePosts = ()=>{

  const [ posts,setPosts ] = useState<PostType[]>([])

  const fetch = async (page:number = 1,limit:number = 10,userId?:string,isLike?:number)=>{
    let {code,data} = await serviceRequest.get<{code:number,data:PostType[]}>(URL.POST.LIST
      ,{params:{userId,page,limit,isLike},cacheTime:0});
      if(code !== 200) return posts
      if(page === 1) {
        setPosts(data)
      } else{
        data = [...posts,...data]
        setPosts(data);
      }
      return data
  }

  const { data, loading, refresh,run,params } = useRequest(fetch, {
    manual: true,
    cacheKey: POSTKEYS,
    refreshOnWindowFocus: true,
  });

  const deletPost = (postId:string)=>{
    const data = posts.filter((v)=>v._id !== postId);
    setPosts(data);
  }

    
  return {
    posts, 
    loading,
    params,
    deletPost,
    refresh,
    run
  }
}

export const fetch = async (page:number = 1,limit:number = 10,userId?:string)=>{
  let {code,data} = await serviceRequest.get<{code:number,data:PostType[]}>(URL.POST.LIST
    ,{params:{userId,page,limit},cacheTime:0});
    if(code !== 200) return []
    return data
}