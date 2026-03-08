import { NextRequest, NextResponse } from "next/server";
import { placeOrder } from "@/lib/actions/order";
import { withAuth } from "@/lib/api-auth";

export const POST = withAuth(async (request, session) => {
  try {
    const body = await request.json();
    const { shippingAddressId, billingAddressId } = body;

    if (!shippingAddressId || !billingAddressId) {
      return NextResponse.json(
        { error: "Missing required address fields" },
        { status: 400 }
      );
    }
    
    const result = await placeOrder(
      session.user.id,
      shippingAddressId,
      billingAddressId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
});