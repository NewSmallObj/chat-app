"use client";
import { AVATARBASEURL, UPDATEUSER } from "@/app/action/stants";
import { useCurrentUser } from '@/app/action/useCurrentUser';
import useRoutes from '@/app/action/useRoutes';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PubSub from 'pubsub-js';
import { useEffect } from 'react';
import { IoMdLogOut } from "react-icons/io";
import DesktopSidebarItem from './DesktopSidebarItem';

const DesktopSidebar = () => {
  const routes = useRoutes()
  const router = useRouter();
  const {currentUser,refresh} = useCurrentUser();

  useEffect(() => {
    const subscription = PubSub.subscribe(UPDATEUSER, (message,data) => {
      refresh()
    });
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);

  const logOut = async ()=>{
    await signOut({ redirect: false})
    router.replace("/");
  }

  const startActivity = ()=>{
    router.push("/user")
  }

  return (
    <div className='
      hidden 
      lg:fixed
      lg:inset-y-0 
      lg:left-0 
      lg:z-40 
      lg:w-20 
      xl:px-6
      lg:overflow-y-auto 
      lg:bg-white 
      lg:border-r-[1px]
      lg:pb-4
      lg:flex
      lg:flex-col
      justify-between
      '>
      <nav className='mt-4 flex flex-col justify-between'>
        <div className="flex flex-col items-center space-y-1">
          <div className='cursor-pointer hover:opacity-75 transition mb-4' onClick={startActivity}>
            <Avatar className='w-9 h-9 md:h-11 md:w-11 rounded-md'>
              <AvatarImage className='w-9 h-9 md:h-11 md:w-11 rounded-md' 
              src={AVATARBASEURL+ currentUser?.avatar || ""} 
              alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          {
            routes.map((item)=>(
              <DesktopSidebarItem 
                key={item.label} 
                icon={item.icon} 
                href={item.href} 
                label={item.label} 
                active={item.active}
                count={item.count}
                />
            ))
          }
        </div>
      </nav>
      <nav className='mt-4 flex flex-col justify-between items-center'>
        <DesktopSidebarItem 
          href="#"
          label="退出登录"
          icon={IoMdLogOut}
          onClick={logOut}
        />
      </nav>
    </div>
  );
};

export default DesktopSidebar;