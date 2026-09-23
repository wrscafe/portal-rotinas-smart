// src/app/abastecimentos/[id]/editar/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AbastecimentoForm } from "@/components/abastecimentos/AbastecimentoForm";
import { atualizarAbastecimento } from "@/services/abastecimentoService";
import { Abastecimento } from "@/types/abastecimento";

export default function EditarAbastecimentoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [abastecimento, setAbastecimento] = useState<Abastecimento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarDados() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("abastecimentos")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErro("Não foi possível carregar este abastecimento.");
      } else {
        setAbastecimento(data);
      }

      setCarregando(false);
    }

    buscarDados();
  }, [id]);

  async function handleSalvar(dados: {
    veiculo_id: string;
    data: string;
    litros: number;
    km: number;
    posto: string;
    aditivo_ml: number;
  }) {
    return atualizarAbastecimento(id, dados);
  }

  if (carregando) {
    return <div className="p-6">Carregando...</div>;
  }

  if (erro || !abastecimento) {
    return (
      <div className="p-6">
        <p className="text-red-600">{erro ?? "Abastecimento não encontrado."}</p>
        <button
          onClick={() => router.push("/abastecimentos")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Voltar para a listagem
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Editar Abastecimento
      </h1>

      <AbastecimentoForm
        valoresIniciais={{
          veiculoId: abastecimento.veiculo_id,
          data: abastecimento.data,
          litros: String(abastecimento.litros),
          km: String(abastecimento.km),
          fornecedor: abastecimento.posto,
        }}
        aoSalvar={handleSalvar}
        textoBotaoSalvar="Atualizar"
      />
    </div>
  );
}
