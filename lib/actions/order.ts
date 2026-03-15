"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/validation";
import { PaymentMethod } from "@/lib/generated/prisma";

export async function placeOrder(
  userId: string,
  shippingAddressId: string,
  billingAddressId?: string,
  paymentMethod: string = "cod"
) {
  if (!userId) throw new Error("Not authenticated");

  const sanitizedUserId = sanitizeString(userId);
  const sanitizedShippingAddressId = sanitizeString(shippingAddressId);
  const sanitizedBillingAddressId = billingAddressId ? sanitizeString(billingAddressId) : undefined;
  const sanitizedPaymentMethod = sanitizeString(paymentMethod);

  const validPaymentMethods = ["stripe", "paypal", "cod"];
  if (!validPaymentMethods.includes(sanitizedPaymentMethod)) {
    throw new Error("Invalid payment method");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: sanitizedUserId },
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
        userId: sanitizedUserId,
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

    return order;
  });

  return { success: true, orderId: result.id };
}