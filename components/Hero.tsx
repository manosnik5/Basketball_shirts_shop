"use client"

import FadeContent from "./ui/FadeContent"
import Image from "next/image"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleShopNowClick = () => {
    router.push(`/shirts`);
  }
  
  return (
    <div className='bg-[url("/hero2.jpg")] bg-cover bg-center bg-no-repeat'>
     <div className='mx-auto flex flex-col container pt-30  pb-12 px-4 sm:px-6 lg:px-8 xl:pt-20 min-h-screen'>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ">
        <motion.div className='flex flex-col justify-center space-y-6 text-light-100' 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}>
          
            <h1 className='text-heading-2 lg:text-heading-1 '>From the Court to the Streets.</h1>
            <h1 className="text-xl">Basketball-inspired shirts that bring game-day energy to your everyday look.</h1>
            <button className='w-full md:w-fit bg-dark-dark hover:bg-dark-muted text-text-light px-6 py-3 rounded-md cursor-pointer text-body' onClick={() => handleShopNowClick()}>Show Now</button>

          
        </motion.div>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <div className='flex items-center justify-center'>
           <Image src="/curry2.png" alt="NextRide_car" width={500} height={500} className="w-fit h-fit"></Image>
          </div>
        </FadeContent>

        </div>
        

    </div>
    </div>

   
    
  )
}

export default Hero