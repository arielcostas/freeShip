import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/app/(site)/Navbar";
import { FaGithub } from "react-icons/fa";
import { redirect } from "next/navigation";

interface ProfileData {
  username: string;
  discord_username: string;
  email: string;
  about_me: string;
}

// Componente Spinner sencillo
function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <svg
        className="animate-spin h-8 w-8 text-[#acd916]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>
  );
}

export default function MyProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    discord_username: "",
    email: "",
    about_me: "",
  });
  const [loading, setLoading] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingAboutMe, setEditingAboutMe] = useState(false);
  const supabase = createClient();

  // Ref para el textarea y auto ajuste de altura
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({ ...profile, about_me: e.target.value });
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // Obtenemos el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No hay usuario logueado");
        setLoading(false);
        return;
      }

      const email = user.email;

      // Revisamos si el usuario tiene vinculada una identidad de GitHub
      const identities = user.identities || [];
      const githubIdentity = identities.find(
        (identity: any) => identity.provider === "github"
      );
      if (githubIdentity) {
        setGithubConnected(true);
        setGithubUsername(githubIdentity.identity_data?.login || "GitHub User");
      }

      // Obtenemos datos de la tabla profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("username, discord_username, about_me")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error al obtener el perfil:", error);
      } else if (data) {
        setProfile({
          username: data.username,
          discord_username: data.discord_username || "",
          email,
          about_me: data.about_me || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  useEffect(() => {
    if (editingAboutMe && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editingAboutMe, profile.about_me]);

  // Función para conectar GitHub
  const handleConnectGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) {
      console.error("Error al conectar con GitHub:", error);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  // Función para guardar la descripción
  const handleSaveDescription = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("No hay usuario logueado");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ about_me: profile.about_me })
      .eq("id", user.id);
    if (error) {
      console.error("Error al actualizar la descripción:", error);
    } else {
      setEditingAboutMe(false);
    }
    setSaving(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar
        handleSignOut={handleSignOut} className="bg-white shadow-md"
      />
      <div className="p-4 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">Mis datos de perfil</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            readOnly
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {profile.discord_username && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Discord Username
            </label>
            <input
              type="text"
              value={profile.discord_username}
              readOnly
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={profile.email}
            readOnly
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Sección para describirse */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Acerca de mí</label>
          {editingAboutMe ? (
            <>
              <textarea
                ref={textareaRef}
                value={profile.about_me}
                onChange={handleTextareaChange}
                placeholder="Experiencia, conocimientos, intereses, expectativas..."
                maxLength={1000}
                rows={1} // Comenzamos con 1 fila y se ajusta automáticamente
                className="w-full border rounded-md px-3 py-2 resize-none overflow-hidden"
              />
              <p className="text-xs text-gray-500 text-right">
                {profile.about_me.length}/1000
              </p>
              <button
                onClick={handleSaveDescription}
                disabled={saving}
                className="custom-btn mt-2"
              >
                {saving ? "Guardando..." : "Guardar descripción"}
              </button>
            </>
          ) : (
            <>
              {profile.about_me ? (
                <div className="w-full border rounded-md px-3 py-2">
                  <p>{profile.about_me}</p>
                </div>
              ) : (
                <p className="text-gray-500">No has escrito nada sobre ti.</p>
              )}
              <button
                onClick={() => setEditingAboutMe(true)}
                className="custom-btn mt-2"
              >
                {profile.about_me ? "Editar descripción" : "Escribir sobre mí"}
              </button>
            </>
          )}
        </div>

        {/* Sección para vincular la cuenta de GitHub */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">GitHub</label>
          {githubConnected ? (
            <div className="flex items-center">
              <span className="mr-2">
                Conectado como <strong>{githubUsername}</strong>
              </span>
              <span
                className="w-3 h-3 bg-[#acd916] rounded-full"
                title="Conectado"
              ></span>
            </div>
          ) : (
            <button
              onClick={handleConnectGithub}
              className="bg-[#5865F2] text-white px-3 py-1 rounded flex items-center gap-2"
            >
              Vincular cuenta de GitHub
              <FaGithub size={20} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
