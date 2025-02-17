import { createClient } from "@/lib/supabase/server";
import OtherProjectsList from "@/components/projects/other-projects/OtherProjectsList";

export default async function OtherProjectsDashboardView({
  userId,
}: {
  userId: string;
}) {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, description, type, tech_stack, author_name") // Incluir author_name
    .neq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-xl font-bold mx-auto">Proyectos de la comunidad</h2>
      </div>

      <div className="h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
        <OtherProjectsList projects={projects} />
      </div>
    </div>
  );
}
