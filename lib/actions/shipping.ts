"use server";

import { prisma } from "@/lib/prisma";
import DOMPurify from "isomorphic-dompurify"; 
interface ShippingData {
  userId: string;
  firstname: string;
  lastname: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  phone: string;
}

export async function submitShippingDetails(data: ShippingData) {
  try {
    const { userId, firstname, lastname, phone, street, city, postalCode, country } = data;

    if (!userId) throw new Error("User not authenticated");

    const cleanData = {
      userId,
      firstName: DOMPurify.sanitize(firstname),
      lastName: DOMPurify.sanitize(lastname),
      phone: DOMPurify.sanitize(phone),
      street: DOMPurify.sanitize(street),
      city: DOMPurify.sanitize(city),
      postalCode: DOMPurify.sanitize(postalCode),
      country: DOMPurify.sanitize(country),
    };


    const address = await prisma.address.create({ data: cleanData });

    return { success: true, address };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to submit shipping details" };
  }
}

export async function getAddress(userId: string) {
  if (!userId) throw new Error("User not authenticated");

  const address = await prisma.address.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!address) return null;

  return {
    ...address,
    firstName: DOMPurify.sanitize(address.firstName),
    lastName: DOMPurify.sanitize(address.lastName),
    street: DOMPurify.sanitize(address.street),
    city: DOMPurify.sanitize(address.city),
    postalCode: DOMPurify.sanitize(address.postalCode),
    country: DOMPurify.sanitize(address.country),
    phone: DOMPurify.sanitize(address.phone),
  };
}
