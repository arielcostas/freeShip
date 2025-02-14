import { createClient } from "@/lib/supabase/server";

export default async function MyProjectDetail({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    return <p className="text-red-500">Project not found</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">{project.title}</h2>
      <p className="text-gray-700 mt-2">{project.description}</p>
      {project.type && <p className="mt-2"><strong>Type:</strong> {project.type}</p>}
      {project.tech_stack && (
        <p className="mt-2"><strong>Stack:</strong> {project.tech_stack.join(", ")}</p>
      )}
    </div>
  );
}
