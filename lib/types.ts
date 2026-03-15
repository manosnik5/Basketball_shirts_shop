export interface ShirtVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
}

export interface Shirt {
  id: string;
  name: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  mainImage?: string;
}

export interface FeaturedItem {
  id: string;
  name: string;
  mainImage?: string; 
  logoUrl?: string;  
  description?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
};

export interface CreateShirtInput {
  playerName: string;
  positionName: string;
  jerseyNumber: number;
  name: string;
  description: string;
  brandName: string;
  leagueName: string;
  teamName: string;
  basePrice: number;
  sku: string;
  imageUrls: string[];
}

export interface FilterParams {
  search?: string;
  sizeSlugs?: string[];
  brandSlugs?: string[];
  leagueSlugs?: string[];
  teamSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges?: [number | undefined, number | undefined][];
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "featured";
  page?: number;
  limit?: number;
}

export type CartItem = {
  id: string;
  quantity: number;
  variant: {
    price: number;
    salePrice?: number | null;
    size: { name: string };
    shirt: {
      name: string;
      images: { url: string; isPrimary: boolean }[];
    };
  };
};