import serviceRequest from '@/libs/serviceRequest';
import { useCallback } from 'react';
import { useCurrentUser } from "./useCurrentUser";
import { URL } from './stants';
import { PostType } from '../db/models/post';
import { message } from 'antd';

export const useLike = ({ postId }: { postId: string })=>{
  // const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useCurrentUser();
  
  const fetch = async (hasLiked:boolean)=>{
    try {
      const {code,data} = await serviceRequest.post<{code:number,data:PostType}>(
        URL.POST.TOGGLE_LIKE,
        {
          params:{postId,hasLiked},
          cacheTime:0
        });
      if(code !== 200) return message.success('操作失败');
      message.success('操作成功');
      return data;
    }catch (error) {
      return error;
    }
  }

  const toggleLike = useCallback(async(hasLiked:boolean):Promise<PostType | unknown> => {
    try {
     return await fetch(hasLiked)
    } catch (error) {
      message.error('操作失败');
    }
  }, [currentUser, postId]);
    
  return {
    toggleLike,
  }
}