import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function MyProjectDetail({
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

  // Obtener el nombre de usuario del autor desde la tabla profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", project.author_id)
    .single();

  let authorName = "Desconocido";
  if (!profileError && profile && profile.username) {
    authorName = profile.username;
  }

  const handleSignOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header fijo */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Mis proyectos</h1>
        <form action={handleSignOut}>
          <Button type="submit">Sign Out</Button>
        </form>
      </div>

      {/* Contenido que ocupa el 100% del espacio restante */}
      <div className="flex flex-grow overflow-hidden p-6">
        <div className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>
          <p className="mt-2">
            <strong>Por </strong> {authorName}
          </p>
          {project.type && (
            <p className="mt-2">
              <strong>Tipo:</strong> {project.type}
            </p>
          )}
          {project.tech_stack && (
            <p className="mt-2">
              <strong>Stack:</strong> {project.tech_stack.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
