import MyProjectsDashboardView from "@/app/dashboard/projects/my-projects/MyProjectsDashboardView";
import OtherProjectsDashboardView from "@/app/dashboard/projects/other/OtherProjectsDashboardView";

export function DashboardTabsContent({
                                       activeTab,
                                       userId,
                                     }: {
  activeTab: string;
  userId: string;
}) {
  return (
    <>
      {/* Este contenido será visible en pantallas móviles */}
      <div className="md:hidden bg-gray-100">
        {activeTab === "misProyectos" ? (
          <MyProjectsDashboardView userId={userId} />
        ) : (
          <OtherProjectsDashboardView userId={userId} />
        )}
      </div>

      {/* Este contenido será visible solo en pantallas de PC */}
      <div className="hidden md:block">
        {activeTab === "misProyectos" ? (
          <MyProjectsDashboardView userId={userId} />
        ) : (
          <OtherProjectsDashboardView userId={userId} />
        )}
      </div>
    </>
  );
}
