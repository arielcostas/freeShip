import Link from "next/link";
import MyProjectsList from "@/app/dashboard/projects/my-projects/MyProjectsList";

export default async function MyProjectsDashboardView({
  userId,
}: {
  userId: string;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4">
        <div className="flex justify-start">
          <Link
            href="/dashboard/projects/my-projects/new"
            className="bg-green-600 text-white px-4 font-bold py-2 rounded hover:bg-green-700 transition"
          >
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Lista de proyectos con scroll interno */}
      <div className="flex-grow overflow-y-auto">
        <MyProjectsList userId={userId} />
      </div>
    </div>
  );
}
