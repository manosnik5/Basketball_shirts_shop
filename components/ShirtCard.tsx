"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useDeleteShirt } from "@/lib/hooks/useDeleteShirt";

interface ShirtCardProps {
  shirt: Shirt;
  isAdmin: boolean
}

export default function ShirtCard({ shirt, isAdmin }: ShirtCardProps) {
  const {mutate, isPending} = useDeleteShirt();
  const router = useRouter();
  return (
    <Card className="w-full h-[520px] flex flex-col justify-between overflow-hidden shadow-lg bg-light-light rounded-lg">
      <CardContent className="flex flex-col justify-between h-full p-4">
        <Link
          href={`/shirts/${shirt.id}`}
          className="block group cursor-pointer flex-1"
        >
          <div className="relative w-full h-80 mb-3 rounded-lg overflow-hidden">
            <Image
              src={`/${shirt.mainImage}`}
              alt={shirt.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            {isAdmin && (
              <button  
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this jersey?")) {
                  mutate(shirt.id, {
                    onSuccess: () => {
                        router.refresh(); // ✅ reloads the page data
                      },
                  });
                  
                }
              }} 
              disabled={isPending}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-2 rounded-xl opacity-100 hover:bg-red-400 transition cursor-pointer">✕</button>
            )}
             
            
          </div>

          <h3 className="text-lg font-medium text-dark-900 transition-colors truncate">
            {shirt.name}
          </h3>

          {shirt.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {shirt.description}
            </p>
          )}
        </Link>

        <div className="flex gap-2 items-center mt-3">
          {shirt.minPrice !== undefined && (
            <span className="text-text-dark font-medium text-lg">
              ${shirt.minPrice.toFixed(2)}
            </span>
          )}
          {shirt.maxPrice !== undefined && shirt.maxPrice !== shirt.minPrice && (
            <span className="line-through">
              ${shirt.maxPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
