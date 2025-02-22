import MyProjectDetail from "@/app/dashboard/projects/my-projects/MyProjectDetail";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className=" flex justify-center items-center bg-gray-100 ">
      <MyProjectDetail projectId={params.id} />
    </div>
  );
}
