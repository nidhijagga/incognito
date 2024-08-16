"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProviderProps {
  session: any; // You might want to use a more specific type here if available
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
