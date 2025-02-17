import OtherProjectDetail from "@/app/dashboard/projects/other/OtherProjectDetail";

export default function OtherProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-6">
      <OtherProjectDetail projectId={params.id} />
    </div>
  );
}
