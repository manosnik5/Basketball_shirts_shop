'use client';

import { useState, useEffect } from "react";

export interface SizePickerProps {
    className?: string;
    selectedSize?: string | null; 
    onSelectSize?: (size: string) => void; 
    sizes?: string[]; 
}

const SizePicker = ({
  className = "",
  selectedSize = null,
  onSelectSize,
  sizes = ["S", "M", "L", "XL"]
}: SizePickerProps) => {
    const [selected, setSelected] = useState<string | null>(selectedSize);

    useEffect(() => {
      setSelected(selectedSize);
    }, [selectedSize]);

    const handleSelect = (size: string) => {
        const newSize = selected === size ? null : size;
        setSelected(newSize);
        onSelectSize?.(newSize!);
    }

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-xl font-medium text-dark">Size</p>
                <button className="text-text-dark-muted underline-offset-2 underline hover:cursor-pointer">
                    Size Guide
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                    const isActive = selected === size;
                    return (
                        <button
                            key={size}
                            onClick={() => handleSelect(size)}
                            className={`rounded-sm border border-muted-foreground py-3 text-center text-body font-medium transition hover:cursor-pointer hover:bg-dark hover:text-text-light ${
                                isActive ? "border-dark-900 text-dark-900 bg-dark text-text-light" : ""
                            }`}
                            aria-pressed={isActive}
                        >
                            {size}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SizePicker;
