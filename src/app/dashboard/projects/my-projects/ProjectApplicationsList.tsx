"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ProjectApplicationsList({
                                                  projectId,
                                                }: {
  projectId: string;
}) {
  const supabase = createClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);

    // Obtener aplicaciones
    const { data: applicationsData, error: applicationsError } = await supabase
      .from("project_applications")
      .select("id, applicant_id, message, status, applied_at")
      .eq("project_id", projectId)
      .order("applied_at", { ascending: false });

    if (applicationsError) {
      setError(applicationsError.message);
      setLoading(false);
      return;
    }

    // Obtener los usernames de los solicitantes
    const applicantIds = applicationsData.map((app) => app.applicant_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", applicantIds); // Buscar todos los usernames en una sola consulta

    if (profilesError) {
      setError(profilesError.message);
      setLoading(false);
      return;
    }

    // Crear un diccionario para búsqueda rápida de usernames
    const profilesMap = profilesData.reduce((acc, profile) => {
      acc[profile.id] = profile.username;
      return acc;
    }, {});

    // Asignar el nombre de usuario a cada aplicación
    const applicationsWithNames = applicationsData.map((app) => ({
      ...app,
      applicant_name: profilesMap[app.applicant_id] || "Desconocido",
    }));

    setApplications(applicationsWithNames);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    // Buscar la aplicación en la lista para obtener `applicant_id`
    const application = applications.find((app) => app.id === appId);
    if (!application) {
      alert("Solicitud no encontrada");
      return;
    }

    const { applicant_id } = application;

    // Actualizar estado de la solicitud
    const { error: updateError } = await supabase
      .from("project_applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (updateError) {
      alert("Error actualizando el estado: " + updateError.message);
      return;
    }

    if (newStatus === "ACCEPTED") {
      // Obtener los miembros actuales del equipo y el número máximo de colaboradores
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("team_members, collaborators_number")
        .eq("id", projectId)
        .single();

      if (projectError) {
        alert("Error obteniendo el proyecto: " + projectError.message);
        return;
      }

      const currentMembers = project?.team_members || [];
      const maxCollaborators = project?.collaborators_number || 0;

      // Evitar añadir duplicados
      if (!currentMembers.includes(applicant_id)) {
        const updatedMembers = [...currentMembers, applicant_id];

        const { error: teamUpdateError } = await supabase
          .from("projects")
          .update({ team_members: updatedMembers })
          .eq("id", projectId);

        if (teamUpdateError) {
          alert(
            "Error actualizando los miembros del equipo: " +
            teamUpdateError.message
          );
        }

        // Verificar si se ha alcanzado el límite de colaboradores
        if (updatedMembers.length === maxCollaborators) {
          const { error: visibilityUpdateError } = await supabase
            .from("projects")
            .update({ visible: false })
            .eq("id", projectId);

          if (visibilityUpdateError) {
            alert(
              "Error actualizando la visibilidad del proyecto: " +
              visibilityUpdateError.message
            );
          }

          // Rechazar todas las solicitudes pendientes
          const { error: rejectError } = await supabase
            .from("project_applications")
            .update({ status: "REJECTED" })
            .eq("project_id", projectId)
            .eq("status", "PENDING");

          if (rejectError) {
            alert(
              "Error rechazando las solicitudes pendientes: " +
              rejectError.message
            );
          }
        }
      }
    }

    fetchApplications();
  };

  if (loading) return <p>Cargando aplicaciones...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (applications.length === 0)
    return <p className="text-gray-500">No hay solicitudes de aplicación.</p>;

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="border p-3 rounded shadow-sm bg-gray-50">
          <p className="text-sm">
            <strong>Aplicante:</strong> {app.applicant_name}
          </p>
          <p className="text-sm">
            <strong>Mensaje:</strong> {app.message || "Sin mensaje"}
          </p>
          <p className="text-sm">
            <strong>Estado:</strong> {app.status}
          </p>
          {app.status === "PENDING" && (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
              >
                Aceptar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
              >
                Rechazar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
