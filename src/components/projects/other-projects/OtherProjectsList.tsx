import Link from "next/link";

export default function OtherProjectsList({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-center text-gray-500">No public projects available.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="border p-3 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
        >
          <Link href={`/dashboard/projects/${project.id}`} className="block">
            <strong className="text-gray-600">
              Por {project.author_name || "Desconocido"}
            </strong>
            <h3 className="font-semibold text-blue-600 hover:underline">
              {project.title}
            </h3>
            <p className="text-sm text-gray-700">{project.description}</p>
            {project.type && (
              <p className="text-xs text-gray-500 mt-1">
                <strong>Categoría:</strong> {project.type}
              </p>
            )}
            {project.tech_stack && (
              <p className="text-xs text-gray-500">
                <strong>Stack tecnológico:</strong> {project.tech_stack.join(", ")}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
