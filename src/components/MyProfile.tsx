"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/app/(site)/Navbar";

interface ProfileData {
  username: string;
  discord_username: string;
  email: string;
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
    return <div>Cargando...</div>;
  }

  return (
    <>
      {/* Incluimos la Navbar, pasándole una función de sign out (puedes ajustar su implementación) */}
      <Navbar handleSignOut={() => { /* Implementa la función de sign out */ }} />

      {/* Contenido principal con margen superior para evitar superposición con la Navbar */}
      <div className="p-4 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>

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
