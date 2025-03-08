"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/(site)/Navbar";

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
  const [collaboratorsNumber, setCollaboratorsNumber] = useState(1); // Nuevo estado para el número de colaboradores

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

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
        type: type || null, // Si no hay un tipo, se asigna null
        tech_stack: techStack.length > 0 ? techStack : null, // Si el techStack está vacío, se asigna null
        author_id: userId || null, // Asegúrate de que userId sea válido, o asigna null
        collaborators_number: collaboratorsNumber, // Campo de número de colaboradores
      },
    ]);

    if (error) {
      console.error("Error al insertar el proyecto:", error.message); // Depuración para ver el error
    } else {
      console.log("Proyecto insertado correctamente");
    }

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard"); // Redirigir al dashboard tras crear
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar a pantalla completa */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-5/6 mx-auto max-w-5xl p-10 bg-white shadow-lg rounded-lg">
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
              <label className="block text-sm font-medium">
                Tipo de Proyecto
              </label>
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
              <label className="block text-sm font-medium">
                Stack Tecnológico
              </label>
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
                  className="font-bold"
                  onClick={() => {
                    if (techInput.trim() !== "") {
                      setTechStack([...techStack, techInput.trim()]);
                      setTechInput(""); // Opcional, para limpiar el input después de añadir
                    }
                  }}
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

            {/* Campo para el número de colaboradores */}
            <div>
              <label className="block text-sm font-medium">
                Número de Colaboradores
              </label>
              <input
                type="number"
                value={collaboratorsNumber}
                onChange={(e) => setCollaboratorsNumber(Number(e.target.value))}
                className="w-full border p-2 rounded"
                min={1}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition"
              >
                <strong>Cancelar</strong>
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#acd916] text-gray-700 px-4 font-bold py-2 rounded hover:bg-[#88b000] hover:text-white transition"
              >
                <strong>{loading ? "Creando..." : "Crear Proyecto"}</strong>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
