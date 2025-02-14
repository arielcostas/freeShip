import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import MyProjectsDashboardView from "@/components/dashboard/MyProjectsDashboardView";
import ExploreProjectsDashboardView from "@/components/dashboard/ExploreProjectsDashboardView";

export default async function MyProjectDetail({
  projectId,
}: {
  projectId: string;
}) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  const handleSignOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  if (error || !project) {
    return <p className="text-red-500">Project not found</p>;
  }

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
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <p className="text-gray-700 mt-2">{project.description}</p>
        {project.type && (
          <p className="mt-2">
            <strong>Type:</strong> {project.type}
          </p>
        )}
        {project.tech_stack && (
          <p className="mt-2">
            <strong>Stack:</strong> {project.tech_stack.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
