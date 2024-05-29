'use client';
import React from 'react';
import Container from '../components/Container';
import Sidebar from './components/Sidebar';
import { SocketContextProvider } from "../providers/SocketContext";


interface UserlayoutProps {
  children: React.ReactNode
}

const Userlayout = ({children}:UserlayoutProps) => {
  
  return (
      <SocketContextProvider>
        <Sidebar>
          <Container>
              {children}
          </Container>
        </Sidebar>
      </SocketContextProvider>
  );
};

export default Userlayout;