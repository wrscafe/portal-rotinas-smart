import StatCard from "@/components/StatCard";

export default function Home() {
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
          value={12}
          icon="📋"
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          title="Concluídas Hoje"
          value={5}
          icon="✅"
          color="bg-green-100 text-green-700"
        />
        <StatCard
          title="Solicitações Abertas"
          value={3}
          icon="📨"
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="PTs em Andamento"
          value={2}
          icon="🔧"
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Atividades Recentes
        </h2>
        <p className="text-gray-500">
          Nenhuma atividade recente. Comece criando uma nova atividade!
        </p>
      </div>
    </div>
  );
}
