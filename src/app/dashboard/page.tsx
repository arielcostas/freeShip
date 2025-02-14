import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import MyProjectsDashboardView from "@/components/dashboard/MyProjectsDashboardView";
import ExploreProjectsDashboardView from "@/components/dashboard/ExploreProjectsDashboardView";

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
    redirect("/auth/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header fijo */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">pickall</h1>
        <form action={handleSignOut}>
          <Button type="submit">Sign Out</Button>
        </form>
      </div>

      {/* Contenido principal que ocupa el 100% restante */}
      <div className="flex flex-row gap-6 flex-grow overflow-hidden p-6">
        {/* Sección: Mis Proyectos */}
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <MyProjectsDashboardView userId={user.id} />
        </div>

        {/* Sección: Explorar Proyectos */}
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <ExploreProjectsDashboardView />
        </div>
      </div>
    </div>
  );
}
