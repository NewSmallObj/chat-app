'use client';
import React, { useMemo } from 'react';
import UserItem from './UserItem';
import { useUserList } from '@/app/action/useUser';


const UserList = () => {

  const {data,refresh} = useUserList()
  
  return (
    <div className="
        fixed
        inset-y-0
        w-full
        overflow-y-auto
        border-r
        border-gray-200
        block
        left-0
        lg:w-80
        lg:pl-20
        lg:block
      ">
        {
          data?.followingIds?
          data?.followingIds.map((user)=> <UserItem user={user} key={user._id} getUserList={refresh} />):<></>
        }
    </div>
  );
};

export default UserList;