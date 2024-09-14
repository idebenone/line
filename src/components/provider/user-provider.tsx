"use client";

import { ReactNode } from "react";
import useUserSession from "@/lib/hooks/use-user-session";

export default function UserProvider({ children }: { children: ReactNode }) {
  useUserSession();

  return <>{children}</>;
}
