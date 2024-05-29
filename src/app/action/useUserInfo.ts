import type { UserType } from "@/app/db/models/user";
import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { URL, USERKEY } from './stants';


export const useUserInfo = ()=>{

  const fetch = async (userId:String)=>{
    const {data} = await serviceRequest.get<{code:number,data:UserType}>(URL.USER.LIST
      ,{params:{userId},cacheTime:10});
    return data
  }

  const { data, loading, refresh,runAsync,run } = useRequest(fetch, {
    manual: true,
    cacheKey: USERKEY,
  });

    
  return {
    data,
    loading,
    refresh,
    run,
    runAsync
  }
}