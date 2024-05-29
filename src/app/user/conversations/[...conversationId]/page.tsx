import React from 'react';
import Body from './components/Body';
import Form from './components/Form';
import Header from './components/Header';


const ConversationPage = () => {

  return (
    <div className='lg:pl-60 h-full'>
      <div className='h-full flex flex-col'>
        <Header />
        <Body />
        <Form />
      </div>
    </div>
  );
};

export default ConversationPage;