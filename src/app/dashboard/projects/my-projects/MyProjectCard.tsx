import Link from "next/link";

export default function MyProjectCard({
  project,
  pendingApplications,
}: {
  project: any;
  pendingApplications: number;
}) {
  return (
    <li className="relative w-[75%] mx-auto border p-7 rounded-lg shadow-sm bg-gradient-to-r from-gray-50 via-gray-50 via-95% to-[#acd916] hover:from-gray-50 hover:via-gray-100 hover:to-[#acd916]">
      <Link
        href={`/dashboard/projects/my-projects/${project.id}`}
        className="block"
      >
        <h3 className="font-semibold text-[#88b000] hover:underline">
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
        <span className="absolute top-3 right-2 bg-red-500 text-white font-bold text-xs font-bold px-3.5 py-2 rounded-full">
          {pendingApplications}
        </span>
      )}
    </li>
  );
}
