"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/spinner";
import OtherProjectCard from "../other/OtherProjectCard";

export default function HallDashboardView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, rating_count, description, author_name") // Ajusta los campos según los que use OtherProjectCard
          .order("rating_count", { ascending: false })
          .limit(10);

        console.log("Supabase response:", data, error);

        if (error) {
          console.error("Error fetching projects:", error.message || error);
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Proyectos Más Votados</h2>
      <ul className="space-y-4">
        {projects.map((project) => (
          <OtherProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
}
