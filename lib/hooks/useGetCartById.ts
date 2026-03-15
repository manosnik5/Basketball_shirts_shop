import { useQuery } from "@tanstack/react-query";

export const useGetCartById = (userId?: string) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    enabled: !!userId,
  });
};