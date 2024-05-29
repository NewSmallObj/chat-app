import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface DesktopSidebarItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
  count?:number
}

const DesktopSidebarItem = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
  count
}:DesktopSidebarItemProps) => {
  
  const handlerClick = () => {
    if(onClick){
      return onClick()
    }
  }

  return (
    <div onClick={handlerClick} key={label}>
      <Link
      href={href}
      className={
        clsx(`
          group
          flex
          gap-x-3
          rounded-md
          p-3
          text-sm
          leading-6
          font-semibold
          text-gary-50
          hover:text-black
          hover:bg-gray-100
          relative
        `,{'bg-gray-100 text-black':active})
      }
      >
      <div className={
        clsx(`
          rounded-full 
          z-10 
          translate-x-1/2 
          -translate-y-1/2 
          bg-red-600 
          text-xs 
          w-5
          h-5
          text-center 
          leading-5
          text-white 
          absolute 
          right-0 
          top-0
        `,{'hidden': !count})}>
        { count! > 99 ? '99+' : count }
      </div>
      <Icon className='h-6 w-6 shrink-0' aria-hidden='true' />
        <span className='sr-obly hidden'>{label}</span>
      </Link>
    </div>
  );
};

export default DesktopSidebarItem;