import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/utils/seo";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState(""); // Puede ser username o email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    let email = identifier;

    // Si el usuario ha introducido un username en lugar de un email
    if (!identifier.includes("@")) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", identifier)
        .single();

      if (error || !data) {
        setMessage("Nombre de usuario no encontrado.");
        return;
      }

      // Obtener el email asociado al user id en la tabla auth.users
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("email")
        .eq("id", data.id)
        .single(); // Debemos usar `.single()` para obtener un solo resultado

      if (userError || !userData) {
        setMessage("Error al obtener los datos del usuario.");
        return;
      }

      email = userData.email; // Usamos el email obtenido de auth.users
    }

    // Intentar iniciar sesión con el email obtenido
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("Credenciales incorrectas.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.includes("@")) {
      setMessage("Para el Magic Link, introduce un email.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email: identifier });
    if (error) {
      setMessage("Error enviando Magic Link.");
    } else {
      alert("Revisa tu email para acceder.");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage("Error al iniciar sesión con Google.");
    }
  };

  return (
    <>
      <SEO
        title="My SaaS Boilerplate"
        description="A Next.js TypeScript Login form."
        canonicalUrl="https://yourdomain.com"
        ogImageUrl="https://yourdomain.com/og-image.png"
        twitterHandle="yourtwitterhandle"
      />
      <div className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Correo electrónico o Nombre de usuario</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        {message && <p className="text-center text-sm text-red-500">{message}</p>}

        <div className="flex flex-col space-y-4">
          <Button onClick={handleMagicLink} variant="outline" className="w-full">
            Enviar Magic Link
          </Button>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
            Iniciar sesión con Google
          </Button>
        </div>
      </div>
    </>
  );
}
