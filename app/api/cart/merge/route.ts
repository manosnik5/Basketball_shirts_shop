import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { mergeGuestCart } from "@/lib/actions/cart";
import { getGuestId, clearGuestId } from "@/lib/guest";

export const POST = withAuth(async (_request, session) => {
  try {
    const guestId = await getGuestId();

    if (!guestId) {
      // No guest cart to merge, nothing to do
      return NextResponse.json({ merged: false });
    }

    await mergeGuestCart(session.user.id, guestId);
    await clearGuestId();

    return NextResponse.json({ merged: true });
  } catch (error) {
    console.error("Cart merge error:", error);
    return NextResponse.json(
      { error: "Failed to merge cart" },
      { status: 500 }
    );
  }
});