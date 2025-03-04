"use client";

export default function OtherProjectFilter({
  categoryFilter,
  setCategoryFilter,
  techStackFilter,
  setTechStackFilter,
  keywordFilter,
  setKeywordFilter,
  isFilterOpen,
}: {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  techStackFilter: string;
  setTechStackFilter: (value: string) => void;
  keywordFilter: string;
  setKeywordFilter: (value: string) => void;
  isFilterOpen: boolean;
}) {
  return (
    <div
      className={`w-full md:w-1/5 p-4 border-b md:border-r border-gray-300 ${
        isFilterOpen ? "block" : "hidden md:block"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
        Filtros
      </h2>

      {/* Filtro por Palabra Clave */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Palabra clave</label>
        <input
          type="text"
          placeholder="Ej: Nombre de proyecto..."
          className="w-full border rounded px-3 py-2"
          value={keywordFilter}
          onChange={(e) => setKeywordFilter(e.target.value)}
        />
      </div>

      {/* Filtro por Categoría */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="WEB/DESKTOP">Web/Desktop</option>
          <option value="MOBILE">Mobile</option>
          <option value="EMBEDDED">Embedded</option>
          <option value="VIDEOGAME">Videojuego</option>
          <option value="BD/IA/ML">BD/IA/ML</option>
          <option value="CYBERSECURITY">Ciberseguridad</option>
          <option value="SCRIPTING/SCRAPING">Scripting/Scraping</option>
        </select>
      </div>

      {/* Filtro por Tecnología */}
      <div>
        <label className="block text-sm font-medium mb-1">Tecnología</label>
        <input
          type="text"
          placeholder="Ej: React, Python..."
          className="w-full border rounded px-3 py-2"
          value={techStackFilter}
          onChange={(e) => setTechStackFilter(e.target.value)}
        />
      </div>
    </div>
  );
}
