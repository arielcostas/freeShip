"use client"; // Importante: esta línea convierte este componente en un Client Component

import { useState, useRef } from "react";
import Footer from "@/app/(site)/Footer";
import HeroSection from "@/app/(site)/Hero";

// Importar los formularios de Login y Register
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";

export default function Home() {
  // Estado para controlar qué formulario mostrar
  const [isLogin, setIsLogin] = useState(true); // true para Login, false para Registro

  // Referencia a la sección de login
  const loginSectionRef = useRef(null);

  return (
    <div className="bg-[#212121]">
      {/* Sección Hero con scroll a login */}
      <HeroSection loginSectionRef={loginSectionRef} />

      {/* Sección de Login o Registro */}
      <section
        ref={loginSectionRef}
        className="flex justify-center items-center py-12 bg-white"
      >
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {isLogin ? "¡Hola!" : "Crea tu cuenta"}
          </h2>

          {/* Mensaje introductorio */}
          <p className="text-center mb-4 text-lg">
            {isLogin ? "¿Ya tienes una cuenta?" : "¡Regístrate para empezar!"}
          </p>

          {/* Mostrar formulario dependiendo del estado */}
          <div className="mb-6">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Alternar entre Login y Register */}
          <div className="text-center mb-4">
            <span>
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </span>
            <button
              className="text-blue-500 hover:underline ml-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>

          {/* Botón de Google (comentado hasta implementación) */}
          {/*
          <p className="text-center text-sm text-gray-500">
            O inicia sesión con tu cuenta de Google
          </p>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-400"
              onClick={() => alert("Redirecting to Google Sign-in...")}
            >
              Iniciar sesión con Google
            </button>
          </div>
          */}
        </div>
      </section>

      {/* Secciones adicionales (comentadas hasta implementación) */}
      {/*
      <FeaturedTime />
      <MakerIntro />
      <PricingSection />
      <FAQ />
      <TestimonialsPage />
      <CTA />
      */}

      {/* Pie de página */}
      <Footer />
    </div>
  );
}
