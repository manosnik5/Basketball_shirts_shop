"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/validation";
import { PaymentMethod } from "@/lib/generated/prisma";
import { getGuestId } from "@/lib/guest";

export async function placeOrder(
  userId: string | undefined,
  shippingAddressId: string,
  billingAddressId?: string,
  paymentMethod: string = "cod"
) {
  // At least one identity is required
  const guestId = !userId ? await getGuestId() : undefined;
  if (!userId && !guestId) throw new Error("Not authenticated");

  const sanitizedUserId = userId ? sanitizeString(userId) : undefined;
  const sanitizedGuestId = guestId ? sanitizeString(guestId) : undefined;
  const sanitizedShippingAddressId = sanitizeString(shippingAddressId);
  const sanitizedBillingAddressId = billingAddressId
    ? sanitizeString(billingAddressId)
    : undefined;
  const sanitizedPaymentMethod = sanitizeString(paymentMethod);

  const validPaymentMethods = ["stripe", "paypal", "cod"];
  if (!validPaymentMethods.includes(sanitizedPaymentMethod)) {
    throw new Error("Invalid payment method");
  }

  // Find cart by userId for authenticated users, guestId for guests
  const cart = await prisma.cart.findFirst({
    where: sanitizedUserId ? { userId: sanitizedUserId } : { guestId: sanitizedGuestId },
    include: {
      items: {
        include: {
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  for (const item of cart.items) {
    if (item.variant.inStock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.variant.sku}. Available: ${item.variant.inStock}, Requested: ${item.quantity}`
      );
    }
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    const price = item.variant.salePrice ?? item.variant.price;
    return sum + Number(price) * item.quantity;
  }, 0);

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        // userId is optional — guest orders have no userId
        ...(sanitizedUserId ? { userId: sanitizedUserId } : {}),
        status: "PAID",
        totalAmount,
        shippingAddressId: sanitizedShippingAddressId,
        billingAddressId: sanitizedBillingAddressId,

        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.variant.salePrice ?? item.variant.price,
          })),
        },

        payments: {
          create: {
            method: sanitizedPaymentMethod as PaymentMethod,
            status: "completed",
            paidAt: new Date(),
            transactionId: `${sanitizedPaymentMethod.toUpperCase()}_${Date.now()}`,
          },
        },
      },
    });

    for (const item of cart.items) {
      await tx.shirtVariant.update({
        where: { id: item.variantId },
        data: {
          inStock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Delete the guest cart itself after checkout so the guestId
    // can't be reused to place duplicate orders
    if (sanitizedGuestId) {
      await tx.cart.delete({ where: { id: cart.id } });
    }

    return order;
  });

  return { success: true, orderId: result.id };
}