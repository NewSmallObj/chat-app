"use client";
import type { SegmentedValueType } from "@/app/store/useSegmented";
import useSegmented from "@/app/store/useSegmented";
import { Segmented,Badge } from 'antd';
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo } from 'react';
import { useComment } from "@/app/action/useComment";
import { PUBSUBCOMMENTUNREADKEY } from "@/app/action/stants"

interface PostListProps {
  showSegmented?: boolean
}

const PostSegmented = ({showSegmented = false}:PostListProps) => {

  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const { segmentedValue,setSegmentedValue } = useSegmented();
  const { run,data,refresh } = useComment();

  useEffect(() => {
    const subscription = PubSub.subscribe(PUBSUBCOMMENTUNREADKEY, (message,data) => {
      refresh()
    });
    return () => {
      PubSub.unsubscribe(subscription);
      setSegmentedValue('1')
    };
  }, []);
  
  const userId = useMemo(()=>{
    return searchParams.get('userId') || null
  },[searchParams,searchParams.get('userId')])

  useEffect(()=>{
    if(!userId) setSegmentedValue('1');
    if(userId) setSegmentedValue('2');
  },[userId])

  const isMain = useMemo(()=>{
    if(!userId) return true
    return userId === session.data?.user?.userId
  },[userId])

  useEffect(()=>{
    if(isMain){
      run()
    }
  },[isMain])

  const handlerUserClick = (value:SegmentedValueType) => {
    if(value === '1'){
      router.replace('/user')
    }
    if(value === '2'){
      router.replace('/user?userId='+ session.data?.user?.userId)
    }
  }

  const handlerChange = (value:SegmentedValueType) => {
    handlerUserClick(value)
    if(value !== '2') setSegmentedValue(value)
  }


  return (
    <Fragment>
      {
        showSegmented && isMain ? 
        <div className={`w-full`}>
        <Segmented
          value={segmentedValue}
              block
              options={[
                {
                  label: (
                    <div className="p-2">
                      <div>全部</div>
                    </div>
                  ),
                  value: '1'
                },
                {
                  label: (
                    <div className="p-2">
                      <div>圈子</div>
                    </div>
                  ),
                  value: '2'
                },
                {
                  label: (
                    <div className="p-2">
                      <Badge count={ data?.length || 0  } offset={[10, 0]}>
                            <div>回复我的</div>
                      </Badge>
                    </div>
                  ),
                  value: '3'
                },
                {
                  label: (
                    <div className="p-2">
                      <div>我关注的</div>
                    </div>
                  ),
                  value: '4'
                }
              ]}
              onChange={handlerChange}
            />
        </div>:
        <div className={`w-full`}>
        <Segmented
          value={segmentedValue}
              block
              options={[
                {
                  label: (
                    <div className="p-2">
                      <div>全部</div>
                    </div>
                  ),
                  value: '1'
                },
                {
                  label: (
                    <div className="p-2">
                      <div>圈子</div>
                    </div>
                  ),
                  value: '2'
                }
              ]}
              onChange={handlerChange}
            />
        </div>
      }
    </Fragment>
  );
};

export default PostSegmented;