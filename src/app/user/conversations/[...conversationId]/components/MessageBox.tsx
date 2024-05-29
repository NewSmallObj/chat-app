'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
// import ImageModal from './ImageModal';
import { MessageType } from "@/app/db/models/message"
import { useSession } from 'next-auth/react';
import dayjs from "dayjs";
import { Image as AntImage } from 'antd';
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"
import { get } from 'lodash';

interface MessageBoxProps {
  data: MessageType // FullMessageType;
  isLast?: boolean;
}

const MessageBox:React.FC<MessageBoxProps> = ({ 
  data, 
  isLast
}) => {
  
  const session = useSession()
  const isOwn = session.data?.user?.userId === data.senderId[0]._id; //是否自己发送的数据

  // const seenList = (data.seen || [])
  //   .filter((user) => user.email !== data?.sender?.email)
  //   .map((user) => user.name)
  //   .join(', ');

    // const seenList = ""

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden', 
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100', 
    data.image ? 'rounded-md p-0' : 'rounded-md py-2 px-3'
  );


  const [isOpen,setIsOpen] = useState(false)
  
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar className='w-9 h-9 md:h-11 md:w-11 rounded-md'>
          <AvatarImage className='w-9 h-9 md:h-11 md:w-11 rounded-md' 
          src={ AVATARBASEURL + data.senderId[0]?.avatar} 
          alt="@shadcn" />
          <AvatarFallback>{data.senderId[0]?.username}</AvatarFallback>
        </Avatar>
      </div>
      <div className={body}>
      <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {get(data, 'senderId[0].name', get(data, 'senderId[0].username', ''))}
          </div>
          <div className="text-xs text-gray-400">
            {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
        <div className={message} style={{backgroundColor: data.image ? 'transparent':''}}>
          {
            data.image ? (
              <>
              <AntImage 
                className='hidden'
                preview={{
                  visible:isOpen,
                  src: POSTBASEURL + data.image,
                  onVisibleChange: (value) => {
                    setIsOpen(value);
                  },
                }}
                />
                <Image className="
                  object-cover
                  cursor-pointer
                  transition 
                  w-40
                  h-24 
                  md:w-48 
                  md:h-36
                  rounded-md
                " 
                  alt='Image'
                  width={20} 
                  height={20}
                  layout="cover"
                  onClick={()=>setIsOpen(true)}
                  loader={()=>POSTBASEURL +data.image}
                  src={ POSTBASEURL + data.image}
                  />
              </>
            ):(
              <div>{data.body}</div>
            )
          }
        </div>
        {/* {isLast && isOwn && seenList.length > 0 && (
            <div 
              className="
              text-xs 
              font-light 
              text-gray-500
              "
            >
              {`Seen by ${seenList}`}
            </div>
          )} */}
      </div>
    </div>
  );
};

export default MessageBox;