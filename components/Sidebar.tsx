"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SidebarProps } from "@/types";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer items-center flex gap-2">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-auto" // Corrected class name syntax
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              <div className="relative w-6 h-6"> {/* Ensure parent has relative position and defined size */}
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({ 'brightness-[3] invert-0': isActive })}
                />
              </div>
              <p className={cn("sidebar-label", { '!text-white': isActive })}>{item.label}</p>
            </Link>
          );
        })}
      </nav>
      <Footer  user={user} type="desktop"/>
    </section>
  );
};

export default Sidebar;