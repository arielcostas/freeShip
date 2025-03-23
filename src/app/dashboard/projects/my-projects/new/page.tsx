"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/(site)/Navbar";

// Se define el array de tipos de proyecto con su valor y label amigable
const PROJECT_TYPES = [
  { value: "WEB/DESKTOP", label: "Desarrollo web o escritorio" },
  { value: "MOBILE", label: "Desarrollo móvil" },
  { value: "EMBEDDED", label: "Código embebido" },
  { value: "VIDEOGAME", label: "Videojuego" },
  {
    value: "BD/IA/ML",
    label: "Big Data | Inteligencia Artificial | Machine Learning",
  },
  { value: "CYBERSECURITY", label: "Ciberseguridad" },
  { value: "SCRIPTING/SCRAPING", label: "Scripting" },
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
  const [collaboratorsNumber, setCollaboratorsNumber] = useState(1);
  const [githubRepository, setGithubRepository] = useState("");
  const [chatRoomLink, setChatRoomLink] = useState("");

  const handleSignOut = async () => {
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
        router.push("/login");
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

    try {
      // 1. Crear el proyecto en la base de datos
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert([
          {
            title,
            description,
            type: type || null,
            tech_stack: techStack.length > 0 ? techStack : null,
            author_id: userId,
            collaborators_number: collaboratorsNumber,
            github_repository: githubRepository,
            chat_room_link: chatRoomLink,
          },
        ])
        .select()
        .single();

      if (projectError) {
        throw new Error(`Error al crear el proyecto: ${projectError.message}`);
      }

      // Redirigir al dashboard una vez completado todo
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      <div className="flex-grow flex items-center justify-center p-20 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-5/6 mx-auto max-w-5xl p-10 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 my-project-edit-title">
            Crear Nuevo Proyecto
          </h2>

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
                <option value="">Todavía no lo he decidido...</option>
                {PROJECT_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                      setTechInput("");
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

            <div>
              <label className="block text-sm font-medium">
                Número de Colaboradores
              </label>
              <input
                type="number"
                value={collaboratorsNumber}
                onChange={(e) => setCollaboratorsNumber(Number(e.target.value))}
                className="w-20 border p-2 rounded"
                min={1}
                max={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Repositorio (sólo visible para los miembros del proyecto)
              </label>
              <input
                type="text"
                value={githubRepository}
                onChange={(e) => setGithubRepository(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Ejemplo: https://github.com/usuario/repositorio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Invitación a sala de chat (sólo visible para los miembros del
                proyecto)
              </label>
              <input
                type="text"
                value={chatRoomLink}
                onChange={(e) => setChatRoomLink(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Ejemplo: https://discord.gg/aB1fc2dFG"
              />
            </div>

            <div className="flex justify-between items-center">
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
                className="bg-[#acd916] text-gray-700 px-4 font-bold py-2 rounded hover:bg-[#88b000] hover:text-white transition ml-4"
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
