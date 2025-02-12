import { createClient } from "@/lib/supabase/server";

export default async function ExploreProjects() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .neq("is_private", true);

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Explore Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="border p-2 mb-2 rounded">
              {project.name} - {project.owner_id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No public projects found.</p>
      )}
    </div>
  );
}
