export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Links principales */}
        {/**
         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
         <div>
         <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
         🚀 Enlaces
         </h3>
         <ul className="space-y-3 text-sm">
         <li>
         <a href="#features" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         Características
         </a>
         </li>
         <li>
         <a href="#projects" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         Explorar proyectos
         </a>
         </li>
         <li>
         <a href="#community" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         Comunidad
         </a>
         </li>
         <li>
         <a href="https://github.com/bugoverflow" target="_blank" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         GitHub
         </a>
         </li>
         </ul>
         </div>

         <div>
         <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
         📜 Legal
         </h3>
         <ul className="space-y-3 text-sm">
         <li>
         <a href="/tos" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         Términos de Servicio
         </a>
         </li>
         <li>
         <a href="/privacy" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
         Política de Privacidad
         </a>
         </li>
         </ul>
         </div>

         <div>
         <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
         📩 Suscripción
         </h3>
         <p className="mb-4 text-sm text-[var(--text-tertiary)]">
         Recibe novedades y recursos para desarrolladores.
         </p>
         <form className="flex gap-2">
         <input
         type="email"
         placeholder="Tu email"
         className="flex-1 rounded-lg bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none ring-[var(--border-primary)] transition-shadow focus:ring-2"
         />
         <button type="submit" className="rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
         Suscribirse
         </button>
         </form>
         </div>
         </div>
         */}

        {/* Copyright */}
        <div className="mt-12 text-center text-sm text-[var(--text-tertiary)]">
          © 2025&nbsp;
          <a href="https://bugoverflow.netlify.app/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            bugoverflow
          </a>
          . Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
