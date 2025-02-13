"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Asegúrate de tener una instancia cliente de Supabase
import { Button } from "@/components/ui/button";

interface CreateProjectFormProps {
  userId: string;
}

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, description, author_id: userId }])
      .select();

    if (error) {
      setError(error.message);
    } else {
      // Limpia el formulario y actualiza la página para ver el nuevo proyecto.
      setTitle("");
      setDescription("");
      // Una forma sencilla es recargar la página (o bien, usar una estrategia de revalidación).
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
