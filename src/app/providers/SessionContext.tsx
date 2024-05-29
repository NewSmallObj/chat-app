"use client";

import { SessionProvider, signOut } from "next-auth/react";
import { useEffect } from "react";

export interface SessionContextProps {
  children: React.ReactNode;
}

export default function SessionContext({ 
  children
}: SessionContextProps) {

  return <SessionProvider>{children}</SessionProvider>;
}
