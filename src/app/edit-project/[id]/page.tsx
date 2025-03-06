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
  const [collaboratorsNumber, setCollaboratorsNumber] = useState(1); // Estado para el número de colaboradores
  const [currentMembers, setCurrentMembers] = useState<number>(0); // Miembros actuales
  const [teamMembers, setTeamMembers] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Para mostrar el popup de error
  const [memberToExpel, setMemberToExpel] = useState<{ id: string; username: string } | null>(null);
  const [showExpelPopup, setShowExpelPopup] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("title, description, type, tech_stack, collaborators_number, team_members")
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
    };

    fetchProject();
  }, [id, supabase]);

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
            <div className="mt-2 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    className="ml-2 bg-red-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded-full"
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
            <label className="block text-sm font-medium">Número de Colaboradores</label>
            <input
              type="number"
              value={collaboratorsNumber}
              onChange={(e) => {
                const newVal = Number(e.target.value);
                if (newVal < currentMembers) {
                  alert("El número de colaboradores no puede ser menor que el número de miembros actuales.");
                } else {
                  setCollaboratorsNumber(newVal);
                }
              }}
              className="w-full border p-2 rounded"
              min={1}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Miembros actuales: {currentMembers}
            </p>

            <div>
              <h3>Miembros colaboradores:</h3>
              {teamMembers.length > 0 ? (
                <ul className="mt-2 text-sm text-gray-700">
                  {teamMembers.map((member) => (
                    <li key={member.id} className="flex items-center justify-between">
                      <span>{member.username}</span>
                      <button
                        type="button"
                        className="bg-red-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded-full ml-2"
                        onClick={() => {
                          setMemberToExpel(member);
                          setShowExpelPopup(true);
                        }}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay miembros en este proyecto.</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
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
                ¿Está seguro de expulsar a {memberToExpel.username}?
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
      </div>
    </div>
  );
}
