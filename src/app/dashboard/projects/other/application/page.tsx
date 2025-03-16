"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/app/(site)/Navbar";

const OtherProjectApplicationPageContent = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setError("No se pudo obtener el usuario.");
      }
    };

    fetchUser();
  }, [supabase]);

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
      router.push(`/dashboard/projects/other/${projectId}`);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <>
      {/* Navbar ocupa todo el ancho */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenedor centrado */}
      <div className="max-w-xl mx-auto mt-20 p-6 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Solicitud de aplicación</h2>
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
          <Button
            className="bg-[#acd916] text-gray-700 px-4 font-bold py-2 rounded hover:bg-[#88b000] hover:text-white transition"
            onClick={handleApply}
            disabled={loading || !projectId}
          >
            <strong>{loading ? "Enviando..." : "Enviar solicitud"}</strong>
          </Button>
          <Button
            className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => router.back()}
            variant="destructive"
          >
            <strong>Cancelar</strong>
          </Button>
        </div>
      </div>
    </>
  );
};

export default function OtherProjectApplicationPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <OtherProjectApplicationPageContent />
    </Suspense>
  );
}