"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  handleSignOut: () => void;
}

export default function Navbar({ handleSignOut }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#212121]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-5">
            <svg
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="w-[50px] h-[50px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#077b04"
                  d="M30.47 104.24h13.39v13.39H30.47z"
                ></path>
                <path
                  fill="#077b04"
                  d="M84.04 104.24h13.39v13.39H84.04z"
                ></path>
                <path fill="#21c60f" d="M30.48 10.51h13.39V23.9H30.48z"></path>
                <path fill="#21c60f" d="M84.04 10.51h13.39V23.9H84.04z"></path>
                <radialGradient
                  id="IconifyId17ecdb2904d178eab5528"
                  cx="64.344"
                  cy="9.403"
                  r="83.056"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".508" stopColor="#21c60f"></stop>
                  <stop offset=".684" stopColor="#279a16"></stop>
                  <stop offset=".878" stopColor="#1f8f22"></stop>
                  <stop offset=".981" stopColor="#077b04"></stop>
                </radialGradient>
                <path
                  d="M97.46 64.08V37.3H84.04V23.9H70.65v13.4H57.26V23.9H43.87v13.4H30.48v26.78H17.09v13.39h13.39v13.4h13.39v13.38h13.39V90.87h13.39v13.38h13.39V90.87h13.42v-13.4h13.37V64.08H97.46zm-40.21 0H43.86V50.69h13.39v13.39zm26.78 0H70.64V50.69h13.39v13.39z"
                  fill="url(#IconifyId17ecdb2904d178eab5528)"
                ></path>
                <radialGradient
                  id="IconifyId17ecdb2904d178eab5529"
                  cx="63.118"
                  cy="24.114"
                  r="65.281"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".508" stopColor="#21c60f"></stop>
                  <stop offset=".684" stopColor="#279a16"></stop>
                  <stop offset=".878" stopColor="#1f8f22"></stop>
                  <stop offset=".981" stopColor="#077b04"></stop>
                </radialGradient>
                <path
                  fill="url(#IconifyId17ecdb2904d178eab5529)"
                  d="M110.82 37.29h13.4v26.8h-13.4z"
                ></path>
                <radialGradient
                  id="IconifyId17ecdb2904d178eab5530"
                  cx="62.811"
                  cy="13.081"
                  r="75.09"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".508" stopColor="#21c60f"></stop>
                  <stop offset=".684" stopColor="#279a16"></stop>
                  <stop offset=".878" stopColor="#1f8f22"></stop>
                  <stop offset=".981" stopColor="#077b04"></stop>
                </radialGradient>
                <path
                  fill="url(#IconifyId17ecdb2904d178eab5530)"
                  d="M3.7 37.28h13.4v26.8H3.7z"
                ></path>
              </g>
            </svg>
            <span className="text-lg font-semibold text-white">
              bugoverflow
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <form action={handleSignOut}>
            <Button type="submit">Sign Out</Button>
          </form>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white"
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {[
              { href: "/dashboard?tab=misProyectos", label: "Tus proyectos" },
              {
                href: "/dashboard?tab=comunidad",
                label: "Proyectos de la comunidad",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}

            {/* Sign Out button */}
            <div className="rounded-md px-3 py-2">
              <form action={handleSignOut}>
                <Button type="submit" className="w-full">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
