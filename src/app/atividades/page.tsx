import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Atividade } from "@/types/atividade";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pendente: "bg-yellow-100 text-yellow-800",
    "Em Andamento": "bg-blue-100 text-blue-800",
    Concluída: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const styles: Record<string, string> = {
    Baixa: "bg-gray-100 text-gray-800",
    Média: "bg-orange-100 text-orange-800",
    Alta: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[prioridade] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {prioridade}
    </span>
  );
}

export default async function AtividadesPage() {
  const supabase = await createClient();

  const { data: atividades, error } = await supabase
    .from("atividades")
    .select("*")
    .order("data_criacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar atividades:", error);
  }

  const listaAtividades: Atividade[] = atividades ?? [];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atividades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as atividades do seu setor
          </p>
        </div>
        <Link
          href="/atividades/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nova Atividade
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data Prevista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listaAtividades.map((atividade) => (
              <tr key={atividade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {atividade.titulo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {atividade.responsavel}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={atividade.status} />
                </td>
                <td className="px-6 py-4">
                  <PrioridadeBadge prioridade={atividade.prioridade} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {atividade.data_prevista}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/atividades/${atividade.id}/editar`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
  );
}
