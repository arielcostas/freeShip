import OtherProjectCard from "./OtherProjectCard";

export default function OtherProjectsList({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-center">Ninguna coincidencia con los criterios de búsqueda</p>
    );
  }

  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <OtherProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
