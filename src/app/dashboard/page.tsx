import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import MyProjectsDashboardView from "@/components/dashboard/MyProjectsDashboardView";
import ExploreProjectsDashboardView from "@/components/dashboard/ExploreProjectsDashboardView";
import Navbar from "@/app/(site)/Navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
  openGraph: {
    title: "Dashboard | My App",
    description: "Access your personal dashboard on My App",
  },
};

export default async function Dashboard() {
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
      {/* Navbar a pantalla completa (fuera del contenedor centrado) */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenido principal centrado con padding */}
      <div className="flex flex-row gap-12 flex-grow overflow-hidden p-24 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Sección: Mis Proyectos */}
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <MyProjectsDashboardView userId={user.id} />
        </div>

        {/* Sección: Explorar Proyectos */}
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <ExploreProjectsDashboardView userId={user.id} />
        </div>
      </div>
    </div>
  );
}
