import { NextRequest, NextResponse } from "next/server";
import { removeFromCart } from "@/lib/actions/cart";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cart = await removeFromCart(id);
    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}