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
    <div className="p-4 overflow-y-auto max-h-[calc(100vh-250px)]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🏆 Hall de la Fama 🏆
      </h2>
      <ul className="space-y-6 relative">
        {projects.map((project, index) => (
          <div key={project.id} className="relative flex items-center">
            {/* Medalla más grande y centrada verticalmente */}
            {index < 3 && (
              <span className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-5xl">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </span>
            )}
            <OtherProjectCard project={project} />
          </div>
        ))}
      </ul>
    </div>
  );
}
