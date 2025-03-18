"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
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
  const [collaboratorsNumber, setCollaboratorsNumber] = useState(1); // Estado para el número de colaboradores
  const [currentMembers, setCurrentMembers] = useState<number>(0); // Miembros actuales
  const [teamMembers, setTeamMembers] = useState<
    { id: string; username: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Para mostrar el popup de error
  const [memberToExpel, setMemberToExpel] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [showExpelPopup, setShowExpelPopup] = useState(false);
  const [githubRepository, setGithubRepository] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "title, description, type, tech_stack, collaborators_number, team_members, github_repository"
        )
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
        setCollaboratorsNumber(data.collaborators_number || 1);
        setGithubRepository(data.github_repository || "");

        if (data.team_members?.length) {
          setCurrentMembers(data.team_members.length);
          const { data: membersData, error: membersError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", data.team_members);
          if (!membersError && membersData) {
            setTeamMembers(membersData);
          }
        }
      }

      if (data.github_repository) {
        setGithubRepository(data.github_repository);
      }
    };

    fetchProject();
  }, [id, supabase]);

  const handleDeleteProject = async () => {
    if (
      !confirm(
        "¿Seguro que quieres eliminar este proyecto? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setError("Error al eliminar el proyecto.");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (currentMembers > collaboratorsNumber) {
      setShowErrorPopup(true);
      setLoading(false);
      return;
    }

    let newVisibility = true;
    if (collaboratorsNumber <= currentMembers) {
      newVisibility = false;
    }

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        type: type || null,
        tech_stack: techStack.length > 0 ? techStack : null,
        collaborators_number: collaboratorsNumber,
        visible: newVisibility,
        github_repository: githubRepository || null,
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

  const handleExpelMember = async () => {
    if (!memberToExpel) return;

    const updatedTeamMembers = teamMembers.filter(
      (member) => member.id !== memberToExpel.id
    );
    const updatedIds = updatedTeamMembers.map((member) => member.id);

    const { error } = await supabase
      .from("projects")
      .update({ team_members: updatedIds })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setTeamMembers(updatedTeamMembers);
      setCurrentMembers(updatedTeamMembers.length);
    }
    setShowExpelPopup(false);
    setMemberToExpel(null);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Navbar ocupa todo el ancho */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>
      <div className="bg-white p-6 lg:p-20 rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-bold mb-4 my-project-edit-title">
          Editar Proyecto
        </h2>
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

          {/* Entrada para el Stack Tecnológico */}
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
              <Button type="button" onClick={handleAddTech}>
                Añadir
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-[#5865f2] techStack px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    className="techStack ml-2 bg-red-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded-full"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Campo para el Número de Colaboradores */}
          <div>
            <label className="block text-sm font-medium">
              Número máximo de colaboradores:
            </label>
            <input
              type="number"
              value={collaboratorsNumber}
              onChange={(e) => {
                const newVal = Number(e.target.value);
                if (newVal < currentMembers) {
                  alert(
                    "El número de colaboradores no puede ser menor que el número de miembros actuales."
                  );
                } else if (newVal < 1) {
                  setCollaboratorsNumber(1);
                } else if (newVal > 10) {
                  setCollaboratorsNumber(10);
                } else {
                  setCollaboratorsNumber(newVal);
                }
              }}
              className="w-20 border p-2 rounded"
              min={1}
              max={10}
              required
            />

            <div>
              <h3>Miembros colaboradores:</h3>
              {teamMembers.length > 0 ? (
                <ul className="mt-2 text-sm text-gray-700 space-y-2">
                  {teamMembers.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <span>{member.username}</span>
                      <button
                        type="button"
                        className="bg-red-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded-full ml-2"
                        onClick={() => {
                          setMemberToExpel(member);
                          setShowExpelPopup(true);
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay miembros en este proyecto.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Repositorio de GitHub
            </label>
            <input
              type="text"
              value={githubRepository}
              onChange={(e) => setGithubRepository(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Ejemplo: https://github.com/usuario/repo"
            />
          </div>

          {/* Botón Guardar Cambios - ancho ajustado */}
          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#acd916] text-gray-700 font-bold rounded hover:bg-[#88b000] hover:text-white transition"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>

        {/* Popup de Error si el número de colaboradores es mayor que los miembros actuales */}
        {showErrorPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-red-500">
                Error: El número de colaboradores no puede superar el número de
                miembros actuales.
              </h3>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setShowErrorPopup(false)}
                  className="bg-red-500 text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Popup de confirmación para expulsar colaborador */}
        {showExpelPopup && memberToExpel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-red-500">
                ¿Expulsar a {memberToExpel.username}? Ten presente que es una
                decisión irreversible.
              </h3>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setShowExpelPopup(false);
                    setMemberToExpel(null);
                  }}
                  className="bg-gray-500 text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleExpelMember}
                  className="bg-red-500 text-white"
                >
                  Expulsar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sección de eliminar proyecto, separada visualmente */}
        <div className="border-t mt-8 pt-4">
          <h3 className="text-lg font-bold text-red-500 mb-2">
            Eliminar Proyecto
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Esta acción es irreversible. El proyecto y toda su información se
            eliminarán permanentemente.
          </p>
          <div className="flex justify-start">
            <Button
              onClick={handleDeleteProject}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar Proyecto"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
