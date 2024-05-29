
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container:React.FC<ContainerProps> = ({children}) => {
  return (
    <div className='mx-auto lg:pl-20 h-full'>
      {children}
    </div>
  );
};

export default Container;