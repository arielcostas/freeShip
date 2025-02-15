"use client"; // Importante: esta línea convierte este componente en un Client Component

import { useState } from "react";
import Footer from "@/app/(site)/Footer";
import HeroSection from "@/app/(site)/Hero";

// Importar los formularios de Login y Register
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";

export default function Home() {
  // Estado para controlar qué formulario mostrar
  const [isLogin, setIsLogin] = useState(true); // true para mostrar Login, false para mostrar Register

  return (
    <div className="bg-[#212121]">
      <HeroSection />

      {/* Sección de login o registro */}
      <section className="flex justify-center items-center py-12 bg-[#f9f9f9]">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {isLogin ? "¡Hola!" : "Crea tu cuenta"}
          </h2>

          {/* Mostrar formulario dependiendo del estado */}
          {isLogin ? (
            <>
              <p className="text-center mb-4 text-lg">
                {`¿Ya tienes una cuenta?`}
              </p>
              <div className="mb-6">
                <LoginForm />
              </div>
            </>
          ) : (
            <>
              <p className="text-center mb-4 text-lg">
                {`¡Regístrate para empezar!`}
              </p>
              <div className="mb-6">
                <RegisterForm />
              </div>
            </>
          )}

          {/* Alternar entre Login y Register */}
          <div className="text-center mb-4">
            <span>
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </span>
            <button
              className="text-blue-500 hover:underline ml-2"
              onClick={() => setIsLogin(!isLogin)} // Cambiar el estado entre login y register
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}{" "}
              {/* Cambiar texto según el estado */}
            </button>
          </div>

          {/* Botón de Google

          <p className="text-center text-sm text-gray-500">
            Or sign in using your Google account
          </p>

          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-400"
              onClick={() => alert("Redirecting to Google Sign-in...")} // Implementa el método de Google Sign-in
            >
              Sign in with Google
            </button>
          </div>
          */}
        </div>
      </section>
      {/*
      <FeaturedTime />
      <MakerIntro />
      <PricingSection />
      <FAQ />
      <TestimonialsPage />
      <CTA />
      */}
      <Footer />
    </div>
  );
}
