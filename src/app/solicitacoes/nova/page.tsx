"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const EQUIPAMENTOS = [
  "AB-01",
  "AB-02",
  "AB-03",
  "AB-04",
  "AB-05",
  "AB-06",
  "AB-07",
  "AB-08",
  "30-DP-01B",
  "30-DP-01C",
  "30-DP-01D",
  "30-DP-01E",
  "30-DP-05B",
  "38-DP-01A",
  "38-DP-01B",
  "38-DP-01C",
  "Outros",
];

export default function NovaSolicitacaoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [equipamento, setEquipamento] = useState("");
  const [equipamentoOutros, setEquipamentoOutros] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!equipamento) {
      setErro("Selecione um equipamento.");
      return;
    }

    if (equipamento === "Outros" && !equipamentoOutros.trim()) {
      setErro("Descreva o equipamento em 'Outros'.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Descreva o problema ou solicitação.");
      return;
    }

    setCarregando(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setErro("Usuário não autenticado.");
      setCarregando(false);
      return;
    }

    const { error } = await supabase.from("solicitacoes").insert({
      equipamento,
      equipamento_outros: equipamento === "Outros" ? equipamentoOutros : null,
      descricao,
      prioridade,
      criado_por: userId,
    });

    setCarregando(false);

    if (error) {
      console.error(error);
      setErro("Erro ao salvar solicitação. Tente novamente.");
      return;
    }

    router.push("/solicitacoes");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Nova Solicitação
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipamento
          </label>
          <select
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {EQUIPAMENTOS.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {equipamento === "Outros" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descreva o equipamento
            </label>
            <input
              type="text"
              value={equipamentoOutros}
              onChange={(e) => setEquipamentoOutros(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Impressora do RH"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do problema/solicitação
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o que está acontecendo..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={carregando}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Enviar Solicitação"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
