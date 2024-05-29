import React from 'react';
import ConversationList from './components/ConversationList';

interface ConversationLayoutProps {
  children: React.ReactNode;
}

const ConversationLayout = ({children}:ConversationLayoutProps) => {
  
  return (
    <div className='h-full'>
      <ConversationList />
      {children}
    </div>
  );
};

export default ConversationLayout;