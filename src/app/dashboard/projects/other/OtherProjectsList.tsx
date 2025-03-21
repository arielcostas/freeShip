import OtherProjectCard from "./OtherProjectCard";
import { useUser } from "@supabase/auth-helpers-react"; // Asegúrate de importar el hook correcto

export default function OtherProjectsList({ projects }: { projects: any[] }) {
  const user = useUser(); // Obtiene la información del usuario logueado

  if (!projects || projects.length === 0) {
    return (
      <p className="text-center">
        Ninguna coincidencia con los criterios de búsqueda
      </p>
    );
  }

  // Filtra proyectos en los que el usuario NO es miembro
  const filteredProjects = projects.filter(
    (project) => !project.team_members?.includes(user?.id)
  );

  if (filteredProjects.length === 0) {
    return <p className="text-center">No hay proyectos disponibles</p>;
  }

  return (
    <ul className="space-y-4">
      {filteredProjects.map((project) => (
        <OtherProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
