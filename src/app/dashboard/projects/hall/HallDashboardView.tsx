"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/spinner";

export default function HallDashboardView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, rating_count")
        .order("rating_count", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Proyectos Más Votados</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id} className="p-2 border rounded shadow">
            <span className="font-semibold">{project.title}</span> - ⭐ {project.rating_count}
          </li>
        ))}
      </ul>
    </div>
  );
}