"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Nuevo estado para mensajes
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Reiniciar mensaje

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Error registering:", error.message);
      setMessage("Error: " + error.message);
    } else {
      setMessage(
        "Se ha enviado un correo de confirmación. Verifica tu email antes de iniciar sesión."
      );
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
