import Link from "next/link";
import MyProjectsList from "@/components/projects/my-projects/MyProjectsList";

export default async function MyProjectsDashboardView({
                                                        userId,
                                                      }: {
  userId: string;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mis proyectos</h2>
        <Link
          href="/dashboard/projects/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Nuevo Proyecto
        </Link>
      </div>

      {/* Lista de proyectos con scroll interno */}
      <div className="flex-grow overflow-y-auto">
        <MyProjectsList userId={userId} />
      </div>
    </div>
  );
}
