"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { criarAtividade } from "@/services/atividadesService";
import { Atividade } from "@/types/atividade";

export default function NovaAtividadePage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prioridade, setPrioridade] = useState<Atividade["prioridade"]>("Média");
  const [statusAtividade, setStatusAtividade] = useState<Atividade["status"]>("Pendente");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Limpa erros anteriores
    setErro("");
    setCarregando(true);

    try {
      // Chama o serviço para criar a atividade
      const resultado = await criarAtividade({
        titulo,
        descricao,
        responsavel,
        prioridade,
        status: statusAtividade,
      });

      if (resultado.sucesso) {
        // Redireciona para a lista de atividades
        router.push("/atividades");
      } else {
        // Mostra mensagem de erro
        setErro("Erro ao criar atividade. Tente novamente.");
        console.error("Erro:", resultado.erro);
      }
    } catch (err) {
      setErro("Erro inesperado. Verifique sua conexão e tente novamente.");
      console.error("Erro inesperado:", err);
    } finally {
      setCarregando(false);
    }
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
          Nova Atividade
        </h1>
        <p className="text-gray-500 mt-1">
          Preencha os dados para criar uma nova atividade
        </p>
      </div>

      {erro && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
            placeholder="Ex: Revisar documentação do sistema"
            required
            disabled={carregando}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva os detalhes da atividade..."
            rows={4}
            disabled={carregando}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              placeholder="Nome do responsável"
              disabled={carregando}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value as Atividade["prioridade"])
              }
              disabled={carregando}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              value={statusAtividade}
              onChange={(e) =>
                setStatusAtividade(e.target.value as Atividade["status"])
              }
              disabled={carregando}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={carregando}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {carregando ? "Salvando..." : "Salvar Atividade"}
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
