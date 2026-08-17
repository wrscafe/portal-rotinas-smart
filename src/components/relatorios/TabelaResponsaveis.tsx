interface ResponsavelResumo {
  nome: string;
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
}

interface TabelaResponsaveisProps {
  dados: ResponsavelResumo[];
}

export default function TabelaResponsaveis({ dados }: TabelaResponsaveisProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Atividades por Responsável
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4">Responsável</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Pendentes</th>
              <th className="py-2 pr-4">Em Andamento</th>
              <th className="py-2 pr-4">Concluídas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((r) => (
              <tr key={r.nome} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 pr-4 font-medium text-gray-900">{r.nome}</td>
                <td className="py-2 pr-4">{r.total}</td>
                <td className="py-2 pr-4 text-yellow-600">{r.pendentes}</td>
                <td className="py-2 pr-4 text-blue-600">{r.emAndamento}</td>
                <td className="py-2 pr-4 text-green-600">{r.concluidas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
