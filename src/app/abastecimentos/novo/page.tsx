// src/app/abastecimentos/novo/page.tsx
"use client";

import { AbastecimentoForm } from "@/components/abastecimentos/AbastecimentoForm";
import { criarAbastecimento } from "@/services/abastecimentoService";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";

export default function NovoAbastecimentoPage() {
  const { usuario } = useUsuarioLogado();

  async function handleSalvar(dados: {
    veiculo_id: string;
    data: string;
    litros: number;
    km: number;
    posto: string;
    aditivo_ml: number;
  }) {
    if (!usuario) {
      return { error: { message: "Usuário não identificado. Faça login novamente." } };
    }

    return criarAbastecimento({
      ...dados,
      responsavel_id: usuario.id,
    });
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Novo Abastecimento
      </h1>

      <AbastecimentoForm aoSalvar={handleSalvar} textoBotaoSalvar="Salvar" />
    </div>
  );
}
