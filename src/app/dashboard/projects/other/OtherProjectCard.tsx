import Link from "next/link";

export default function OtherProjectCard({ project }: { project: any }) {
  return (
    <li className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-blue-50 transition">
      <Link href={`/dashboard/projects/other/${project.id}`} className="block">
        {/* Fila 1: Título y Autor en línea */}
        <div className="flex items-center gap-x-2 mb-2">
          <h3 className="font-semibold text-blue-600">{project.title}</h3>
          <strong className="text-gray-600 text-sm">
            propuesto por {project.author_name || "Desconocido"}
          </strong>
        </div>

        {/* Fila 2: Grid con 2 columnas */}
        <div className="grid grid-cols-4 gap-4">
          {/* Columna 1: Categoría y Stack Tecnológico */}
          <div className="col-span-1 flex flex-col text-xs text-gray-500">
            {project.type && (
              <p className="mb-1">
                <strong>Categoría:</strong> {project.type}
              </p>
            )}
            {project.tech_stack && (
              <p>
                <strong>Stack:</strong> {project.tech_stack.join(", ")}
              </p>
            )}
          </div>

          {/* Columna 2: Descripción del Proyecto */}
          <div className="col-span-3 text-sm text-gray-700">
            {project.description}
          </div>
        </div>
      </Link>
    </li>
  );
}
