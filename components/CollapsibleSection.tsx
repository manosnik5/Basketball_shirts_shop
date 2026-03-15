"use client"

import { useState } from "react"
import Image from "next/image"

export interface CollapsibleSectionProps {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
    rightMeta?: React.ReactNode;
    className?: string; 
}

const CollapsibleSection = ({
    title,
    children,
    defaultOpen = false,
    className = ""
}: CollapsibleSectionProps) => {
    const [open, setOpen] = useState(defaultOpen);
    console.log(open)

  return (
    <div className={`${className} bg-light-light`}>
        <button aria-expanded={open} className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] cursor-pointer " onClick={() => {setOpen((o) => !o)}}>
           <span className="text-xl font-medium text-dark">{title}</span> 
           <Image src={(open) ? "/minusSymbol.png" : "/plusSymbol.png"} alt="symbol" width={12} height={12} priority></Image>
        </button>
        {open && (
        <div className="pt-3">
          {children ? 
            <div className="text-body text-dark">
              {children}
            </div> : null}
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection