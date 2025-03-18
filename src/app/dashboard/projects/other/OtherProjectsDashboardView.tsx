"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import OtherProjectsList from "@/app/dashboard/projects/other/OtherProjectsList";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import OtherProjectFilter from "@/components/OtherProjectFilter";
import Spinner from "../../../../components/ui/spinner";

export default function OtherProjectsDashboardView({
  userId,
}: {
  userId: string;
}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [techStackFilter, setTechStackFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, type, tech_stack, author_name, rating_avg")
        .neq("author_id", userId)
        .eq("visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects(data);
        setFilteredProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [userId]);

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
    <div className="flex flex-col md:flex-row h-full">
      {/* Botón para mostrar/ocultar filtro en móvil */}
      <div className="md:hidden w-full p-4 border-b border-gray-300">
        <Button
          className="w-full flex justify-between"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          Filtros {isFilterOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {/* Componente de filtro */}
      <OtherProjectFilter
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        techStackFilter={techStackFilter}
        setTechStackFilter={setTechStackFilter}
        keywordFilter={keywordFilter}
        setKeywordFilter={setKeywordFilter}
        isFilterOpen={isFilterOpen}
      />

      {/* Lista de proyectos con scroll solo cuando sea necesario */}
      <div className="w-full md:w-4/5 h-full overflow-y-auto max-h-[calc(100vh-250px)] p-4">
        {loading ? (
          <Spinner color="#5865f2" />
        ) : (
          <OtherProjectsList projects={filteredProjects} />
        )}
      </div>
    </div>
  );
}
