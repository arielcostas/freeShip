"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function OtherProjectApplication({ userId, onCancel }: { userId: string; onCancel: () => void }) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const router = useRouter();

  useEffect(() => {
    console.log("userId:", userId);
    console.log("projectId:", projectId);
  }, [userId, projectId]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!projectId) {
      setError("No se ha encontrado el proyecto.");
    }
  }, [projectId]);

  const handleApply = async () => {
    if (!projectId) {
      setError("No se ha encontrado el proyecto.");
      return;
    }
    if (message.length > 1000) {
      setError("El mensaje no puede superar los 1000 caracteres.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.from("project_applications").insert([
      {
        project_id: projectId,
        applicant_id: userId,
        status: "PENDING",
        message: message.trim() || null,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      onCancel(); // Cerrar la vista tras aplicar
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold mb-2">Aplicar al Proyecto</h2>
      {error && <p className="text-red-500">{error}</p>}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Escribe un mensaje opcional (máx. 1000 caracteres)"
        maxLength={1000}
        rows={4}
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary">
          Cancelar
        </Button>
        <Button onClick={handleApply} disabled={loading || !projectId}>
          {loading ? "Aplicando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
