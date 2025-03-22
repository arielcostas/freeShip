import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/app/(site)/Navbar";
import { Suspense } from "react";
import { DashboardTabsContent } from "./DashboardTabsContent";
import Link from "next/link";
import Spinner from "../../components/ui/spinner";
import { Star } from "lucide-react";

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
  const params = await searchParams;
  const activeTab = params?.tab || "misProyectos";
  const randomColor = Math.random() < 0.5 ? "#5865F2" : "#acd916";

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
    <div className="flex flex-col h-screen bg-white">
      <Navbar handleSignOut={handleSignOut} className="bg-white shadow-md" />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-grow w-full mt-20 bg-white shadow-md rounded-lg">
        {/* Tabs */}
        <div className="flex border-b items-center">
          <Link
            href="?tab=misProyectos"
            className={`flex-1 py-2 text-center font-bold transition-colors ${
              activeTab === "misProyectos"
                ? "border-b-2 border-[#acd916] text-gray-600"
                : activeTab === "hall"
                  ? "text-gray-600"
                  : "text-gray-600"
            }`}
          >
            Mis proyectos
          </Link>

          {/* Tab central con estrella */}
          <Link
            href="?tab=hall"
            className="w-1/4 flex justify-center items-center"
          >
            <Star
              className={`${activeTab === "hall" ? `text-[${randomColor}]` : "text-gray-400"}`}
              size={36}
            />
          </Link>

          <Link
            href="?tab=comunidad"
            className={`flex-1 py-2 text-center font-bold transition-colors ${
              activeTab === "comunidad"
                ? "border-b-2 border-[#5865F2] text-gray-600"
                : activeTab === "hall"
                  ? "text-gray-600"
                  : "text-gray-600"
            }`}
          >
            Proyectos de la comunidad
          </Link>
        </div>

        {/* Contenido con Suspense, usando Spinner como fallback */}
        <Suspense fallback={<Spinner />}>
          <DashboardTabsContent activeTab={activeTab} userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
