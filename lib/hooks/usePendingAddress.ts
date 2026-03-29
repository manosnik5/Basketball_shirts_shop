// lib/hooks/usePendingAddress.ts
import { useQuery } from "@tanstack/react-query";
import { getPendingShippingAddressId } from "@/lib/actions/shipping";
import { prisma } from "@/lib/prisma";


export function usePendingAddress(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["pending-address"],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const res = await fetch("/api/address/pending");
      if (!res.ok) throw new Error("Failed to fetch pending address");
      return res.json() as Promise<{ address: { id: string; firstName: string; lastName: string; street: string; city: string; country: string; postalCode: string } | null }>;
    },
  });
}