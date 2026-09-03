"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  buscarProgramacaoPorId,
  atualizarProgramacao,
  excluirProgramacao,
} from "@/services/programacaoService";
import { TipoProgramacao, StatusProgramacao } from "@/types/programacao";

export default function EditarProgramacaoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoProgramacao>("Mecânica");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState<StatusProgramacao>("Programada");

  // Converte ISO string (do banco) para o formato aceito pelo input datetime-local
  function formatarParaInput(isoString: string | null) {
    if (!isoString) return "";
    const data = new Date(isoString);
    const offset = data.getTimezoneOffset();
    const dataLocal = new Date(data.getTime() - offset * 60 * 1000);
    return dataLocal.toISOString().slice(0, 16);
  }

  useEffect(() => {
    async function carregar() {
      const { data, error } = await buscarProgramacaoPorId(id);

      if (error || !data) {
        setErro("Programação não encontrada.");
        setCarregandoDados(false);
        return;
      }

      setTitulo(data.titulo);
      setDescricao(data.descricao ?? "");
      setTipo(data.tipo);
      setDataInicio(formatarParaInput(data.data_inicio));
      setDataFim(formatarParaInput(data.data_fim));
      setResponsavel(data.responsavel ?? "");
      setLocal(data.local ?? "");
      setStatus(data.status);
      setCarregandoDados(false);
    }

    carregar();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    const { error } = await atualizarProgramacao(id, {
      titulo,
      descricao: descricao || null,
      tipo,
      data_inicio: new Date(dataInicio).toISOString(),
      data_fim: dataFim ? new Date(dataFim).toISOString() : null,
      responsavel: responsavel || null,
      local: local || null,
      status,
    });

    setSalvando(false);

    if (error) {
      setErro("Erro ao salvar: " + error.message);
      return;
    }

    router.push("/programacao");
  }

  async function handleExcluir() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta programação?"
    );
    if (!confirmar) return;

    const { error } = await excluirProgramacao(id);

    if (error) {
      setErro("Erro ao excluir: " + error.message);
      return;
    }

    router.push("/programacao");
  }

  if (carregandoDados) {
    return <div className="p-6">Carregando...</div>;
  }

  if (erro && !titulo) {
    return <div className="p-6 text-red-600">{erro}</div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Editar Programação
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

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={handleExcluir}
            className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/programacao")}
              className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
