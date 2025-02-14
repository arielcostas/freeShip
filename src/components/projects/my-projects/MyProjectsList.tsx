import { createClient } from "@/lib/supabase/server";

export default async function MyProjectsList({ userId }: { userId: string }) {
  const supabase = createClient();
  // Nota: usamos "author_id" según la tabla creada.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("author_id", userId);

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div>
      {projects && projects.length > 0 ? (
        <ul>
          {projects.map((project: any) => (
            <li key={project.id} className="border p-2 mb-2 rounded">
              <h3 className="font-bold">{project.title}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects yet. Create one!</p>
      )}
    </div>
  );
}
