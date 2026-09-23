"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcularAditivoMl } from "@/utils/aditivo";

interface Veiculo {
  id: string;
  nome: string;
}

// Dados que o formulário manipula (iguais para criar e editar)
export interface DadosFormAbastecimento {
  veiculoId: string;
  data: string;
  litros: string;
  km: string;
  fornecedor: string;
}

interface Props {
  valoresIniciais?: DadosFormAbastecimento;
  aoSalvar: (dados: {
    veiculo_id: string;
    data: string;
    litros: number;
    km: number;
    posto: string;
    aditivo_ml: number;
  }) => Promise<{ error: { message: string } | null }>;
  textoBotaoSalvar?: string;
}

const valoresPadrao: DadosFormAbastecimento = {
  veiculoId: "",
  data: "",
  litros: "",
  km: "",
  fornecedor: "",
};

export function AbastecimentoForm({
  valoresIniciais = valoresPadrao,
  aoSalvar,
  textoBotaoSalvar = "Salvar",
}: Props) {
  const router = useRouter();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [veiculoId, setVeiculoId] = useState(valoresIniciais.veiculoId);
  const [data, setData] = useState(valoresIniciais.data);
  const [litros, setLitros] = useState(valoresIniciais.litros);
  const [km, setKm] = useState(valoresIniciais.km);
  const [fornecedor, setFornecedor] = useState(valoresIniciais.fornecedor);

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

    setCarregando(true);
    setErro(null);

    const litrosNumero = Number(litros);

    const { error } = await aoSalvar({
      veiculo_id: veiculoId,
      data,
      litros: litrosNumero,
      km: Number(km),
      posto: fornecedor,
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
    <div>
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
            {carregando ? "Salvando..." : textoBotaoSalvar}
          </button>
        </div>
      </form>
    </div>
  );
}
