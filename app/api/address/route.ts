import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/actions/shipping";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    const address = await getAddress(userId);

    return NextResponse.json({ address });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch address";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}