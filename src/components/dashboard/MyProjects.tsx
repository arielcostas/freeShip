import { createClient } from "@/lib/supabase/server";

export default async function MyProjects({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", userId);

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="border p-2 mb-2 rounded">
              {project.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects yet. Create one!</p>
      )}
    </div>
  );
}
