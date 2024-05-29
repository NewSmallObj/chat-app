'use client';
import React from 'react';
import useRoutes from '@/app/action/useRoutes';
import MobileTabbarItem from './MobileTabbarItem';
import useConversation from '@/app/action/useConversation';
import { IoPersonCircle } from "react-icons/io5";
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const MobileTabbar = () => {
  const routes = useRoutes()
  const {isOpen} = useConversation()
  const pathname = usePathname();
  return (
    <div className={
      clsx(`
        fixed 
        justify-between 
        w-full 
        bottom-0 
        z-40 
        flex 
        items-center 
        bg-white 
        border-t-[1px] 
        lg:hidden
      `,{
        'hidden': isOpen
        })
    }>
      {
        routes.map((item)=>(
          <MobileTabbarItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            href={item.href}
            active={item.active}
            count={item.count}
          />
        ))
      }
      <MobileTabbarItem
          key="person"
          label="我的"
          icon={IoPersonCircle}
          href="/user"
          active={pathname === '/user'}
        />
    </div>
  );
};

export default MobileTabbar;