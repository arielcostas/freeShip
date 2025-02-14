import MyProjectDetail from "@/components/projects/my-projects/MyProjectDetail";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-6">
      <MyProjectDetail projectId={params.id} />
    </div>
  );
}
