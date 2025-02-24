"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleEdit = () => {
    router.push(`/edit-project/${projectId}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar este proyecto?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      alert("Hubo un error al eliminar el proyecto.");
    } else {
      router.push("/dashboard"); // Redirigir tras eliminar
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        onClick={handleEdit}
        className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Editar
      </Button>
      <Button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 font-bold"
      >
        Eliminar
      </Button>
    </div>
  );
}
