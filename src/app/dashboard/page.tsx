import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/app/(site)/Navbar";
import { Suspense } from "react";
import { DashboardTabsContent } from "./DashboardTabsContent";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
  openGraph: {
    title: "Dashboard | My App",
    description: "Access your personal dashboard on My App",
  },
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  // Espera a que searchParams se resuelva
  const params = await searchParams;
  const activeTab = params?.tab === "comunidad" ? "comunidad" : "misProyectos";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const handleSignOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar a pantalla completa */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenedor principal con 85% de ancho y alto */}
      <div className="w-5/6 h-5/6 mx-auto flex flex-col mt-20 bg-white shadow-md rounded-lg p-6">
        {/* Tabs */}
        <div className="flex border-b">
          <Link
            href="?tab=misProyectos"
            className={`flex-1 py-2 text-center ${
              activeTab === "misProyectos"
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-600 font-bold"
            }`}
          >
            Mis proyectos
          </Link>
          <Link
            href="?tab=comunidad"
            className={`flex-1 py-2 text-center ${
              activeTab === "comunidad"
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-600 font-bold"
            }`}
          >
            Proyectos de la comunidad
          </Link>
        </div>

        {/* Contenido con Suspense */}
        <div className="flex-grow flex h-full w-full">
          <Suspense fallback={<p>Cargando...</p>}>
            <DashboardTabsContent activeTab={activeTab} userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
