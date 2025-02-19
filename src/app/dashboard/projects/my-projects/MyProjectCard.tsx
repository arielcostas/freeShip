import Link from "next/link";

export default function MyProjectCard({ project }: { project: any }) {
  return (
    <li className="border p-3 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition">
      <Link href={`/dashboard/projects/my-projects/${project.id}`} className="block">
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
  );
}
