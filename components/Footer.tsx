"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { socialLinks, footerColumns } from "@/lib/constants"

const Footer = () => {
  useEffect(() => {
      const handleHashScroll = () => {
        const hash = window.location.hash;
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      };
  
      handleHashScroll();
  
  },[])
  return (
    <footer className="bg-dark-dark text-text-light z-1" id="contact">
      <div className="mx-auto max-w-[1700px] py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">

          <div className="flex items-start justify-center md:justify-start md:col-span-3">
            <h1 className="text-xl font-bold">CourtStyle</h1>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-9">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-heading-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-body text-light-400 hover:text-light-300"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="mb-4 text-heading-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((s) => (
                  <Link key={s.name} href={s.href} target="_blank">
                    <Image
                      src={s.icon}
                      alt={s.name}
                      width={22}
                      height={22}
                      className="hover:opacity-75 transition"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white max-w-[1700px] mt-15 pt-5">
          <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 px-4 py-4 text-light-400 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 text-caption">
              
              <span>Greece</span>
              <span>© 2025 CourtStyle, Inc. All Rights Reserved</span>
            </div>
            <ul className="flex items-center gap-6 text-caption">
              {[
                "Guides",
                "Terms of Sale",
                "Terms of Use",
                "CourtStyle Privacy Policy",
              ].map((t) => (
                <li key={t}>
                  <Link href="#">{t}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
