"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/app/(site)/Navbar";
interface ProfileData {
  username: string;
  discord_username: string;
  email: string;
}

// Componente Spinner sencillo
function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <svg
        className="animate-spin h-8 w-8 text-[#acd916]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>
  );
}

export default function MyProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    discord_username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // Obtenemos el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No hay usuario logueado");
        setLoading(false);
        return;
      }

      // Se extrae el email de la sesión
      const email = user.email;

      // Consultamos la tabla profiles para obtener username y discord_username
      const { data, error } = await supabase
        .from("profiles")
        .select("username, discord_username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error al obtener el perfil:", error);
      } else if (data) {
        setProfile({
          username: data.username,
          discord_username: data.discord_username || "",
          email,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar handleSignOut={() => { /* Implementa la función de sign out */ }} />
      <div className="p-4 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">Mis Datos de Perfil</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            readOnly
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Discord Username
          </label>
          <input
            type="text"
            value={profile.discord_username}
            readOnly
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={profile.email}
            readOnly
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>
    </>
  );
}
