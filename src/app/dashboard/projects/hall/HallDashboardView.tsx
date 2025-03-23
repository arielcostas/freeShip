"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/spinner";
import HallProjectCard from "@/app/dashboard/projects/hall/HallProjectCard";

export default function HallDashboardView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, title, rating_count, description, author_name, author_id"
          )
          .order("rating_count", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching projects:", error.message || error);
        } else {
          // Filtrar proyectos sin votos
          const filteredProjects = data.filter(
            (project) => project.rating_count > 0
          );
          setProjects(filteredProjects);
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
    <div>
      {/* Versión para PC */}
      {!isMobile && (
        <div className="pl-20 overflow-y-auto max-h-[calc(100vh-250px)]">
          <h2 className="text-5xl font-bold mb-6 text-center pr-20">⇀ 1% ↼</h2>
          <ul className="space-y-6 relative">
            {projects.map((project, index) => (
              <div key={project.id} className="relative flex items-center">
                {index < 3 && (
                  <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-5xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                )}
                <HallProjectCard project={project} />
              </div>
            ))}
          </ul>
        </div>
      )}

      {/* Versión para móvil */}
      {isMobile && (
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-250px)]">
          <h2 className="text-xl font-bold mb-4 text-center">
            🏆 Hall de la Fama 🏆
          </h2>
          <ul className="space-y-4 relative">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="relative flex items-center pl-10"
              >
                {index < 3 && (
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-3xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                )}
                <HallProjectCard project={project} />
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
