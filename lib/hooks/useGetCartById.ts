import { useQuery } from "@tanstack/react-query";

export const useGetCartById = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });
};