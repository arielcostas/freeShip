import OtherProjectCard from "./OtherProjectCard";

export default function OtherProjectsList({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-center text-gray-500">No public projects available.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <OtherProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
