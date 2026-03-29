import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/actions/order";
import { withOptionalAuth } from "@/lib/api-auth";
import { getPendingShippingAddressId, clearPendingShippingAddressId } from "@/lib/actions/shipping";

export const POST = withOptionalAuth(async (request, session) => {
  try {
    const body = await request.json();
    const { shippingAddressId, billingAddressId, paymentMethod } = body;

    if (!shippingAddressId || !billingAddressId) {
      return NextResponse.json(
        { error: "Missing required address fields" },
        { status: 400 }
      );
    }


    const userId = session?.user?.id;
    if (!userId) {
      const pendingAddressId = await getPendingShippingAddressId();
      if (!pendingAddressId || pendingAddressId !== shippingAddressId) {
        return NextResponse.json(
          { error: "Invalid or expired shipping address" },
          { status: 403 }
        );
      }
    }

    const result = await placeOrder(
      userId,
      shippingAddressId,
      billingAddressId,
      paymentMethod
    );

    if (!userId) {
      await clearPendingShippingAddressId();
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to place order" },
      { status: 500 }
    );
  }
});