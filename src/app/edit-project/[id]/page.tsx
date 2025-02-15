"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const PROJECT_TYPES = [
  "WEB/DESKTOP",
  "MOBILE",
  "EMBEDDED",
  "VIDEOGAME",
  "BD/IA/ML",
  "CYBERSECURITY",
  "SCRIPTING/SCRAPING",
];

export default function EditProject() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams(); // ✅ Accede a los parámetros correctamente en Next.js 14
  const id = params.id as string; // Asegurar que es un string

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Error al cargar el proyecto.");
        return;
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setType(data.type || "");
        setTechStack(data.tech_stack || []);
      }
    };

    fetchProject();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        type: type || null,
        tech_stack: techStack.length > 0 ? techStack : null,
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Editar Proyecto</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Título */}
          <div>
            <label className="block text-sm font-medium">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-medium">Descripción *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
          </div>

          {/* Selector de Tipo de Proyecto */}
          <div>
            <label className="block text-sm font-medium">Tipo de Proyecto</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecciona un tipo...</option>
              {PROJECT_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Entrada para el Stack Tecnológico */}
          <div>
            <label className="block text-sm font-medium">Stack Tecnológico</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Ejemplo: Java, React, PostgreSQL"
              />
              <Button type="button" onClick={handleAddTech}>
                Añadir
              </Button>
            </div>
            {/* Lista de Tecnologías Agregadas */}
            <div className="mt-2 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    className="ml-2 text-white font-bold"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </div>
    </div>
  );
}
