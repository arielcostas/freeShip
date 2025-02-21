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

  // Se asume que author_name ya está en la tabla projects
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

      {/* Contenido principal centrado con padding */}
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
          {/* Botón de Aplicar: Redirige a la página de aplicación */}
          <div className="mt-6">
            <Link
              href={`/dashboard/projects/other/application?projectId=${project.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Aplicar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
