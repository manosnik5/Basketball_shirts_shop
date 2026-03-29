import { prisma } from "@/lib/prisma";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          shirt: {
            include: {
              images: true,
            },
          },
          size: true,
          images: true,
        },
      },
    },
  },
} as const;

export async function addToCart({
  userId,
  guestId,
  variantId,
  quantity,
}: {
  userId?: string;
  guestId?: string;
  variantId: string;
  quantity: number;
}) {
  if (!userId && !guestId) {
    throw new Error("No userId or guestId provided");
  }

  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { guestId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        ...(userId ? { userId } : { guestId }),
      },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId,
      },
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });
}


export async function getCart(identifier: { userId: string } | { guestId: string }) {
  const where = "userId" in identifier
    ? { userId: identifier.userId }
    : { guestId: identifier.guestId };

  return prisma.cart.findFirst({
    where,
    include: cartInclude,
  });
}

export async function removeFromCart(cartItemId: string) {
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!existingItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return prisma.cart.findUnique({
    where: { id: existingItem.cartId },
    include: cartInclude,
  });
}


export async function mergeGuestCart(userId: string, guestId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { guestId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) {
      await prisma.cart.delete({ where: { id: guestCart.id } });
    }
    return;
  }

  await prisma.$transaction(async (tx) => {
    let userCart = await tx.cart.findUnique({ where: { userId } });

    if (!userCart) {
      userCart = await tx.cart.create({ data: { userId } });
    }

    for (const guestItem of guestCart.items) {
      const existingUserItem = await tx.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
          },
        },
      });

      if (existingUserItem) {
        await tx.cartItem.update({
          where: { id: existingUserItem.id },
          data: { quantity: existingUserItem.quantity + guestItem.quantity },
        });
      } else {
        await tx.cartItem.update({
          where: { id: guestItem.id },
          data: { cartId: userCart.id },
        });
      }
    }

    await tx.cart.delete({ where: { id: guestCart.id } });
  });
}