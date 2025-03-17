"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Importa el cliente para el lado del cliente
import { useRouter } from "next/navigation";
import Navbar from "@/app/(site)/Navbar";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";

export default function OtherProjectDetail({
  projectId,
}: {
  projectId: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Obtener el proyecto
      const { data: proj, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError || !proj) {
        setErrorMsg("Project not found");
        setLoading(false);
        return;
      }
      setProject(proj);

      // Obtener el usuario autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (!userError && userData?.user) {
        setUser(userData.user);

        // Comprobar si el usuario ya ha aplicado
        const { data: application } = await supabase
          .from("project_applications")
          .select("status")
          .eq("project_id", projectId)
          .eq("applicant_id", userData.user.id)
          .single();

        if (application) {
          setApplicationStatus(application.status);
        }

        // Verificar si el usuario es miembro del equipo (si project.team_members es un array)
        if (proj.team_members && Array.isArray(proj.team_members)) {
          setIsMember(proj.team_members.includes(userData.user.id));
        }
      }

      setLoading(false);
    }
    fetchData();
  }, [projectId, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="#5865f2" />
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  const authorName = project.author_name || "Desconocido";

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
                      ? "text-[#4752C4] font-semibold !important"
                      : applicationStatus === "ACCEPTED"
                        ? "text-[#88b000] font-semibold"
                        : "text-red-600 font-semibold !important"
                  }
                >
                  {applicationStatus === "PENDING"
                    ? "Tu solicitud está pendiente... ¡Crucemos los dedos!"
                    : applicationStatus === "ACCEPTED"
                      ? ""
                      : "Tu solicitud ha sido rechazada. ¡Ellos se lo pierden!"}
                </p>
              ) : (
                <Link
                  href={`/dashboard/projects/other/application?projectId=${project.id}`}
                  className="other-custom-btn"
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
