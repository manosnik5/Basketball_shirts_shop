"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/constants"

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {data: session} = useSession();

  const handleMenuButton = () => {
    if (!openUser) {
      setOpenMenu((e) => !e);
    }else{
      setOpenUser((e) => !e);
    }
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("User signed out");
          window.location.reload();
        },
        onError: (e) => {
          alert("Sign-out failed: " + e.error.message);
        }
      },
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenMenu(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  },[])

  return (
    <header className= {`fixed text-text-dark z-50 flex w-full flex-col ${scrolled && "bg-light"}`}>
     <nav className= "container mx-auto flex items-center justify-between px-4 sm:px-6 lsg:px-8 h-16">
       <Link href="/">
        <h1 className="text-xl font-bold">CourtStyle</h1>
       </Link>
       <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-body transition-colors hover:text-text-dark-muted">{link.label}</Link>
          </li>
        ))}
       </ul>

       <div className="flex items-center justify-center gap-6 p-1">
          <div className={`${(openMenu || openUser) && "hidden"} `}>
            <Link href="/cart">
                         <Image src="/shopping_cart_black.png" alt="NextRide" width={21} height={21} priority className="cursor-pointer"></Image>
                      </Link>
           
          </div>
          <button onClick={() => setOpenUser((e) => !e)} className={`p-1.5 relative cursor-pointer ${(openMenu || openUser) && "hidden"}`}>
             <Image src="/user_black.png" alt="NextRide" width={20} height={20} priority></Image>
             {session?.user && (
               <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full"></span>
             )}
          </button> 
        </div>
        <button
        type="button"
        className={`p-2 ${!openUser && "md:hidden"}`}
        onClick={handleMenuButton}>
          <Image src={(openMenu || openUser) ? "/close_black.png" : "/menu_black.png"} alt="NextRide" width={25} height={25} priority className="cursor-pointer pt-1"></Image>
        </button>
      </nav>

      {(openMenu && !openUser) && (
        <div id="mobile-menu" className={`md:hidden fixed top-16 w-full min-h-screen bg-light`}>
          <ul className="space-y-10 container mx-auto px-4 sm:px-6 py-10 ">
         {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body text-text-dark hover:text-text-dark-muted"
                  onClick={() => setOpenMenu(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))
          }    
          </ul>
        </div>
      )}

      {(!openMenu && openUser) && (
        <div id="user_menu" className={`fixed top-16 w-full bg-light min-h-screen`}>
          <div className="space-y-10 container mx-auto px-4 sm:px-6 py-10 flex flex-col items-start">
              
              {session?.user ? (
                <div className="flex flex-col gap-8">
                  {session?.user?.role === 'ADMIN' && (
                    <Button variant="default" className="cursor-pointer">
                      <Link href="/admin/dashboard">
                        Admin DashBoard
                      </Link>
                    </Button>
                  )}
                   <Button variant="destructive" className="cursor-pointer" onClick={handleSignOut}>Sign Out</Button>                
                </div>                    
               ) : (
                <div className="flex flex-col gap-8">
               <Link href="/auth/sign-in">
                <button>
                  Sign In
                </button>
              </Link>
              <Link href="/auth/sign-up">
                <button>
                  Sign Up
                </button>
              </Link>
              
              </div>
               )
              }
          </div>
        </div>
    )}
</header>
  )
}

export default Navbar