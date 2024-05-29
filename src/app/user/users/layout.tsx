import React from 'react';
import UserList from './components/UserList';


interface UsersLayoutProps {
  children: React.ReactNode
}



const UsersLayout = ({children}:UsersLayoutProps) => {
  return (
    <div className='h-full'>
      <UserList /> 
      <div className='lg:pl-60'>
        {children}
      </div>
    </div>
  );
};

export default UsersLayout;