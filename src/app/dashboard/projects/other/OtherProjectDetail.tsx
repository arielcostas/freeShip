"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Importa el cliente para el lado del cliente
import { useRouter } from "next/navigation";
import Navbar from "@/app/(site)/Navbar";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function OtherProjectDetail({
  projectId,
}: {
  projectId: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasStarred, setHasStarred] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Obtener el proyecto
      const { data: proj, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError || !proj) {
        setErrorMsg("Project not found");
        setLoading(false);
        return;
      }
      setProject(proj);

      // Obtener el usuario autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (!userError && userData?.user) {
        setUser(userData.user);

        // Comprobar si el usuario ya ha aplicado
        const { data: application } = await supabase
          .from("project_applications")
          .select("status")
          .eq("project_id", projectId)
          .eq("applicant_id", userData.user.id)
          .single();

        if (application) {
          setApplicationStatus(application.status);
        }

        // Verificar si el usuario es miembro del equipo (si project.team_members es un array)
        if (proj.team_members && Array.isArray(proj.team_members)) {
          setIsMember(proj.team_members.includes(userData.user.id));
        }

        // Comprobar si el usuario ya ha dado like (estrella)
        const { data: userStar } = await supabase
          .from("project_ratings")
          .select("starred")
          .eq("project_id", projectId)
          .eq("user_id", userData.user.id)
          .single();
        setHasStarred(!!userStar);

        // Contar el total de likes del proyecto
        const { count } = await supabase
          .from("project_ratings")
          .select("*", { count: "exact" })
          .eq("project_id", projectId);
        setStarCount(count || 0);
      }

      setLoading(false);
    }
    fetchData();
  }, [projectId, supabase]);

  // Determina si el usuario puede votar (por ejemplo, no es miembro del equipo)
  const canVote = !project?.team_members?.includes(user?.id);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Función para alternar el like (dar o quitar la estrella)
  async function toggleStar() {
    if (!user) {
      alert("Debes iniciar sesión para dar like.");
      return;
    }

    if (hasStarred) {
      // Quitar like
      const { error } = await supabase
        .from("project_ratings")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", user.id);
      if (error) {
        console.error("Error al quitar like:", error);
        alert("No se pudo quitar el like.");
        return;
      }
      setHasStarred(false);
      setStarCount((prev) => Math.max(prev - 1, 0));
    } else {
      // Dar like
      const { error } = await supabase
        .from("project_ratings")
        .insert([{ project_id: projectId, user_id: user.id, starred: true }]);
      if (error) {
        console.error("Error al dar like:", error);
        alert("No se pudo dar like.");
        return;
      }
      setHasStarred(true);
      setStarCount((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="#5865f2" />
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  const authorName = project.author_name || "Desconocido";

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Navbar ocupa todo el ancho */}
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-grow flex-col p-6 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col flex-grow">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>
          <p className="mt-2">
            <strong>Por </strong> {authorName}
          </p>
          {project.type && (
            <p className="mt-2">
              <strong>Categoría:</strong> {project.type}
            </p>
          )}
          {project.tech_stack && (
            <p className="mt-2">
              <strong>Stack tecnológico:</strong>{" "}
              {project.tech_stack.join(", ")}
            </p>
          )}

          {/* Mostrar el repositorio de GitHub solo si el usuario es miembro */}
          {isMember && project.github_repository && (
            <p className="mt-2">
              <strong>Repositorio de GitHub:</strong>{" "}
              <a
                href={project.github_repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5865f2] underline"
              >
                {project.github_repository}
              </a>
            </p>
          )}

          {isMember ? (
            <div className="mt-6 flex items-center">
              <FaStar size={32} className="text-[#acd916]" />
              <p className="ml-2 text-lg font-bold">
                {starCount} usuarios han dado estrella
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Valora este proyecto:</h3>
              <div className="flex mt-2">
                <motion.div
                  animate={{ scale: hasStarred ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaStar
                    size={32}
                    className={`cursor-pointer transition-all ${
                      hasStarred ? "text-[#acd916]" : "text-gray-300"
                    }`}
                    onClick={toggleStar}
                  />
                </motion.div>
              </div>
              <p className="mt-4">
                <strong>{starCount}</strong> usuario{starCount !== 1 ? "s" : ""} han marcado este proyecto.
              </p>
              {showConfetti && <Confetti numberOfPieces={100} gravity={0.8} initialVelocityY={10} tweenDuration={1000} recycle={false} />}
            </div>
          )}

          {/* Sección de Aplicación */}
          <div className="mt-6">
            {user ? (
              applicationStatus ? (
                <p
                  className={
                    applicationStatus === "PENDING"
                      ? "text-[#4752C4] font-semibold !important"
                      : applicationStatus === "ACCEPTED"
                        ? "text-[#88b000] font-semibold"
                        : "text-red-600 font-semibold !important"
                  }
                >
                  {applicationStatus === "PENDING"
                    ? "Tu solicitud está pendiente... ¡Crucemos los dedos!"
                    : applicationStatus === "ACCEPTED"
                      ? ""
                      : "Tu solicitud ha sido rechazada. ¡Ellos se lo pierden!"}
                </p>
              ) : (
                <Link
                  href={`/dashboard/projects/other/application?projectId=${project.id}`}
                  className="other-custom-btn"
                >
                  Aplicar
                </Link>
              )
            ) : (
              <p className="text-gray-500">Inicia sesión para aplicar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
