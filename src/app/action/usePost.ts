import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { PostType } from '../db/models/post';
import { URL,POSTKEY } from './stants';

export const usePost = ()=>{

  const [ post,setPost ] = useState<PostType>({
    _id: '',
    body: '',
    images: [],
    userId: [],
    likedIds: [],
    comment: [],
    createdAt: '',
    updatedAt: '',
  })


  const fetch = async (postId:string)=>{
    let {code,data} = await serviceRequest.post<{code:number,data:PostType}>(`${URL.POST.LIST}/${postId}`
      ,{cacheTime:10});
      if(code !== 200) return post

      console.log("datadata",data)
      setPost(data)
      return data
  }

  const { data, loading, refresh,run,params } = useRequest(fetch, {
    manual: true,
    cacheKey: POSTKEY,
    refreshOnWindowFocus: false,
    // staleTime:1000
  });

  const updatePost = (data:PostType)=>{
    setPost(data)
  }
    
  return {
    post:data || post, 
    loading,
    params,
    refresh,
    run,
    updatePost
  }
}