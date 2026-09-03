import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Programacao } from "@/types/programacao";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Programada: "bg-yellow-100 text-yellow-800",
    "Em andamento": "bg-blue-100 text-blue-800",
    Concluída: "bg-green-100 text-green-800",
    Cancelada: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const styles: Record<string, string> = {
    Mecânica: "bg-orange-100 text-orange-800",
    Administrativa: "bg-purple-100 text-purple-800",
    Outra: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[tipo] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {tipo}
    </span>
  );
}

// Retorna a data (YYYY-MM-DD) já no fuso de São Paulo, para servir de chave de agrupamento
function chaveDataSaoPaulo(dataISO: string) {
  // "en-CA" retorna no formato YYYY-MM-DD, que é ordenável como string
  return new Date(dataISO).toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
}

// Formata a data para exibição no título da seção (ex: "02 de setembro de 2026")
function formatarDataSecao(chave: string) {
  // Criamos a data ao meio-dia UTC só para evitar problemas de conversão na exibição do título
  return new Date(`${chave}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Agrupa as programações por dia (considerando o fuso de São Paulo)
function agruparPorData(programacoes: Programacao[]) {
  const grupos: Record<string, Programacao[]> = {};

  for (const programacao of programacoes) {
    const chave = chaveDataSaoPaulo(programacao.data_inicio);

    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(programacao);
  }

  return grupos;
}

export default async function ProgramacaoPage() {
  const supabase = await createClient();

  const { data: programacoes, error } = await supabase
    .from("programacao")
    .select("*")
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar programações:", error);
  }

  const listaProgramacoes: Programacao[] = programacoes ?? [];
  const grupos = agruparPorData(listaProgramacoes);
  const datasOrdenadas = Object.keys(grupos).sort((a, b) => a.localeCompare(b));

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agenda de Programação
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e gerencie as programações por dia
          </p>
        </div>
        <Link
          href="/programacao/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nova Programação
        </Link>
      </div>

      {error && (
        <p className="text-red-600 mb-4">
          Erro ao carregar programações: {error.message}
        </p>
      )}

      {datasOrdenadas.map((data) => (
        <div key={data} className="mb-8">
          {/* Título da seção com a data */}
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            {formatarDataSecao(data)}
          </h2>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Responsável</th>
                  <th className="px-6 py-3">Horário</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grupos[data].map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {p.titulo}
                    </td>
                    <td className="px-6 py-4">
                      <TipoBadge tipo={p.tipo} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {p.responsavel ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(p.data_inicio).toLocaleTimeString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/programacao/${p.id}/editar`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {datasOrdenadas.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhuma programação cadastrada.
        </p>
      )}
    </div>
  );
}
