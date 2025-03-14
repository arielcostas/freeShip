import { createClient } from "@/lib/supabase/server";
import MyProjectCard from "./MyProjectCard";
import OtherProjectCard from "../other/OtherProjectCard";

export default async function MyProjectsList({ userId }: { userId: string }) {
  const supabase = createClient();

  // Obtener proyectos donde el usuario es el autor
  const { data: myProjects, error: myProjectsError } = await supabase
    .from("projects")
    .select("*, project_applications(count)")
    .eq("author_id", userId)
    .eq("project_applications.status", "PENDING");

  // Obtener proyectos donde el usuario es un miembro del equipo (pero no autor)
  const { data: joinedProjects, error: joinedProjectsError } = await supabase
    .from("projects")
    .select("*")
    .contains("team_members", [userId]) // Verifica si está en el array
    .neq("author_id", userId); // Asegura que no es el autor

  if (myProjectsError || joinedProjectsError) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return myProjects.length > 0 || joinedProjects.length > 0 ? (
    <ul className="space-y-2">
      {/* Renderizar los proyectos creados por el usuario */}
      {myProjects.map((project: any) => (
        <MyProjectCard
          key={project.id}
          project={project}
          pendingApplications={project.project_applications[0]?.count || 0}
        />
      ))}

      {/* Renderizar los proyectos en los que el usuario es miembro */}
      {joinedProjects.map((project: any) => (
        <OtherProjectCard key={project.id} project={project} />
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-500">
      Todavía no tienes proyectos. ¡Crea o únete a uno!
    </p>
  );
}
