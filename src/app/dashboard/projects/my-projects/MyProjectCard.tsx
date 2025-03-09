import Link from "next/link";

export default function MyProjectCard({
  project,
  pendingApplications,
}: {
  project: any;
  pendingApplications: number;
}) {
  return (
    <li className="relative w-4/5 mx-auto border border-gray-200 p-6 rounded-2xl shadow-lg bg-white transition-transform transform hover:scale-[1.03] hover:shadow-xl">
      <Link
        href={`/dashboard/projects/my-projects/${project.id}`}
        className="block space-y-3"
      >
        <h3 className="text-lg font-bold text-[#88b000] tracking-wide">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        {project.type && (
          <p className="text-xs text-gray-500">
            <strong className="text-gray-700">Categoría:</strong> {project.type}
          </p>
        )}
        {project.tech_stack && (
          <p className="text-xs text-gray-500">
            <strong className="text-gray-700">Stack tecnológico:</strong>{" "}
            {project.tech_stack.join(", ")}
          </p>
        )}
      </Link>
      {pendingApplications > 0 && (
        <span className="absolute top-3 right-3 bg-red-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg ring-2 ring-white">
          {pendingApplications}
        </span>
      )}
    </li>
  );
}
