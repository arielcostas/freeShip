"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener userId del usuario autenticado
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else {
        router.push("/login"); // Redirige si no hay usuario autenticado
      }
    };

    getUser();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.from("projects").insert([
      {
        title,
        description,
        type: type || null,
        tech_stack: techStack.length > 0 ? techStack : null,
        author_id: userId, // Ahora userId siempre tendrá un valor válido
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard"); // Redirigir al dashboard tras crear
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Proyecto</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button
              type="button"
              onClick={() => setTechStack([...techStack, techInput.trim()])}
            >
              Añadir
            </Button>
          </div>

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
                  onClick={() =>
                    setTechStack(techStack.filter((t) => t !== tech))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Creando..." : "Crear Proyecto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
