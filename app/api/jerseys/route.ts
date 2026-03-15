import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-auth";
import { createShirt } from "@/lib/actions/shirt";
import type { CreateShirtInput } from "@/lib/types"; 
import { deleteShirt } from "@/lib/actions/shirt";

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const data: CreateShirtInput = await req.json();
    const result = await createShirt(data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create shirt";
    return NextResponse.json({ error: message }, { status: 400 });
  }
});

export const DELETE = withAdminAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const shirtId = searchParams.get("id");

    if (!shirtId) {
      return NextResponse.json({ error: "shirtId is required" }, { status: 400 });
    }

    await deleteShirt(shirtId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete shirt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});