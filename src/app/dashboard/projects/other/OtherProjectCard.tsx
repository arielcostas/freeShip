import Link from "next/link";

export default function OtherProjectCard({ project }: { project: any }) {
  return (
    <li className="relative w-full sm:w-4/5 mx-auto border border-gray-200 p-6 rounded-2xl shadow-lg bg-white transition-transform transform hover:scale-[1.01]">
      <Link
        href={`/dashboard/projects/other/${project.id}`}
        className="block space-y-3"
      >
        {/* Fila 1: Título y Autor en línea */}
        <div className="flex items-center gap-x-3 mb-2">
          <h3 className="text-lg font-bold text-[#4752C4] tracking-wide">
            {project.title}
          </h3>
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
                <strong className="text-gray-700">Categoría:</strong>{" "}
                {project.type}
              </p>
            )}
            {project.tech_stack && (
              <p>
                <strong className="text-gray-700">Stack:</strong>{" "}
                {project.tech_stack.join(", ")}
              </p>
            )}
          </div>

          {/* Columna 2: Descripción del Proyecto */}
          <div className="col-span-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
            {project.description}
          </div>
        </div>
      </Link>
    </li>
  );
}
