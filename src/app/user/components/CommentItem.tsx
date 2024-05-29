'use client';
import { AVATARBASEURL, PUBSUBCOMMENTKEY, PUBSUBCOMMENTUNREADKEY, URL } from "@/app/action/stants";
import type { CommentType } from "@/app/db/models/comment";
import serviceRequest from "@/libs/serviceRequest";
import { Avatar } from "antd";
import clsx from 'clsx';
import dayjs from 'dayjs';
import { get } from "lodash";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PubSub from 'pubsub-js';
import { useCallback, useMemo } from 'react';

interface CommentItemProps {
  data: CommentType;
}

const CommentItem: React.FC<CommentItemProps> = ({ data }) => {
  const router = useRouter();
  const session = useSession();

  // 点击前往post 并将当前post下所有评论设置为已读
  const fetch = async (postId:string)=>{
    let {code} = await serviceRequest.put<{code:number,data:any}>(`${URL.USER.UNREADCOMMENT}`
      ,{
        params:{
          postId
        }
      ,cacheTime:10});
     if(code === 200) {
        PubSub.publish(PUBSUBCOMMENTUNREADKEY, 1);
     }
  }

  const delComment = useCallback(async(ev: any)=>{
    ev.stopPropagation();
    let {code} = await serviceRequest.delete<{code:number,data:any}>(`${URL.COMMENT.CREATE_COMMENT}`
      ,{
        params:{
          id:data._id,
          postId:data.postId[0]._id
        }
      ,cacheTime:10});
    if(code == 200){
      PubSub.publish(PUBSUBCOMMENTUNREADKEY, 1);
      PubSub.publish(PUBSUBCOMMENTKEY, 1);
    }
  },[data])

  const startActivity = async (ev: any)=>{
    ev.stopPropagation();
    await fetch(data.postId[0]._id);
    router.push(`/user/posts/${data.postId[0]._id}`)
  }

  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/user?userId=${get(data, 'userId[0]._id', '')}`)
  }, [router, data?.userId?.length]);

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }, [data.createdAt])

  return (
    <div 
      className="
        border-b-[1px] 
        border-neutral-200 
        p-5 
        cursor-pointer 
        hover:bg-neutral-100 
        transition
      ">
      <div className="flex flex-row items-start gap-3" onClick={startActivity}>
        <Avatar src={<img src={ AVATARBASEURL + get(data, 'userId[0].avatar', '')} alt="avatar" />} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p 
              onClick={goToUser} 
              className="
                text-block 
                font-semibold 
                cursor-pointer 
                hover:underline
            ">
              {
                get(data, 'userId[0].name', '')
              }
            </p>
            <span 
              onClick={goToUser} 
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
              @{
                get(data, 'userId[0].name', get(data, 'userId[0].username', ''))
              }
            </span>
            <span className="text-neutral-500 text-sm">
              {createdAt}
            </span>
          </div>
          <div className="text-block mt-1">
            {data?.body}
          </div>
          <div className={
            clsx(`
              flex 
              justify-start 
              items-center 
              text-red-500 
              text-sm 
              cursor-pointer 
              pt-2 
              hover:text-red-600
            `,{'hidden':session.data?.user?.userId != data.userId[0]?._id})
            }
            onClick={delComment}
          >
            删除
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentItem;
