// src/app/abastecimentos/page.tsx
import { createClient } from "@/lib/supabase/server";
import { AbastecimentoComVeiculo } from "@/types/abastecimento";
import { LinhaAbastecimento } from "@/components/abastecimentos/LinhaAbastecimento";
import Link from "next/link";

// Retorna a data (YYYY-MM-DD) no fuso de São Paulo, usada como chave de agrupamento
function chaveDataSaoPaulo(dataISO: string) {
  return new Date(dataISO).toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
}

// Formata a data para exibição no título da seção (ex: "23 de setembro de 2026")
function formatarDataSecao(chave: string) {
  return new Date(`${chave}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Agrupa os abastecimentos por dia
function agruparPorData(lista: AbastecimentoComVeiculo[]) {
  const grupos: Record<string, AbastecimentoComVeiculo[]> = {};

  for (const item of lista) {
    const chave = chaveDataSaoPaulo(item.data);
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(item);
  }

  return grupos;
}

export default async function AbastecimentosPage() {
  const supabase = await createClient();

  // O "viaturas_equipamentos(nome)" faz o join, trazendo o nome do veículo junto
  const { data: abastecimentos } = await supabase
    .from("abastecimentos")
    .select("*, viaturas_equipamentos(nome)")
    .order("data", { ascending: false });

  const lista = (abastecimentos ?? []) as AbastecimentoComVeiculo[];
  const grupos = agruparPorData(lista);
  const datasOrdenadas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Abastecimentos</h1>
          <p className="text-gray-500 mt-1">
            Histórico de abastecimento das viaturas e equipamentos
          </p>
        </div>
        <Link
          href="/abastecimentos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Novo Abastecimento
        </Link>
      </div>

      {datasOrdenadas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">
            Nenhum abastecimento cadastrado ainda.
          </p>
        </div>
      ) : (
        datasOrdenadas.map((data) => (
          <div key={data} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
              {formatarDataSecao(data)}
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Veículo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Litros</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">KM</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Posto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grupos[data].map((item) => (
                    <LinhaAbastecimento key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
