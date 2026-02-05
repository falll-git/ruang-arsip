"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppToastProvider } from "@/components/ui/AppToastProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppToastProvider>{children}</AppToastProvider>
    </AuthProvider>
  );
}
