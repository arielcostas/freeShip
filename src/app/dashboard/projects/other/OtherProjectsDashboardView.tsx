import { createClient } from "@/lib/supabase/server";
import OtherProjectsList from "@/app/dashboard/projects/other/OtherProjectsList";

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
        //aquí añadir un filtro para buscar proyectos por categoría o stack tecnológico
      </div>

      <div className="h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
        <OtherProjectsList projects={projects} />
      </div>
    </div>
  );
}
