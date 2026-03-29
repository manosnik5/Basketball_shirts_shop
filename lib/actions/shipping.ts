"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

interface ShippingData {
  userId?: string;
  firstname: string;
  lastname: string;
  email?: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  phone: string;
}

export async function submitShippingDetails(data: ShippingData) {
  try {
    const {
      userId,
      firstname,
      lastname,
      phone,
      street,
      city,
      postalCode,
      country,
    } = data;


    const address = await prisma.address.create({
      data: {
        ...(userId ? { userId } : {}),
        firstName: firstname,
        lastName: lastname,
        phone,
        street,
        city,
        postalCode,
        country,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("pending_shipping_address_id", address.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return { success: true, addressId: address.id };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit shipping details",
    };
  }
}

export async function getAddress(userId: string) {
  if (!userId) throw new Error("User not authenticated");

  const address = await prisma.address.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return address ?? null;
}

export async function getPendingShippingAddressId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("pending_shipping_address_id")?.value ?? null;
}

export async function clearPendingShippingAddressId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("pending_shipping_address_id");
}