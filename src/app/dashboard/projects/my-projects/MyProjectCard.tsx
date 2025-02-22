import Link from "next/link";

export default function MyProjectCard({
  project,
  pendingApplications,
}: {
  project: any;
  pendingApplications: number;
}) {
  return (
    <li className="relative border p-3 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition">
      <Link
        href={`/dashboard/projects/my-projects/${project.id}`}
        className="block"
      >
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
      {pendingApplications > 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {pendingApplications}
        </span>
      )}
    </li>
  );
}
