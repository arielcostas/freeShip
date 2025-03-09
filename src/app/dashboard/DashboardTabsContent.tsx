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
      <div className="md:hidden bg-gray-100 p-4 rounded-lg shadow-md">
        {activeTab === "misProyectos" ? (
          <MyProjectsDashboardView userId={userId} />
        ) : (
          <OtherProjectsDashboardView userId={userId} />
        )}
      </div>

      {/* Este contenido será visible solo en pantallas de PC */}
      <div className="hidden md:block flex-grow h-full w-full p-4 bg-white shadow-md rounded-lg mt-2">
        {activeTab === "misProyectos" ? (
          <div className="flex-grow h-full w-full bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
            <MyProjectsDashboardView userId={userId} />
          </div>
        ) : (
          <div className="flex-grow h-full w-full bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
            <OtherProjectsDashboardView userId={userId} />
          </div>
        )}
      </div>
    </>
  );
}
