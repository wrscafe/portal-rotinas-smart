"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { excluirAbastecimento } from "@/services/abastecimentoService";
import { AbastecimentoComVeiculo } from "@/types/abastecimento";

interface Props {
  item: AbastecimentoComVeiculo;
}

export function LinhaAbastecimento({ item }: Props) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este abastecimento? Esta ação não pode ser desfeita."
    );
    if (!confirmar) return;

    setExcluindo(true);
    const { error } = await excluirAbastecimento(item.id);
    setExcluindo(false);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    // Atualiza a lista na tela sem precisar recarregar a página manualmente
    router.refresh();
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-gray-900">
        <Link href={`/abastecimentos/${item.id}`} className="block">
          {item.viaturas_equipamentos?.nome ?? "—"}
        </Link>
      </td>
      <td className="px-4 py-3 text-gray-600">
        <Link href={`/abastecimentos/${item.id}`} className="block">
          {item.litros} L
        </Link>
      </td>
      <td className="px-4 py-3 text-gray-600">
        <Link href={`/abastecimentos/${item.id}`} className="block">
          {item.km} km
        </Link>
      </td>
      <td className="px-4 py-3 text-gray-600">
        <Link href={`/abastecimentos/${item.id}`} className="block">
          {item.posto}
        </Link>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            href={`/abastecimentos/${item.id}/editar`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Editar
          </Link>
          <button
            onClick={handleExcluir}
            disabled={excluindo}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </td>
    </tr>
  );
}
