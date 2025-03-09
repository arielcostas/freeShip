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
      {activeTab === "misProyectos" ? (
        <MyProjectsDashboardView userId={userId} />
      ) : (
        <OtherProjectsDashboardView userId={userId} />
      )}
    </>
  );
}
