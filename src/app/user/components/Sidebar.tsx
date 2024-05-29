'use client';
import React from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileTabbar from './MobileTabbar';
import useListenMessages from '@/app/action/useListenMessages';

interface SidebarProps {
  children: React.ReactNode
}


const Sidebar = ({children}:SidebarProps) => {
  useListenMessages()
  return (
    <div className='h-full'>
      <DesktopSidebar/>
      <MobileTabbar/>
      {children}
    </div>
  );
};

export default Sidebar;