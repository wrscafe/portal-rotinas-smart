import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Solicitacao } from "@/types/solicitacao";
import EditarSolicitacaoForm from "./EditarSolicitacaoForm";
import { atualizarSolicitacao, excluirSolicitacao } from "./actions";

type SolicitacaoComUsuarios = Solicitacao & {
  criador: { nome: string } | null;
  respondente: { nome: string } | null;
};

export default async function DetalheSolicitacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("solicitacoes")
    .select(
      `
      *,
      criador:solicitacoes_criado_por_fkey ( nome ),
      respondente:solicitacoes_respondido_por_fkey ( nome )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const s = data as unknown as SolicitacaoComUsuarios;

  const equipamentoLabel =
    s.equipamento === "Outros" && s.equipamento_outros
      ? s.equipamento_outros
      : s.equipamento;

  // Vincula o "id" às Server Actions antes de passar para o Client Component
  const atualizarComId = atualizarSolicitacao.bind(null, id);
  const excluirComId = excluirSolicitacao.bind(null, id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        href="/solicitacoes"
        className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block"
      >
        ← Voltar para solicitações
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {equipamentoLabel}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Criada por {s.criador?.nome ?? "Desconhecido"} em{" "}
          {new Date(s.criado_em).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500 block">Prioridade</span>
            <span className="font-medium text-gray-900">{s.prioridade}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Status atual</span>
            <span className="font-medium text-gray-900">{s.status}</span>
          </div>
        </div>

        <div>
          <span className="text-gray-500 text-sm block mb-1">Descrição</span>
          <p className="text-gray-800 whitespace-pre-wrap">{s.descricao}</p>
        </div>

        {s.respondido_em && (
          <p className="text-xs text-gray-400 mt-4">
            Respondida por {s.respondente?.nome ?? "—"} em{" "}
            {new Date(s.respondido_em).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      <EditarSolicitacaoForm
        solicitacao={s}
        onAtualizar={atualizarComId}
        onExcluir={excluirComId}
      />
    </div>
  );
}
