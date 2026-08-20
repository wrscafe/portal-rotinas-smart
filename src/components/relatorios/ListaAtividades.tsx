interface Atividade {
  titulo: string;
  descricao: string | null;
  status: string;
  prioridade: string;
  responsavel: string | null;
  data_criacao: string;
}

interface ListaAtividadesProps {
  titulo: string;
  atividades: Atividade[];
}

const corPrioridade: Record<string, string> = {
  Baixa: "bg-gray-100 text-gray-700",
  Média: "bg-yellow-100 text-yellow-700",
  Alta: "bg-red-100 text-red-700",
};

const corStatus: Record<string, string> = {
  Pendente: "bg-yellow-100 text-yellow-700",
  "Em Andamento": "bg-blue-100 text-blue-700",
  Concluída: "bg-green-100 text-green-700",
};

export default function ListaAtividades({ titulo, atividades }: ListaAtividadesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {titulo} ({atividades.length})
      </h2>

      {atividades.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhuma atividade encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atividades.map((atividade, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{atividade.titulo}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                    corStatus[atividade.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {atividade.status}
                </span>
              </div>

              {atividade.descricao && (
                <p className="text-sm text-gray-600 mb-3">{atividade.descricao}</p>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    corPrioridade[atividade.prioridade] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {atividade.prioridade}
                </span>
                {atividade.responsavel && (
                  <span className="text-gray-500">👤 {atividade.responsavel}</span>
                )}
                <span className="text-gray-400 ml-auto">
                  {new Date(atividade.data_criacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
