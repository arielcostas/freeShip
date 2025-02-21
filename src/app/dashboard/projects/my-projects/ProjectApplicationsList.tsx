"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ProjectApplicationsList({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_applications")
      .select("id, applicant_id, message, status, applied_at")
      .eq("project_id", projectId)
      .order("applied_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase
      .from("project_applications")
      .update({ status: newStatus })
      .eq("id", appId);
    if (error) {
      alert("Error actualizando el estado: " + error.message);
    } else {
      fetchApplications();
    }
  };

  if (loading) return <p>Cargando aplicaciones...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (applications.length === 0)
    return <p className="text-gray-500">No hay solicitudes de aplicación.</p>;

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="border p-3 rounded shadow-sm bg-gray-50">
          <p className="text-sm"><strong>Solicitante:</strong> {app.applicant_id}</p>
          <p className="text-sm"><strong>Mensaje:</strong> {app.message || "Sin mensaje"}</p>
          <p className="text-sm"><strong>Estado:</strong> {app.status}</p>
          {app.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => handleUpdateStatus(app.id, "accepted")}>
                Aceptar
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(app.id, "rejected")}>
                Rechazar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
