// src/app/abastecimentos/novo/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { criarAbastecimento } from "@/services/abastecimentoService";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { calcularAditivoMl } from "@/utils/aditivo";

interface Veiculo {
  id: string;
  nome: string;
}

export default function NovoAbastecimentoPage() {
  const router = useRouter();
  const { usuario } = useUsuarioLogado();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [veiculoId, setVeiculoId] = useState("");
  const [data, setData] = useState("");
  const [litros, setLitros] = useState("");
  const [km, setKm] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  

  // Busca a lista de veículos para preencher o <select>
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("viaturas_equipamentos")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => {
        if (data) setVeiculos(data);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario) {
      setErro("Usuário não identificado. Faça login novamente.");
      return;
    }

    setCarregando(true);
    setErro(null);

        const litrosNumero = Number(litros);

    const { error } = await criarAbastecimento({
      veiculo_id: veiculoId,
      data,
      litros: litrosNumero,
      km: Number(km),
      posto: fornecedor,
      responsavel_id: usuario.id,
      aditivo_ml: calcularAditivoMl(litrosNumero),
    });


    setCarregando(false);

    if (error) {
      setErro("Erro ao salvar: " + error.message);
      return;
    }

    router.push("/abastecimentos");
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Novo Abastecimento
      </h1>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Veículo *
          </label>
          <select
            required
            value={veiculoId}
            onChange={(e) => setVeiculoId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            {veiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <input
            type="date"
            required
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Litros *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={litros}
              onChange={(e) => setLitros(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KM *
            </label>
            <input
              type="number"
              min="0"
              required
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fornecedor (caminhão-tanque) *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Nome da empresa/transportadora"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/abastecimentos")}
            className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={carregando}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
