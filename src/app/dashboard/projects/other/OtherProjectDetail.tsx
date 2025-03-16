import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/app/(site)/Navbar";
import Link from "next/link";

export default async function OtherProjectDetail({
  projectId,
}: {
  projectId: string;
}) {
  const supabase = createClient();

  // Obtener el proyecto
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    return <p className="text-red-500">Project not found</p>;
  }

  // Obtener el usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verificar si el usuario ha aplicado a este proyecto
  let applicationStatus = null;
  let isMember = false;

  if (user) {
    // Comprobar si el usuario ya ha aplicado
    const { data: application } = await supabase
      .from("project_applications")
      .select("status")
      .eq("project_id", projectId)
      .eq("applicant_id", user.id)
      .single();

    if (application) {
      applicationStatus = application.status;
    }

    // Verificar si el usuario es miembro del equipo desde `team_members`
    if (project.team_members && Array.isArray(project.team_members)) {
      isMember = project.team_members.includes(user.id);
    }
  }

  const authorName = project.author_name || "Desconocido";

  const handleSignOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Navbar ocupa todo el ancho */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-grow flex-col p-6 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col flex-grow">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>
          <p className="mt-2">
            <strong>Por </strong> {authorName}
          </p>
          {project.type && (
            <p className="mt-2">
              <strong>Categoría:</strong> {project.type}
            </p>
          )}
          {project.tech_stack && (
            <p className="mt-2">
              <strong>Stack tecnológico:</strong>{" "}
              {project.tech_stack.join(", ")}
            </p>
          )}

          {/* Mostrar el repositorio de GitHub solo si el usuario es miembro */}
          {isMember && project.github_repository && (
            <p className="mt-2">
              <strong>Repositorio de GitHub:</strong>{" "}
              <a
                href={project.github_repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5865f2] underline"
              >
                {project.github_repository}
              </a>
            </p>
          )}

          {/* Sección de Aplicación */}
          <div className="mt-6">
            {user ? (
              applicationStatus ? (
                <p
                  className={
                    applicationStatus === "PENDING"
                      ? "text-[#4752C4] font-semibold"
                      : applicationStatus === "ACCEPTED"
                        ? "text-[#88b000] font-semibold"
                        : "text-red-600 font-semibold"
                  }
                >
                  {applicationStatus === "PENDING"
                    ? "Tu solicitud está pendiente... ¡Crucemos los dedos!"
                    : applicationStatus === "ACCEPTED"
                      ? "Tu solicitud ha sido aceptada. ¡Enhorabuena!"
                      : "Tu solicitud ha sido rechazada. ¡Ellos se lo pierden!"}
                </p>
              ) : (
                <Link
                  href={`/dashboard/projects/other/application?projectId=${project.id}`}
                  className="custom-btn"
                >
                  Aplicar
                </Link>
              )
            ) : (
              <p className="text-gray-500">Inicia sesión para aplicar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
