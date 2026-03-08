'use client';

import { useState } from "react";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import AddToCartButton from "@/components/AddToCartButton";import { getShirt } from "@/lib/actions/shirt";

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return undefined;
  return `$${price.toFixed(2)}`;
}
 
type ShirtWithDetails = NonNullable<Awaited<ReturnType<typeof getShirt>>>;

interface ShirtDetailProps {
  shirt: ShirtWithDetails;
  defaultVariant: ShirtWithDetails["variants"][0];
}

const ShirtDetail = ({ shirt, defaultVariant }: ShirtDetailProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);

    const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
    const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;
  
    const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;
  
    const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;
  
    const discount =
      compareAt && displayPrice && compareAt > displayPrice
        ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
        : null;

  return (
    
    <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
            <h1 className="text-heading-3 text-dark-900">{shirt.name}</h1>
            {shirt.description && <p className="text-body text-dark-700">{shirt.description}</p>}
          </header>
          <div className="flex items-center gap-3">
            <p className="text-lead text-dark-900">{formatPrice(displayPrice)}</p>
            {compareAt && (
              <>
                <span className="text-body text-dark-700 line-through">{formatPrice(compareAt)}</span>
                {discount !== null && (
                  <span className="rounded-full border border-light-300 px-2 py-1 text-caption text-[--color-green]">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>
      <SizePicker
        sizes={shirt.variants.map(v => v.size)}
        selectedSize={shirt.variants.find(v => v.id === selectedVariantId)?.size || null}
        onSelectSize={(size) => {
          const variant = shirt.variants.find(v => v.size === size);
          if (variant) setSelectedVariantId(variant.id);
        }}
      />


    <div className="grid grid-cols-[100px_1fr] gap-3">
        <div>
            <input
                id="qty"
                type="number"
                min="1"
                max="100"
                step="1"
                defaultValue={1}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="
                py-3 px-3
                border border-muted-foreground
                transition
                hover:border-blue-500
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-300
                focus:outline-none
                "
            />
        </div> 
        <AddToCartButton
          teamLogoUrl={shirt.team?.logoUrl ?? null}
          shirtName={shirt.name}
          variantId={selectedVariantId}
          quantity={quantity}
        />
    </div>

     

      <CollapsibleSection title="Shipping" defaultOpen={false}>
            <p>Free standard shipping and free 30-day returns for Nike Members.</p>
          </CollapsibleSection>
          <CollapsibleSection title="Description" defaultOpen={false}>
            <p>{shirt.description}</p>
          </CollapsibleSection>
    </div>
  );
};

export default ShirtDetail;
