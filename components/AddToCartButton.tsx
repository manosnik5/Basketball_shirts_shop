"use client";

import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  teamLogoUrl: string | null;  
  shirtName: string;
  variantId: string;
  quantity?: number;
}

export default function AddToCartButton({
  teamLogoUrl,
  shirtName,
  variantId,
  quantity = 1,
}: AddToCartButtonProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  const { mutate: addToCart, isPending } = useAddToCart();

  const handleClick = () => {
    addToCart(
      { userId, variantId, quantity },
      {
        onSuccess: () => {
          router.push("/cart");
        },
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center justify-center gap-2 rounded-full bg-dark px-6 py-4 text-body-medium text-text-light transition hover:opacity-90 hover:cursor-pointer disabled:opacity-50"
    >
      {teamLogoUrl && (
  <Image
    src={`/${teamLogoUrl}`} alt={shirtName}
    height={35}
    width={35}
    priority
  />
)}


      {isPending ? (
        <div className="flex justify-center items-center gap-2">
          <div className="loader_circle" />
        </div>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
