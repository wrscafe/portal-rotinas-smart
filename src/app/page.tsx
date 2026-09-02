import StatCard from "@/components/StatCard";
import { createClient } from "@/lib/supabase/server";
import { Atividade } from "@/types/atividade";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // Busca as 5 atividades mais recentes
  const { data: atividadesRecentes } = await supabase
    .from("atividades")
    .select("*")
    .order("data_criacao", { ascending: false })
    .limit(5);

  const atividades = (atividadesRecentes ?? []) as Atividade[];

  // Conta atividades pendentes
  const { count: pendentes } = await supabase
    .from("atividades")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pendente");

  // Conta atividades concluídas hoje
  const hoje = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
  const { count: concluidasHoje } = await supabase
    .from("atividades")
    .select("*", { count: "exact", head: true })
    .eq("status", "Concluída")
    .gte("data_atualizacao", `${hoje}T00:00:00`)
    .lte("data_atualizacao", `${hoje}T23:59:59`);

  // Conta PTs abertas
  const { count: ptsAbertas } = await supabase
    .from("pts")
    .select("*", { count: "exact", head: true })
    .eq("status", "Aberta");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao Portal Rotinas Smart, Wagner!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Atividades Pendentes"
          value={pendentes ?? 0}
          icon="📋"
          color="bg-yellow-100 text-yellow-700"
          href="/atividades"
        />
        <StatCard
          title="Concluídas Hoje"
          value={concluidasHoje ?? 0}
          icon="✅"
          color="bg-green-100 text-green-700"
          href="/atividades"
        />
        <StatCard
          title="Solicitações Abertas"
          value={0}
          icon="📨"
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="PTs em Andamento"
          value={ptsAbertas ?? 0}
          icon="🔧"
          color="bg-purple-100 text-purple-700"
          href="/pt"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Atividades Recentes
        </h2>

        {atividades.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma atividade recente. Comece criando uma nova atividade!
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {atividades.map((atividade) => (
              <li key={atividade.id} className="py-3">
                <Link
                  href={`/atividades/${atividade.id}/editar`}
                  className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {atividade.titulo}
                    </p>
                    <p className="text-sm text-gray-500">
                      Responsável: {atividade.responsavel ?? "Não definido"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      atividade.status === "Concluída"
                        ? "bg-green-100 text-green-700"
                        : atividade.status === "Em Andamento"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {atividade.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
