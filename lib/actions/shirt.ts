import { prisma } from "@/lib/prisma";
import { CreateShirtInput } from "../types";
import { FilterParams } from "../types";
import { SIZES, TEAM_SLUGS, BRAND_SLUGS, LEAGUE_SLUGS, POSITION_SLUG, IMAGE_VARIANTS } from "../constants";
import { toSlug } from "../utils";
import { Shirt } from "../types";
import { headers } from "next/headers";
import {auth} from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";

export async function getAllShirts(filters: FilterParams) {
  const {
    search,
    sizeSlugs,
    brandSlugs,
    leagueSlugs,
    teamSlugs,
    priceMin,
    priceMax,
    priceRanges,
    sort = "newest",
    page = 1,
    limit = 24,
  } = filters;

  const where: Prisma.ShirtWhereInput = { isPublished: true };

  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { team: { name: { contains: search, mode: 'insensitive' } } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
      { league: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (brandSlugs?.length) where.brand = { slug: { in: brandSlugs } };
  if (leagueSlugs?.length) where.league = { slug: { in: leagueSlugs } };
  if (teamSlugs?.length) where.team = { slug: { in: teamSlugs } };

  if (sizeSlugs?.length) {
    where.variants = {
      some: { size: { slug: { in: sizeSlugs } } },
    };
  }

  const orPriceConditions: Prisma.ShirtWhereInput[] = [];

  if (priceRanges?.length) {
    for (const [min, max] of priceRanges) {
      const priceFilter: Prisma.DecimalFilter = {};
      if (min !== undefined) priceFilter.gte = min;
      if (max !== undefined) priceFilter.lte = max;

      orPriceConditions.push({
        variants: { some: { price: priceFilter } },
      });
    }
  } else if (priceMin !== undefined || priceMax !== undefined) {
    const priceFilter: Prisma.DecimalFilter<"ShirtVariant"> = {};
    if (priceMin !== undefined) priceFilter.gte = priceMin;
    if (priceMax !== undefined) priceFilter.lte = priceMax;

    where.variants = {
      some: { price: priceFilter },
    };
  }

  if (orPriceConditions.length) {
    where.OR = [...(where.OR ?? []), ...orPriceConditions];
  }


  let orderBy: Prisma.ShirtOrderByWithRelationInput = { createdAt: 'desc' };

  if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' };
  } 

  const totalCount = await prisma.shirt.count({ where });

  if (sort === "price_asc" || sort === "price_desc" || sort === "featured") {
    const allShirts = await prisma.shirt.findMany({
      where,
      include: {
        brand: true,
        league: true,
        team: true,
        variants: {
          include: {
            size: true,
            images: true,
            orderItems: {
              include: {
                order: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        },
        images: true,
      },
    });

    const formattedShirts = allShirts.map((shirt) => {
      const prices = shirt.variants.map((v) => Number(v.salePrice ?? v.price));
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;

      const mainImage =
        shirt.images.find((img) => img.isPrimary)?.url ??
        shirt.images[0]?.url ??
        null;

      const totalSales = shirt.variants.reduce((sum, variant) => {
        const soldQuantity = variant.orderItems
          .filter((orderItem) => 
            orderItem.order.status === 'PAID' || 
            orderItem.order.status === 'SHIPPED' || 
            orderItem.order.status === 'DELIVERED'
          )
          .reduce((itemSum, orderItem) => itemSum + orderItem.quantity, 0);
        return sum + soldQuantity;
      }, 0);

      return {
        id: shirt.id,
        name: shirt.name,
        description: shirt.description,
        minPrice,
        maxPrice,
        mainImage,
        createdAt: shirt.createdAt,
        totalSales,
      };
    });


    if (sort === "price_asc") {
      formattedShirts.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sort === "price_desc") {
      formattedShirts.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sort === "featured") {
      formattedShirts.sort((a, b) => {
        if (b.totalSales !== a.totalSales) {
          return b.totalSales - a.totalSales;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }

    const paginatedShirts = formattedShirts.slice(
      (page - 1) * limit,
      page * limit
    );

    return {
      shirts: paginatedShirts,
      totalCount,
    };
  }

  const shirts = await prisma.shirt.findMany({
    where,
    include: {
      brand: true,
      league: true,
      team: true,
      variants: {
        include: {
          size: true,
          images: true,
        },
      },
      images: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const formattedShirts = shirts.map((shirt) => {
    const prices = shirt.variants.map((v) => Number(v.salePrice ?? v.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    const mainImage =
      shirt.images.find((img) => img.isPrimary)?.url ??
      shirt.images[0]?.url ??
      null;

    return {
      id: shirt.id,
      name: shirt.name,
      description: shirt.description,
      minPrice,
      maxPrice,
      mainImage,
      createdAt: shirt.createdAt,
    };
  });

  return {
    shirts: formattedShirts,
    totalCount,
  };
}

export const getFeaturedShirts = async (shirtId: string) => {
  const currentShirt = await prisma.shirt.findUnique({
    where: { id: shirtId },
    select: {
      id: true,
      team: true,
    },
  })

  if (!currentShirt) return [];

  const featuredShirts = await prisma.shirt.findMany({
    where: {
      team: currentShirt.team,
      id: { not: currentShirt.id },
    },
    include: {
      brand: true,
      league: true,
      team: true,
      player: true,
      variants: {
        include: {
          size: true,
          images: true,
        },
      },
      images: true,
    },
  })

  return featuredShirts.map((shirt) => {

    const prices = shirt.variants.map(v =>
      Number(v.salePrice ?? v.price)
    );

    const minPrice = prices.length ? Math.min(...prices) : null;

    const defaultVariant = shirt.defaultVariantId
      ? shirt.variants.find(v => v.id === shirt.defaultVariantId)
      : null;

    const displayPrice =
      defaultVariant
        ? Number(defaultVariant.salePrice ?? defaultVariant.price)
        : minPrice;


    const primaryImage =
      shirt.images.find((img) => img.isPrimary)?.url ??
      shirt.images[0]?.url ??
      null;

    const sortedImages = shirt.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        url: img.url,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      }));

      


    return {
    id: shirt.id,
    name: shirt.name,
    description: shirt.description,
    brand: shirt.brand,
    league: shirt.league,
    team: shirt.team,
    player: shirt.player,
    mainImage: primaryImage,
    images: sortedImages,
    price: displayPrice,
  };
  });

}

export const getShirt = async (id: string) => {
  const shirt = await prisma.shirt.findUnique({
    where: { id },
    include: {
      brand: true,
      league: true,
      team: true,
      player: true,
      variants: {
        include: {
          size: true,
          images: true,
        },
      },
      images: true,
    },
  });

  if (!shirt) return null;

  const primaryImage =
    shirt.images.find((img) => img.isPrimary)?.url ??
    shirt.images[0]?.url ??
    null;

  const sortedImages = shirt.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    }));

  return {
    id: shirt.id,
    name: shirt.name,
    description: shirt.description,
    brand: shirt.brand,
    league: shirt.league,
    team: shirt.team,
    player: shirt.player,
    mainImage: primaryImage,
    images: sortedImages,
    variants: shirt.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      size: v.size.name,
      imageUrl: v.images[0]?.url ?? null,
      inStock: v.inStock,
    })),
  };
};

export async function createShirt(data: CreateShirtInput) {
  const {
    playerName,
    positionName,
    jerseyNumber,
    name,
    description,
    brandName,
    leagueName,
    teamName,
    basePrice,
    sku,
    imageUrls,
  } = data;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");



  const brandSlug = BRAND_SLUGS[brandName];
  const leagueSlug = LEAGUE_SLUGS[leagueName];
  const teamSlug = TEAM_SLUGS[teamName];
  const positionSlug = POSITION_SLUG[positionName];
  const playerSlug = toSlug(playerName);
  
  

  if (!brandSlug) throw new Error(`Brand "${brandName}" not found`);
  if (!leagueSlug) throw new Error(`League "${leagueName}" not found`);
  if (!teamSlug) throw new Error(`Team "${teamName}" not found`);
  if (!positionSlug) throw new Error(`Position "${positionName}" not found`);

  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  const league = await prisma.league.findUnique({ where: { slug: leagueSlug } });
  const team = await prisma.team.findUnique({ where: { slug: teamSlug } });
  const position = await prisma.position.findUnique({ where: { slug: positionSlug } });

  if (!brand) throw new Error(`Brand "${brandName}" not found`);
  if (!league) throw new Error(`League "${leagueName}" not found`);
  if (!team) throw new Error(`Team "${teamName}" not found`);
  if (!position) throw new Error(`Team "${positionName}" not found`);
  return prisma.$transaction(async (tx) => {
 

  let player = await tx.player.findUnique({ where: { slug: playerSlug } });
  if (!player) {
    player = await tx.player.create({
      data: {
        name: playerName,
        slug: playerSlug,
        teamId: team.id,
        positionId: position.id,
        number: jerseyNumber,
      },
    });
  }

    const shirt: Shirt = await tx.shirt.create({
      data: {
        name,
        description,
        brandId: brand.id,
        leagueId: league.id,
        teamId: team.id,
        playerId: player.id,
        isPublished: true,
      },
    });

    const sizes = await tx.size.findMany({
      where: { slug: { in: SIZES.map((s) => s.toLowerCase()) } },
    });

    const variants = await Promise.all(
      sizes.map((size) =>
        tx.shirtVariant.create({
          data: {
            shirtId: shirt.id,
            sku: `${sku}-${size.slug}`,
            price: basePrice,
            sizeId: size.id,
          },
        })
      )
    );


if (imageUrls.length) {
  await Promise.all(
    imageUrls.map(async (url, index) => {
      const variantName = IMAGE_VARIANTS[index] || `extra-${index + 1}`; 

      const path = `players/${leagueSlug}/${teamSlug}/${playerSlug}-${variantName}.avif`;

      await tx.shirtImage.create({
        data: {
          shirtId: shirt.id,
          url: path, 
          isPrimary: index === 0, 
          sortOrder: index + 1,  
        },
      });
    })
  );
}

    return { shirt, variants, player };
  });
}

export async function deleteShirt(shirtId: string){
  const headersList = await headers();

  const session = await auth.api.getSession({
      headers: headersList,
  });

  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");

  return prisma.$transaction(async (tx) => {
    const shirt = await tx.shirt.findUnique({
      where: {
        id: shirtId
      },
      include: {
        images: true,
        player: {
          include: {
            shirts: true
          },
        },
      },
    });
    if (!shirt) throw new Error("Shirt not found");

    await tx.shirtVariant.deleteMany({
      where: { shirtId },
    });

    await tx.shirtImage.deleteMany({
      where: { shirtId },
    });


    await tx.shirt.delete({
      where: { id: shirtId },
    });

   
    if (shirt.player && shirt.player.shirts.length === 1) {
      await tx.player.delete({
        where: { id: shirt.player.id },
      });
    }

    return { success: true };
  }
)

}