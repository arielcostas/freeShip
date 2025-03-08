"use client";

import Link from "next/link";
import { X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  handleSignOut: () => void;
}

export default function Navbar({ handleSignOut }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, []);

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
                  fill="#acd916"
                  d="M30.47 104.24h13.39v13.39H30.47z"
                ></path>
                <path
                  fill="#acd916"
                  d="M84.04 104.24h13.39v13.39H84.04z"
                ></path>
                <path fill="#acd916" d="M30.48 10.51h13.39V23.9H30.48z"></path>
                <path fill="#acd916" d="M84.04 10.51h13.39V23.9H84.04z"></path>
                <path
                  fill="#acd916"
                  d="M97.46 64.08V37.3H84.04V23.9H70.65v13.4H57.26V23.9H43.87v13.4H30.48v26.78H17.09v13.39h13.39v13.4h13.39v13.38h13.39V90.87h13.39v13.38h13.39V90.87h13.42v-13.4h13.37V64.08H97.46zm-40.21 0H43.86V50.69h13.39v13.39zm26.78 0H70.64V50.69h13.39v13.39z"
                ></path>
                <path fill="#acd916" d="M110.82 37.29h13.4v26.8h-13.4z"></path>
                <path fill="#acd916" d="M3.7 37.28h13.4v26.8H3.7z"></path>
              </g>
            </svg>
            <span className="text-lg font-semibold text-white">
              bugoverflow
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Nombre de usuario con icono en el lado derecho */}
          {username && (
            <div className="flex items-center text-[#acd916] font-medium">
              <User className="h-5 w-5 mr-2" />
              <span>{username}</span>
            </div>
          )}

          <Button
            onClick={handleSignOut}
            className="bg-transparent text-[#acd916] font-bold hover:bg-transparent hover:underline"
          >
            Sign Out
          </Button>

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
