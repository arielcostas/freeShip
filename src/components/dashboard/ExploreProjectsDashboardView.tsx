import { createClient } from "@/lib/supabase/server";
import OtherProjectsList from "@/components/projects/other-projects/OtherProjectsList";

export default async function ExploreProjectsDashboardView({
  userId,
}: {
  userId: string;
}) {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, description, type, tech_stack, author_name") // Incluir author_name
    .neq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div className="h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
      <OtherProjectsList projects={projects} />
    </div>
  );
}
