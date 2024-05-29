"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import { AiOutlineMore } from "react-icons/ai";
import { MdOutlineChevronLeft } from "react-icons/md";
import { useParams } from 'next/navigation';
import { useUserInfo } from "@/app/action/useUserInfo"

const Header = () => {

  const params = useParams();

  const {run,data} = useUserInfo();

  useEffect(()=>{
    run(params.conversationId[1])
  },[params,params.conversationId[1]])

  return (
    <div className="
      bg-white 
      w-full 
      flex 
      border-b-[1px] 
      sm:px-4 
      py-3 
      px-4 
      lg:px-6 
      justify-between 
      items-center 
      shadow-sm">
        <div className="flex gap-3 items-center">
          <Link 
            href='/user/conversations'
            className="
              lg:hidden
              block
              text-sky-500
              hover:text-sky-600
              transition
              cursor-pointer
            ">
              <MdOutlineChevronLeft size={32} />
          </Link>
          <div className="flex flex-col">
            <div className='w-full truncate'>{ data?.name }</div>
            <div className='text-sm font-light text-neutral-500 hidden'>
              状态
            </div>
          </div>
        </div>
        <AiOutlineMore 
          size={24}
          className="
            text-neutral-500
            cursor-pointer
            hover:text-sky-600
            transition
            "
          />
    </div>
  );
};

export default Header;