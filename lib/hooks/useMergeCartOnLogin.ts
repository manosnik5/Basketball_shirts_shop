// lib/hooks/useMergeCartOnLogin.ts
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

export function useMergeCartOnLogin() {
  const { data: session } = useSession();
  const previousUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentUserId = session?.user?.id;

    // Fired when transitioning from logged-out to logged-in
    if (currentUserId && !previousUserId.current) {
      fetch("/api/cart/merge", { method: "POST" }).catch(console.error);
    }

    previousUserId.current = currentUserId;
  }, [session?.user?.id]);
}