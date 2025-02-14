import { createClient } from "@/lib/supabase/server";
import CreateProjectForm from "@/components/projects/my-projects/CreateProjectForm";
import MyProjectsList from "@/components/projects/my-projects/MyProjectsList";

export default async function MyProjectsDashboardView({ userId }: { userId: string }) {
  const supabase = createClient();
  // Nota: usamos "author_id" según la tabla creada.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("author_id", userId);

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Projects</h2>

      {/* Formulario para crear un nuevo proyecto */}
      <CreateProjectForm userId={userId} />
      {/* Lista de mis proyectos */}
      <MyProjectsList userId={userId} />
    </div>
  );
}
