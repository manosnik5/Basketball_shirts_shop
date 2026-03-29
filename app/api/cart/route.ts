import { NextRequest, NextResponse } from "next/server";
import { addToCart, getCart } from "@/lib/actions/cart";
import { withOptionalAuth } from "@/lib/api-auth";
import { getOrCreateGuestId } from "@/lib/guest";

export const POST = withOptionalAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json();
    const { variantId, quantity } = body; 

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = session?.user?.id;
  
    const guestId = userId ? undefined : await getOrCreateGuestId();

    const cart = await addToCart({ userId, guestId, variantId, quantity });
    return NextResponse.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
});

export const GET = withOptionalAuth(async (_request: NextRequest, session) => {
  try {
    const userId = session?.user?.id;
    if (!userId) {
      const { getGuestId } = await import("@/lib/guest");
      const guestId = await getGuestId();
      if (!guestId) return NextResponse.json(null);
      const cart = await getCart({ guestId });
      return NextResponse.json(cart);
    }

    const cart = await getCart({ userId });
    return NextResponse.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
});