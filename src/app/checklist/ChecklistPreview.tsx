// src/components/checklist/ChecklistPreview.tsx
import { ChecklistViatura } from "@/types/checklist";

function getStatusStyle(status: string) {
  if (status === "Retida") return "bg-red-100 text-red-800";
  if (status === "Liberada com Ressalva") return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase bg-gray-100 px-3 py-2 rounded-t-md">
        {titulo}
      </h3>
      <div className="border border-gray-200 rounded-b-md p-4 space-y-1 text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}

export default function ChecklistPreview({ checklist }: { checklist: ChecklistViatura }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900">CHECKLIST DE VIATURA</h2>
          <p className="text-xs text-gray-500">Relatório Diário</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(checklist.status_geral)}`}>
          {checklist.status_geral}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Nº Relatório: #{checklist.data.replace(/-/g, "")}-{checklist.viatura}
      </p>

      <Secao titulo="Dados Gerais">
        <p>Data: {new Date(checklist.data).toLocaleDateString("pt-BR")} — Hora: {checklist.hora} — Turno: {checklist.turno}</p>
        <p>Viatura: {checklist.viatura} — Motorista: {checklist.motorista}</p>
        <p>Quilometragem: {checklist.quilometragem} km</p>
      </Secao>

      <Secao titulo="Níveis">
        {checklist.niveis.map((n, i) => (
          <p key={i}>
            {n.status === "OK" ? "✅" : "⚠️"} {n.nome}: {n.status} {n.observacao ? `— ${n.observacao}` : ""}
          </p>
        ))}
      </Secao>

      <Secao titulo="Luzes Dianteiras">
        {checklist.luzes_dianteiras.map((l, i) => (
          <p key={i}>{l.funcionando ? "✅" : "❌"} {l.nome}: {l.funcionando ? "Funcionando" : "Não Funciona"}</p>
        ))}
      </Secao>

      <Secao titulo="Luzes Traseiras">
        {checklist.luzes_traseiras.map((l, i) => (
          <p key={i}>{l.funcionando ? "✅" : "❌"} {l.nome}: {l.funcionando ? "Funcionando" : "Não Funciona"}</p>
        ))}
      </Secao>

      <Secao titulo="Verificações Adicionais">
        <p>Avaria Externa: {checklist.avaria_externa}</p>
        {checklist.avaria_descricao && <p>Detalhe: {checklist.avaria_descricao}</p>}
        <p>Alerta no Painel: {checklist.alerta_painel}</p>
        <p>Pneus: {checklist.pneus}</p>
        <p>Cabine: {checklist.cabine}</p>
      </Secao>

      {checklist.observacoes && (
        <Secao titulo="Observações Gerais">
          <p>{checklist.observacoes}</p>
        </Secao>
      )}
    </div>
  );
}
