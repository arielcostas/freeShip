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
  const [type, setType] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (title.length > 60) {
      setError("El título no puede superar los 60 caracteres.");
      setLoading(false);
      return;
    }

    if (description.length > 500) {
      setError("La descripción no puede superar los 500 caracteres.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          description,
          type: type || null,
          tech_stack: techStack.length > 0 ? techStack : null,
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
    if (
      techInput.trim() &&
      !techStack.includes(techInput.trim()) &&
      techInput.length <= 30
    ) {
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
          maxLength={100}
          required
        />
        <p className="text-xs text-gray-500 text-right">
          {title.length}/100 caracteres
        </p>
      </div>

      {/* Campo Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
          maxLength={500}
          required
        />
        <p className="text-xs text-gray-500 text-right">
          {description.length}/500 caracteres
        </p>
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
            maxLength={30}
          />
          <Button type="button" onClick={handleAddTech}>
            Añadir
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-right">
          {techInput.length}/30 caracteres
        </p>
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
