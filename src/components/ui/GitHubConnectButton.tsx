"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function GitHubConnectButton() {
  const { data: session } = useSession();

  const handleGitHubAuth = async () => {
    if (session) {
      // Si el usuario ya está autenticado, aquí podrías hacer algo más.
      alert("Ya estás vinculado con GitHub.");
    } else {
      signIn("github"); // Inicia sesión con GitHub
    }
  };

  return (
    <button
      onClick={handleGitHubAuth}
      className="bg-[#4078c0] text-white px-4 py-2 rounded-md hover:bg-[#3877c8] transition-colors"
    >
      {session ? "GitHub Vinculado" : "Vincular con GitHub"}
    </button>
  );
}
