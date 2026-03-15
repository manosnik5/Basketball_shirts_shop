"use client";

import { useGetCartById } from "@/lib/hooks/useGetCartById";
import { PAYMENT_METHODS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useRemoveFromCart } from "@/lib/hooks/useRemoveFromCart";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/types";

const Cart = () => {
  const router = useRouter();

  const { data: cart, isLoading, isError } = useGetCartById();
  const { mutate: removeFromCartItem } = useRemoveFromCart();

  if (isLoading) return <p>Loading your cart...</p>;
  if (isError) return <p>Failed to load cart.</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  const cartTotal = cart.items.reduce((total: number, item: CartItem) => {
    const price = Number(item.variant.salePrice ?? item.variant.price);
    return total + price * item.quantity;
  }, 0);


  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
      
      <div className="flex flex-col relative w-full rounded-xl bg-light gap-4 p-4 shadow-lg">
        {cart.items.map((item: CartItem) => {
          const primaryShirtImage =
            item.variant.shirt.images.find((img) => img.isPrimary) ||
            item.variant.shirt.images[0];

          const imageUrl = primaryShirtImage?.url
            ? `/${primaryShirtImage.url}`
            : "/placeholder.png";

          const itemPrice = Number(item.variant.salePrice ?? item.variant.price);
          const itemTotal = itemPrice * item.quantity;

          return (
            <div
              key={item.id}
              className="relative flex items-center gap-4 mb-4 xl:gap-8 xl:p-8"
            >
              <button
                onClick={() => removeFromCartItem(item.id)}
                className="absolute top-2 right-2 xl:top-4 xl:right-4"
              >
                <Image
                  src="/close_black.png"
                  alt="delete_cart_item"
                  width={20}
                  height={20}
                  priority
                  className="cursor-pointer"
                />
              </button>

              <Image
                src={imageUrl}
                alt={item.variant.shirt.name}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />

              <div className="flex flex-col gap-1 xl:gap-2">
                <h3 className="text-lg xl:text-2xl">
                  {item.variant.shirt.name}
                </h3>

                <p className="text-gray-600 xl:text-xl">
                  Size: {item.variant.size.name}
                </p>

                <p className="text-gray-600 xl:text-xl">
                  Quantity: {item.quantity}
                </p>

                <p className="font-bold xl:text-2xl">
          
                 
                    ${itemTotal.toFixed(2)}
               
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="order-2 flex flex-col gap-3 p-5">
        <h2 className="text-heading-3 text-dark mb-4">Order Summary</h2>

        <div className="flex justify-between text-dark font-medium">
          <h3>Cart Total</h3>
          <h3>
            ${cartTotal.toFixed(2)}
          </h3>
        </div>

        <button onClick={() => router.push("/shipping")} className="flex items-center justify-center gap-2 rounded-full bg-[#E61A4D] px-6 py-4 text-body-medium text-text-light transition hover:opacity-90 hover:cursor-pointer disabled:opacity-50 mt-10">
          <h2>Checkout</h2>
        </button>

        <div className="flex flex-row items-center gap-6 mt-4">
          <h2 className="text-lg font-semibold">We Accept:</h2>
          <div className="flex flex-row items-center gap-4">
            {PAYMENT_METHODS.map((method) => (
              <Image
                key={method.name}
                src={method.img}
                alt={method.name}
                width={45}
                height={30}
                className="object-contain"
                priority
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/shirts"
            className="text-sm hover:underline text-blue-600"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
