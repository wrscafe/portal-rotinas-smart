"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FiltroPeriodo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inicio, setInicio] = useState(searchParams.get("inicio") ?? "");
  const [fim, setFim] = useState(searchParams.get("fim") ?? "");

  function aplicarFiltro(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (inicio) params.set("inicio", inicio);
    if (fim) params.set("fim", fim);

    router.push(`/relatorios?${params.toString()}`);
  }

  function limparFiltro() {
    setInicio("");
    setFim("");
    router.push("/relatorios");
  }

  return (
    <form
      onSubmit={aplicarFiltro}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4"
    >
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Data inicial</label>
        <input
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Data final</label>
        <input
          type="date"
          value={fim}
          onChange={(e) => setFim(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Aplicar Filtro
      </button>

      <button
        type="button"
        onClick={limparFiltro}
        className="text-gray-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        Limpar
      </button>
    </form>
  );
}
