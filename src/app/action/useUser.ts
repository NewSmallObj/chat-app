import type { UserType } from "@/app/db/models/user";
import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { URL } from './stants';


export const useUserList = ()=>{

  const fetch = async ()=>{
    const {data} = await serviceRequest.get<{code:number,data:UserType}>(URL.USER.LIST
      ,{cacheTime:10});
    return data
  }

  const { data, loading, refresh,run } = useRequest(fetch, {
    cacheKey: 'cacheKey-user-list',
  });

    
  return {
    data,
    loading,
    refresh,
    run
  }
}