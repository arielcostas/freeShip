import Link from "next/link";

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
    <li
      className="relative w-full sm:w-4/5 mx-auto border p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-[1.01]"
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
        <h3
          className="text-lg font-bold tracking-wide"
          style={{ color: "var(--accent-text)" }}
        >
          {project.title}
        </h3>

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
      </Link>
      {/* Indicador de solicitudes pendientes */}
      {pendingApplications > 0 && (
        <span className="absolute top-3 right-3 bg-red-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg ring-2 ring-white">
          {pendingApplications}
        </span>
      )}
    </li>
  );
}
