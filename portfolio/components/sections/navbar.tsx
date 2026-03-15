'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS, SOCIALS } from "@/data";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-[65px] fixed top-0 bg-[#030014]/80 backdrop-blur-xl z-50 px-10">

      {/* Animated cosmic border at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-navbar-pulse" />
      </div>

      {/* Subtle glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />

      {/* Navbar Container */}
      <div className="relative w-full h-full flex items-center justify-between m-auto px-[10px]">

        {/* Logo + Name */}
        <Link href="/" className="group flex items-center">
          <Image
            src="/images/branding/logo.png"
            alt="Logo"
            width={70}
            height={70}
            draggable={false}
            className="cursor-pointer transition-transform duration-300 group-hover:scale-110"
          />
          <div className="hidden md:flex md:selffont-bold ml-[10px] bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-300 group-hover:to-blue-300">Victor Antunes</div>
        </Link>

        {/* Web Navbar */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-purple-500/20 bg-white/[0.03] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200 shadow-[0_0_15px_rgba(112,66,248,0.08)]">
            {NAV_LINKS.map((link) => {
              const isExternal = link.link.startsWith("http");
              return (
                <Link
                  key={link.title}
                  href={link.link}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className="relative cursor-pointer transition-colors duration-300 hover:text-purple-300 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.title}
                </Link>
              );
            })}

          </div>
        </div>

        {/* Social Icons (Web) */}
        <div className="hidden md:flex flex-row gap-5">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
            >
              <Icon className="h-6 w-6 text-white/80 transition-all duration-300 hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] hover:scale-110" />
            </Link>
          ))}
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden inline-flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-purple-500/20 bg-white/5 text-white shadow-sm shadow-black/30 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-400/40 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
        </button>
      </div>

      {/* Hamburger Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#0b0616] p-6 flex flex-col items-center text-gray-200 shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:hidden overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          </div>

          {/* Links */}
          <div className="relative flex w-full flex-col items-center gap-4">
            {NAV_LINKS.map((link) => {
              const isExternal = link.link.startsWith("http");
              return (
                <Link
                  key={link.title}
                  href={link.link}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-6 py-3 text-center text-base font-medium transition hover:border-purple-400/40 hover:text-purple-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Social Icons */}
          <div className="relative mt-6 flex justify-center gap-5 rounded-full border border-white/5 bg-white/5 px-6 py-3">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                key={name}
              >
                <Icon className="h-6 w-6 text-white/90" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
