"use client";

import { useTransition } from "react";
import { Solicitacao, StatusSolicitacao } from "@/types/solicitacao";

const STATUS_OPCOES: StatusSolicitacao[] = [
  "Pendente",
  "Em andamento",
  "Concluída",
  "Rejeitada",
];

export default function EditarSolicitacaoForm({
  solicitacao,
  onAtualizar,
  onExcluir,
}: {
  solicitacao: Solicitacao;
  onAtualizar: (formData: FormData) => Promise<void>;
  onExcluir: () => Promise<void>;
}) {
  const [salvando, startSalvar] = useTransition();
  const [excluindo, startExcluir] = useTransition();

  return (
    <div className="space-y-6">
      <form
        action={(formData: FormData) => startSalvar(() => onAtualizar(formData))}
        className="space-y-4 bg-white border border-gray-200 rounded-xl p-6"
      >
        <h2 className="text-sm font-semibold text-gray-700 uppercase mb-2">
          Atualizar Solicitação
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            defaultValue={solicitacao.status}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {STATUS_OPCOES.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resposta / Observação
          </label>
          <textarea
            name="resposta"
            defaultValue={solicitacao.resposta ?? ""}
            rows={4}
            placeholder="Escreva uma resposta ou observação sobre esta solicitação..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-red-700 uppercase mb-2">
          Zona de Perigo
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Excluir esta solicitação é permanente e não pode ser desfeito.
        </p>
        <button
          type="button"
          disabled={excluindo}
          onClick={() => {
            if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
              startExcluir(() => onExcluir());
            }
          }}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {excluindo ? "Excluindo..." : "Excluir solicitação"}
        </button>
      </div>
    </div>
  );
}
