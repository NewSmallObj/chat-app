import serviceRequest from '@/libs/serviceRequest';
import { useRequest } from 'ahooks';
import { UserType } from '../db/models/user';
import { URL,CURRENTUSER } from './stants';

export const useCurrentUser = ()=>{

  const fetch = async ()=>{
    const {data} = await serviceRequest.get<{code:number,data:UserType}>(URL.USER.LIST
      ,{cacheTime:10});
    return data
  }

  const { data, loading, refresh,run,runAsync  } = useRequest(fetch, {
    cacheKey: CURRENTUSER,
  });

  return {
    currentUser:data,
    loading,
    refresh,
    runAsync ,
    run
  }
}