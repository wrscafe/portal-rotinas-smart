"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarProgramacao } from "@/services/programacaoService";
import { TipoProgramacao, StatusProgramacao } from "@/types/programacao";

export default function NovaProgramacaoPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoProgramacao>("Mecânica");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState<StatusProgramacao>("Programada");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    const { error } = await criarProgramacao({
      titulo,
      descricao: descricao || null,
      tipo,
      data_inicio: new Date(dataInicio).toISOString(),
      data_fim: dataFim ? new Date(dataFim).toISOString() : null,
      responsavel: responsavel || null,
      local: local || null,
      status,
      usuario_id: null, // vamos preencher com o usuário logado depois
    });

    setCarregando(false);

    if (error) {
      setErro("Erro ao salvar: " + error.message);
      return;
    }

    router.push("/programacao");
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Nova Programação
      </h1>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoProgramacao)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="Mecânica">Mecânica</option>
              <option value="Administrativa">Administrativa</option>
              <option value="Outra">Outra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusProgramacao)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="Programada">Programada</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluída">Concluída</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data/Hora Início *
            </label>
            <input
              type="datetime-local"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data/Hora Fim
            </label>
            <input
              type="datetime-local"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/programacao")}
            className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={carregando}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
