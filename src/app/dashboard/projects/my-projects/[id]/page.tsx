import MyProjectDetail from "@/app/dashboard/projects/my-projects/MyProjectDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // Asegurar que params se espera correctamente

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <MyProjectDetail projectId={id} />
    </div>
  );
}
