import Link from "next/link";
import MyProjectsList from "@/app/dashboard/projects/my-projects/MyProjectsList";
import { Suspense } from "react";
import Spinner from "../../../../components/ui/spinner"

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
            className="custom-btn"
          >
            <strong>Nuevo proyecto</strong>
          </Link>
        </div>
      </div>

      {/* Lista de proyectos con scroll solo cuando el contenido excede */}
      <div className="flex-grow overflow-y-auto max-h-[calc(100vh-250px)]">
        <Suspense fallback={<Spinner />}>
          <MyProjectsList userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}
