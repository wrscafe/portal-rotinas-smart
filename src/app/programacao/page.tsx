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

export default async function ProgramacaoPage() {
  const supabase = await createClient();

  const { data: programacoes, error } = await supabase
    .from("programacao")
    .select("*")
    .order("data_inicio", { ascending: true });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Agenda de Programação
        </h1>
        <Link
          href="/programacao/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Nova Programação
        </Link>
      </div>

      {error && (
        <p className="text-red-600 mb-4">
          Erro ao carregar programações: {error.message}
        </p>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Data Início</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(programacoes as Programacao[] | null)?.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {p.titulo}
                </td>
                <td className="px-4 py-3">
                  <TipoBadge tipo={p.tipo} />
                </td>
                <td className="px-4 py-3">{p.responsavel ?? "-"}</td>
                <td className="px-4 py-3">
                  {new Date(p.data_inicio).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/programacao/${p.id}/editar`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {(!programacoes || programacoes.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhuma programação cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
