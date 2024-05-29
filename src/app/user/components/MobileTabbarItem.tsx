import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';


interface MobbileTabbarItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
  count?:number
}


const MobileTabbarItem = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
  count
}:MobbileTabbarItemProps) => {

  const handlerClick = () => {
    if(onClick){
      return onClick()
    }
  }

  return (
    <Link
     onClick={handlerClick}
     href={href}
     className={
      clsx(`
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
        relative
      `,active && 'bg-gray-100 text-black'
      )}>
        <div className={
          clsx(`
            rounded-full 
            z-10 
            translate-x-1/2 
            -translate-y-full 
            bg-red-600 
            text-xs 
            w-5
            h-5
            text-center 
            leading-5
            text-white 
            absolute 
            inset-x-1/2
            inset-y-1/2
          `,{'hidden': !count})}>
          { count! > 99 ? '99+' : count }
        </div>
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileTabbarItem;