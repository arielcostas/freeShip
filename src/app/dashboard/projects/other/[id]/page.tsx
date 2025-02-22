import OtherProjectDetail from "@/app/dashboard/projects/other/OtherProjectDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const projectId = params?.id; // Se asegura de obtener el ID correctamente

  if (!projectId) {
    return (
      <p className="text-red-500">Error: No se encontró el ID del proyecto.</p>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-6">
      <OtherProjectDetail projectId={projectId} />
    </div>
  );
}
