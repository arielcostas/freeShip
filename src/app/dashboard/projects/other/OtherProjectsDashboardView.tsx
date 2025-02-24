"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import OtherProjectsList from "@/app/dashboard/projects/other/OtherProjectsList";

export default function OtherProjectsDashboardView({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [techStackFilter, setTechStackFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState(""); // 🔹 Estado para palabra clave

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, type, tech_stack, author_name")
        .neq("author_id", userId)
        .eq("visible", true) // Solo proyectos visibles
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects(data);
        setFilteredProjects(data);
      }
    };

    fetchProjects();
  }, [userId]);

  // Filtrar proyectos cuando cambian los filtros
  useEffect(() => {
    let filtered = projects;

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.type === categoryFilter);
    }

    if (techStackFilter) {
      const normalizedTechFilter = techStackFilter.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.tech_stack?.some((tech: string) =>
          tech.toLowerCase().includes(normalizedTechFilter)
        )
      );
    }

    if (keywordFilter) {
      const normalizedKeyword = keywordFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedKeyword) ||
          p.description.toLowerCase().includes(normalizedKeyword)
      );
    }

    setFilteredProjects(filtered);
  }, [categoryFilter, techStackFilter, keywordFilter, projects]);

  return (
    <div className="flex h-full">
      {/* Sidebar de filtros */}
      <div className="w-1/5 p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>

        {/* Filtro por Palabra Clave */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Palabra clave</label>
          <input
            type="text"
            placeholder="Ej: Nombre de proyecto..."
            className="w-full border rounded px-3 py-2"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="WEB/DESKTOP">Web/Desktop</option>
            <option value="MOBILE">Mobile</option>
            <option value="EMBEDDED">Embedded</option>
            <option value="VIDEOGAME">Videojuego</option>
            <option value="BD/IA/ML">BD/IA/ML</option>
            <option value="CYBERSECURITY">Ciberseguridad</option>
            <option value="SCRIPTING/SCRAPING">Scripting/Scraping</option>
          </select>
        </div>

        {/* Filtro por Tecnología */}
        <div>
          <label className="block text-sm font-medium mb-1">Tecnología</label>
          <input
            type="text"
            placeholder="Ej: React, Python..."
            className="w-full border rounded px-3 py-2"
            value={techStackFilter}
            onChange={(e) => setTechStackFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="w-4/5 h-full overflow-y-auto p-4">
        <OtherProjectsList projects={filteredProjects} />
      </div>
    </div>
  );
}
