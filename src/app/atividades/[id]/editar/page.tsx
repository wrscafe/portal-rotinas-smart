"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { buscarAtividadePorId, atualizarAtividade } from "@/services/atividadesService";
import { Atividade } from "@/types/atividade";

export default function EditarAtividadePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prioridade, setPrioridade] = useState<Atividade["prioridade"]>("Média");
  const [status, setStatus] = useState<Atividade["status"]>("Pendente");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Busca os dados reais da atividade no Supabase quando a página carrega
  useEffect(() => {
    async function carregarAtividade() {
      const resultado = await buscarAtividadePorId(id);

      if (resultado.sucesso && resultado.dados) {
        const atividade = resultado.dados;
        setTitulo(atividade.titulo);
        setDescricao(atividade.descricao || "");
        setResponsavel(atividade.responsavel || "");
        setPrioridade(atividade.prioridade);
        setStatus(atividade.status);
      } else {
        setErro("Não foi possível carregar a atividade.");
      }

      setCarregando(false);
    }

    carregarAtividade();
  }, [id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSalvando(true);
    setErro("");

    const resultado = await atualizarAtividade(id, {
      titulo,
      descricao,
      responsavel,
      prioridade,
      status,
    });

    setSalvando(false);

    if (resultado.sucesso) {
      router.push("/atividades");
    } else {
      setErro("Erro ao salvar as alterações. Tente novamente.");
    }
  }

  if (carregando) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/atividades"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Voltar para Atividades
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Editar Atividade
        </h1>
        <p className="text-gray-500 mt-1">
          Atualize os dados da atividade #{id}
        </p>
      </div>

      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as Atividade["prioridade"])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Alta">🔴 Alta</option>
              <option value="Média">🟠 Média</option>
              <option value="Baixa">⚪ Baixa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Atividade["status"])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={salvando}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
          <Link
            href="/atividades"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
