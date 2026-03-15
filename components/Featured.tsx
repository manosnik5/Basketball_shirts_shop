"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion"
import { useRef } from "react"


const Slider = dynamic(() => import("react-slick"), { ssr: false });


type FeaturedItem = {
  id: string;
  name: string;
  slug?: string;
  mainImage?: string | null; 
  logoUrl?: string | null;     
  description?: string | null; 
  price?: number | null;       
};

interface FeaturedProps {
  items: FeaturedItem[];
  type: "shirt" | "team";
}

const Featured = ({ items, type }: FeaturedProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const desktopSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  const mobileSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: 2,
  };

   const handleItemClick = (item: FeaturedItem) => {
    if (type === "team") {
      const teamSlug = item.slug || item.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/shirts?team=${teamSlug}`);
    } else {
      router.push(`/shirts/${item.id}`);
    }
  };

  const settings = isMobile ? mobileSettings : desktopSettings;

  return (
    <div className="bg-light-light">
      <motion.div ref={ref}
      initial={{ opacity: 0, y: 58 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: "easeOut",

      }} className="container mx-auto flex flex-col pb-12 px-8 sm:px-10 lg:px-8 ">
        <Slider className="p-0" key={isMobile ? "mobile" : "desktop"} {...settings}>
          {items.map((item) => (
            <div key={item.id} className="p-1">
              <Card className="max-w-sm overflow-hidden shadow-lg rounded-lg cursor-pointer"
              onClick={() => handleItemClick(item)}>
                <CardContent className="min-h-[30vh] xl:min-h-[32vh] space-y-5 md:space-y-0 xl:space-y-5">
                  <div className="relative w-full h-30 sm:h-50  rounded-lg overflow-hidden ">
                    <Image
                      src={`/${type === "shirt" ? (item.mainImage ?? "placeholder.png") : (item.logoUrl ?? "placeholder.png")}`}
                      alt={item.name}
                      fill
                      className="object-contain hover:scale-105 max-h-25 max-w-25 sm:max-h-45 sm:max-w-45 transition-transform duration-300 ease-in-out self-center mx-auto"
                      
                    />
                  </div>
                  {type === "team" && (
                    <div className="flex">
                      <h1 className="font-semibold text-lg mx-auto">{item.name}</h1>
                    </div>
                  )}
                  {type === "shirt" && (
                    <>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                      <div className="text-text-dark font-medium text-lg">
                      {item.price != null ? `$${item.price}` : "N/A"}
                    </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </motion.div>
    </div>
  );
};

export default Featured;
