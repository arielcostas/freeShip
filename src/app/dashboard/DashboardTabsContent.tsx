import MyProjectsDashboardView from "@/components/dashboard/MyProjectsDashboardView";
import OtherProjectsDashboardView from "@/components/dashboard/OtherProjectsDashboardView";

export function DashboardTabsContent({
  activeTab,
  userId,
}: {
  activeTab: string;
  userId: string;
}) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-2">
      {activeTab === "misProyectos" ? (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <MyProjectsDashboardView userId={userId} />
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
          <OtherProjectsDashboardView userId={userId} />
        </div>
      )}
    </div>
  );
}
