"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Asegúrate de usar el cliente para el lado del cliente
import { useRouter } from "next/navigation";
import ProjectActions from "@/app/dashboard/projects/other/ProjectActions";
import Navbar from "@/app/(site)/Navbar";
import ProjectApplicationsList from "@/app/dashboard/projects/my-projects/ProjectApplicationsList";
import Spinner from "@/components/ui/spinner";

export default function MyProjectDetail({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [authorName, setAuthorName] = useState("Desconocido");
  const [hasApplications, setHasApplications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Obtener el proyecto
      const { data: proj, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error || !proj) {
        setErrorMsg("Project not found");
        setLoading(false);
        return;
      }
      setProject(proj);

      // Obtener el nombre de usuario del autor
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", proj.author_id)
        .single();

      if (profile && profile.username) {
        setAuthorName(profile.username);
      }

      // Obtener el número de solicitudes al proyecto
      const { data: applications } = await supabase
        .from("project_applications")
        .select("id")
        .eq("project_id", projectId);

      setHasApplications(applications && applications.length > 0);
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
        <Spinner />
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-row gap-12 w-full p-20 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>

          <p className="mt-2">
            Propuesto por <strong>{authorName}</strong>
          </p>

          {project.type && (
            <p className="mt-2">
              <strong>Categoría:</strong> {project.type}
            </p>
          )}
          {project.tech_stack && (
            <p className="mt-2">
              <strong>Stack tecnológico:</strong> {project.tech_stack.join(", ")}
            </p>
          )}

          {project.github_repository && (
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

          {/* Botones de Editar y Eliminar */}
          <ProjectActions projectId={projectId} />

          {/* Mostrar la lista de solicitudes (colaboradores) */}
          {hasApplications && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Solicitudes de aplicación</h3>
              <ProjectApplicationsList projectId={project.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
