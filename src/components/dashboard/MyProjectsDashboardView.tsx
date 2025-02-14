import CreateProjectForm from "@/components/projects/my-projects/CreateProjectForm";
import MyProjectsList from "@/components/projects/my-projects/MyProjectsList";

export default async function MyProjectsDashboardView({
  userId,
}: {
  userId: string;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Mis proyectos</h2>

      {/* Formulario arriba */}
      <CreateProjectForm userId={userId} />

      {/* Lista de proyectos con scroll interno */}
      <div className="flex-grow overflow-y-auto">
        <MyProjectsList userId={userId} />
      </div>
    </div>
  );
}
