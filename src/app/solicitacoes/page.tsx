import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Solicitacao } from "@/types/solicitacao";

type SolicitacaoComCriador = Solicitacao & {
  usuarios: { nome: string } | null;
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pendente: "bg-yellow-100 text-yellow-800",
    "Em andamento": "bg-blue-100 text-blue-800",
    Concluída: "bg-green-100 text-green-800",
    Rejeitada: "bg-red-100 text-red-800",
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
    Baixa: "bg-gray-100 text-gray-700",
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

export default async function SolicitacoesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("solicitacoes")
    .select(
      `
      *,
      usuarios:solicitacoes_criado_por_fkey ( nome )
    `
    )
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar solicitações:", error);
  }

  const solicitacoes = (data ?? []) as unknown as SolicitacaoComCriador[];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Solicitações</h1>
        <Link
          href="/solicitacoes/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Nova Solicitação
        </Link>
      </div>

      {solicitacoes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          Nenhuma solicitação encontrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solicitacoes.map((s) => {
            const dataFormatada = new Date(s.criado_em).toLocaleString(
              "pt-BR",
              { dateStyle: "short", timeStyle: "short" }
            );

            const equipamentoLabel =
              s.equipamento === "Outros" && s.equipamento_outros
                ? s.equipamento_outros
                : s.equipamento;

            return (
              <Link
                key={s.id}
                href={`/solicitacoes/${s.id}`}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition block"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {equipamentoLabel}
                  </span>
                  <StatusBadge status={s.status} />
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {s.descricao}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{s.usuarios?.nome ?? "Desconhecido"}</span>
                  <PrioridadeBadge prioridade={s.prioridade} />
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  {dataFormatada}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
