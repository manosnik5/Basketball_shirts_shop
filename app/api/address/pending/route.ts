// app/api/address/pending/route.ts
import { NextResponse } from "next/server";
import { getPendingShippingAddressId } from "@/lib/actions/shipping";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const addressId = await getPendingShippingAddressId();
  if (!addressId) return NextResponse.json({ address: null });

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  return NextResponse.json({ address: address ?? null });
}