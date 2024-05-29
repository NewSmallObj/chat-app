import Image from 'next/image';
import React from 'react';
import { AuthForm } from '../components/AuthForm';

const Auth = () => {
  return (
    <div className="
      flex 
      min-h-full 
      flex-col 
      justify-center 
      py-12 
      sm:px-6 
      lg:px-8 
      bg-gray-100
    ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image height={48} width={48} alt="logo" className="mx-auto w-auto" src="/images/logo.png" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          chat-web
        </h2>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;