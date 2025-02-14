import { createClient } from "@/lib/supabase/server";

export default async function MyProjectsList({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("author_id", userId);

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div className="h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
      {projects && projects.length > 0 ? (
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <li key={project.id} className="border p-3 rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-700">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No projects yet. Create one!</p>
      )}
    </div>
  );
}

