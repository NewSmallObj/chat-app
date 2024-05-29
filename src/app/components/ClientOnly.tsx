'use client';

import React, { useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({children}) => {
  
  const [ hasMounted, setHasMounted ] = React.useState(true);

  useEffect(()=>{
    setHasMounted(true);
  },[])

  if(!hasMounted) return null;

  return (
    <>
      {children}
    </>
  );
};

export default ClientOnly;