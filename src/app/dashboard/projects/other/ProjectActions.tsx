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

  return (
    <div className="flex gap-4 mt-6">
      <Button
        onClick={handleEdit}
        className="bg-[#acd916] text-gray-700 px-4 font-bold py-2 rounded hover:bg-[#88b000] hover:text-white transition"
      >
        Editar
      </Button>
    </div>
  );
}
