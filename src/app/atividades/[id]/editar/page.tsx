"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Dados mockados (depois vamos buscar do Supabase)
const atividadesMock = [
  {
    id: "1",
    titulo: "Revisar documentação do sistema",
    descricao: "Revisar toda a documentação técnica e atualizar se necessário.",
    responsavel: "Wagner",
    prioridade: "Alta",
    status: "Em Andamento",
  },
  {
    id: "2",
    titulo: "Configurar ambiente de desenvolvimento",
    descricao: "Instalar Node.js, VS Code e configurar o projeto.",
    responsavel: "Wagner",
    prioridade: "Média",
    status: "Concluída",
  },
  {
    id: "3",
    titulo: "Criar tabela de atividades no Supabase",
    descricao: "Criar a tabela e configurar os relacionamentos.",
    responsavel: "Wagner",
    prioridade: "Alta",
    status: "Pendente",
  },
];

export default function EditarAtividadePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [status, setStatus] = useState("Pendente");
  const [carregando, setCarregando] = useState(true);

  // Busca os dados da atividade quando a página carrega
  useEffect(() => {
    const atividade = atividadesMock.find((a) => a.id === id);

    if (atividade) {
      setTitulo(atividade.titulo);
      setDescricao(atividade.descricao);
      setResponsavel(atividade.responsavel);
      setPrioridade(atividade.prioridade);
      setStatus(atividade.status);
    }

    setCarregando(false);
  }, [id]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Dados atualizados:", {
      id,
      titulo,
      descricao,
      responsavel,
      prioridade,
      status,
    });
    alert("Atividade atualizada! (por enquanto só visual)");
    router.push("/atividades");
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
              onChange={(e) => setPrioridade(e.target.value)}
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
              onChange={(e) => setStatus(e.target.value)}
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Salvar Alterações
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
