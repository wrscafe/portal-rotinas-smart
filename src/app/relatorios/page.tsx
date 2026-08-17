import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/StatCard";
import GraficoStatus from "@/components/relatorios/GraficoStatus";
import GraficoPrioridade from "@/components/relatorios/GraficoPrioridade";
import TabelaResponsaveis from "@/components/relatorios/TabelaResponsaveis";
import FiltroPeriodo from "@/components/relatorios/FiltroPeriodo";
import BotaoExportarPDF from "@/components/relatorios/BotaoExportarPDF";

interface RelatoriosPageProps {
  searchParams: Promise<{ inicio?: string; fim?: string }>;
}

export default async function RelatoriosPage({ searchParams }: RelatoriosPageProps) {
  const { inicio, fim } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from("atividades")
    .select("titulo, descricao, status, prioridade, responsavel, data_criacao");

  if (inicio) {
    query = query.gte("data_criacao", `${inicio}T00:00:00`);
  }
  if (fim) {
    query = query.lte("data_criacao", `${fim}T23:59:59`);
  }

  const { data: atividades, error } = await query;

  if (error) {
    return <p className="p-6 text-red-600">Erro ao carregar relatórios.</p>;
  }

  const total = atividades?.length ?? 0;
  const pendentes = atividades?.filter((a) => a.status === "Pendente").length ?? 0;
  const emAndamento = atividades?.filter((a) => a.status === "Em Andamento").length ?? 0;
  const concluidas = atividades?.filter((a) => a.status === "Concluída").length ?? 0;

  const dadosStatus = [
    { name: "Pendente", value: pendentes },
    { name: "Em Andamento", value: emAndamento },
    { name: "Concluída", value: concluidas },
  ];

  const prioridades = ["Baixa", "Média", "Alta"];
  const dadosPrioridade = prioridades.map((p) => ({
    name: p,
    total: atividades?.filter((a) => a.prioridade === p).length ?? 0,
  }));

  const nomesUnicos = Array.from(
    new Set(atividades?.map((a) => a.responsavel).filter(Boolean))
  );

  const dadosResponsaveis = nomesUnicos.map((nome) => {
    const doResponsavel = atividades?.filter((a) => a.responsavel === nome) ?? [];
    return {
      nome: nome as string,
      total: doResponsavel.length,
      pendentes: doResponsavel.filter((a) => a.status === "Pendente").length,
      emAndamento: doResponsavel.filter((a) => a.status === "Em Andamento").length,
      concluidas: doResponsavel.filter((a) => a.status === "Concluída").length,
    };
  });

  const periodoTexto =
    inicio && fim
      ? `${inicio.split("-").reverse().join("/")} até ${fim.split("-").reverse().join("/")}`
      : "Todas as atividades";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <BotaoExportarPDF
          periodo={periodoTexto}
          total={total}
          pendentes={pendentes}
          emAndamento={emAndamento}
          concluidas={concluidas}
          dadosResponsaveis={dadosResponsaveis}
          atividades={atividades ?? []}
        />
      </div>

      <FiltroPeriodo />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total de Atividades" value={total} icon="📋" color="bg-gray-100 text-gray-700" />
        <StatCard title="Pendentes" value={pendentes} icon="⏳" color="bg-yellow-100 text-yellow-700" />
        <StatCard title="Em Andamento" value={emAndamento} icon="🔄" color="bg-blue-100 text-blue-700" />
        <StatCard title="Concluídas" value={concluidas} icon="✅" color="bg-green-100 text-green-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraficoStatus dados={dadosStatus} />
        <GraficoPrioridade dados={dadosPrioridade} />
      </div>

      <TabelaResponsaveis dados={dadosResponsaveis} />
    </div>
  );
}
