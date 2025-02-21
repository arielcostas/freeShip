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
        <h2 className="text-xl font-bold mb-4 text-center">Mis proyectos</h2>
        <div className="flex justify-start">
          <Link
            href="/dashboard/projects/my-projects/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
