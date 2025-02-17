"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface CreateProjectFormProps {
  userId: string;
}

const PROJECT_TYPES = [
  "WEB/DESKTOP",
  "MOBILE",
  "EMBEDDED",
  "VIDEOGAME",
  "BD/IA/ML",
  "CYBERSECURITY",
  "SCRIPTING/SCRAPING",
];

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // Tipo de proyecto (opcional)
  const [techStack, setTechStack] = useState<string[]>([]); // Stack tecnológico
  const [techInput, setTechInput] = useState(""); // Entrada para nuevas tecnologías
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title: title,
          description,
          type: type || null, // Si no se selecciona, guarda null
          tech_stack: techStack.length > 0 ? techStack : null, // Si está vacío, guarda null
          author_id: userId,
        },
      ])
      .select();

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setDescription("");
      setType("");
      setTechStack([]);
      setTechInput("");
      window.location.reload();
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
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {error && <p className="text-red-500">{error}</p>}

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
        {loading ? "Creando..." : "Crear Proyecto"}
      </Button>
    </form>
  );
}
