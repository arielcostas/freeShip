import Link from "next/link";
import { FaStar } from "react-icons/fa";

const CATEGORY_LABELS: Record<string, string> = {
  "WEB/DESKTOP": "Desarrollo web o escritorio",
  MOBILE: "Desarrollo móvil",
  EMBEDDED: "Código embebido",
  VIDEOGAME: "Videojuego",
  "BD/IA/ML": "Big Data | Inteligencia Artificial | Machine Learning",
  CYBERSECURITY: "Ciberseguridad",
  "SCRIPTING/SCRAPING": "Scripting",
};

export default function MyProjectCard({
  project,
  pendingApplications,
}: {
  project: any;
  pendingApplications: number;
}) {
  return (
    <article
      className="w-full sm:w-4/5 mx-auto border p-6 rounded-2xl shadow-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <Link
        href={`/dashboard/projects/my-projects/${project.id}`}
        className="block space-y-3"
      >
        {/* Fila 1: Título */}
        <h3 className="my-project-title">{project.title}</h3>

        {/* Fila 2: Descripción */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: "var(--text-primary)" }}
        >
          {project.description}
        </p>

        {/* Fila 3: Categoría y Stack Tecnológico */}
        <div className="grid grid-cols-4 gap-4">
          <div
            className="col-span-1 flex flex-col text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.type && (
              <p className="mb-1">
                <strong style={{ color: "var(--text-primary)" }}>
                  Categoría:
                </strong>{" "}
                {CATEGORY_LABELS[project.type] || "Otra"}
              </p>
            )}
            {project.tech_stack && (
              <p>
                <strong style={{ color: "var(--text-primary)" }}>Stack:</strong>{" "}
                {project.tech_stack.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Sección de estrellas estáticas para mostrar el número de estrellas recibidas por la comunidad */}
        {project.rating_count > 0 && (
          <div className="flex items-center mt-2">
            <FaStar size={20} className="text-[#acd916]" />
            <span className="ml-2 text-lg font-bold">
              {" "}
              {project.rating_count}
            </span>
          </div>
        )}
      </Link>
      {/* Indicador de solicitudes pendientes */}
      {pendingApplications > 0 && (
        <span className="bg-red-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg ring-2 ring-white">
          {pendingApplications}
        </span>
      )}
    </article>
  );
}
