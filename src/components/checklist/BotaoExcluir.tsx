"use client";

import { useState } from "react";
import { deleteChecklist } from "@/app/checklist/[id]/actions";

export default function BotaoExcluir({ id }: { id: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleExcluir() {
    setCarregando(true);
    try {
      await deleteChecklist(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao excluir");
      setCarregando(false);
      setConfirmando(false);
    }
  }

  if (confirmando) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExcluir}
          disabled={carregando}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {carregando ? "Excluindo..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={carregando}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50"
    >
      Excluir
    </button>
  );
}
