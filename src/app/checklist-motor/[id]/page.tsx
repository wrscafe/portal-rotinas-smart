"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Pencil, Trash2, Printer } from "lucide-react";
import {
  buscarChecklistMotorPorId,
  excluirChecklistMotor,
} from "@/services/checklistMotoresService";
import { ChecklistMotor, StatusVerificacao } from "@/types/checklistMotor";

// Converte o valor de uma verificação em texto legível
function textoStatus(valor: StatusVerificacao) {
  if (valor === true) return "Sim";
  if (valor === false) return "Não";
  return "Não verificado";
}

// Card simples para exibir um campo (label + valor)
function Campo({ label, valor }: { label: string; valor: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{valor ?? "-"}</p>
    </div>
  );
}

export default function DetalheChecklistMotorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [checklist, setChecklist] = useState<ChecklistMotor | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarChecklistMotorPorId(id);
        if (!dados) {
          setErro("Checklist não encontrado.");
          return;
        }
        setChecklist(dados);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar o checklist.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function handleExcluir() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este checklist? Essa ação não pode ser desfeita."
    );
    if (!confirmar) return;

    setExcluindo(true);
    try {
      await excluirChecklistMotor(id);
      router.push("/checklist-motor");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o checklist. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Carregando...
      </div>
    );
  }

  if (erro || !checklist) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {erro ?? "Erro ao carregar checklist."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-3xl">
        {/* Logo - só aparece na impressão */}
        <div className="hidden print:flex print:justify-center print:mb-6">
          <img src="/logo_smart_redonda.png" alt="Logo" className="h-16" />
        </div>

        {/* Cabeçalho: voltar + ações (não aparece na impressão) */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            onClick={() => router.push("/checklist-motor")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Printer size={16} />
              Imprimir
            </button>
            <button
              onClick={() => router.push(`/checklist-motor/${id}/editar`)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Pencil size={16} />
              Editar
            </button>
            <button
              onClick={handleExcluir}
              disabled={excluindo}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {excluindo ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Excluir
            </button>
          </div>
        </div>

        <h1 className="mb-6 text-xl font-bold text-gray-900">Detalhes do Checklist de Motor</h1>

        {/* Dados gerais */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Informações Gerais</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Campo label="Data" valor={checklist.data_checklist} />
            <Campo label="Nº PT" valor={checklist.numero_pt} />
            <Campo label="Local" valor={checklist.local} />
            <Campo label="Verificador" valor={checklist.verificador} />
            <Campo label="Matrícula" valor={checklist.matricula} />
            <Campo label="Operador" valor={checklist.operador} />
            <Campo label="Gerente" valor={checklist.gerente} />
            <Campo label="Horímetro" valor={checklist.horimetro} />
          </div>
        </div>

        {/* Etapa 1 */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Etapa 1 — Antes de Partir</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Campo label="Nível de óleo" valor={checklist.nivel_oleo_antes} />
            <Campo label="Nível de água" valor={checklist.nivel_agua_antes} />
            <Campo label="Tensão banco 1" valor={checklist.tensao_banco1_antes} />
            <Campo label="Tensão banco 2" valor={checklist.tensao_banco2_antes} />
            <Campo label="Pressão entrada trocador" valor={checklist.pressao_entrada_trocador_antes} />
          </div>
        </div>

        {/* Etapa 2 */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Etapa 2 — Durante o Funcionamento</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Campo label="RPM" valor={checklist.rpm_durante} />
            <Campo label="Pressão do óleo" valor={checklist.pressao_oleo_durante} />
            <Campo label="Pressão do motor" valor={checklist.pressao_motor_durante} />
            <Campo label="Pressão entrada trocador" valor={checklist.pressao_entrada_trocador_durante} />
            <Campo label="Temp. do motor" valor={checklist.temp_motor_durante} />
            <Campo label="Mancal LA" valor={checklist.mancal_la_durante} />
            <Campo label="Mancal LOA" valor={checklist.mancal_loa_durante} />
            <Campo label="Condição das mangueiras" valor={checklist.condicao_mangueiras} />
          </div>
        </div>

        {/* Verificações */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Verificações</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Campo label="Tem água no intercooler" valor={textoStatus(checklist.tem_agua_intercooler)} />
            <Campo label="Vazamento gaxetas" valor={textoStatus(checklist.vazamento_gaxetas)} />
            <Campo label="Drenos gaxeta obstruídos" valor={textoStatus(checklist.drenos_gaxeta_obstruidos)} />
            <Campo label="Válvulas água posição correta" valor={textoStatus(checklist.valvulas_agua_posicao_correta)} />
            <Campo label="Vazamento dreno bomba" valor={textoStatus(checklist.vazamento_dreno_bomba)} />
            <Campo label="Lacres reguladores íntegros" valor={textoStatus(checklist.lacres_reguladores_integros)} />
            <Campo label="Ruído anormal" valor={textoStatus(checklist.ruido_anormal)} />
            <Campo label="Eletroválvula abriu" valor={textoStatus(checklist.eletrovalvula_abriu)} />
            <Campo label="Gaxeta ajustada" valor={textoStatus(checklist.gaxeta_ajustada)} />
          </div>
        </div>

        {/* Etapa 3 */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Etapa 3 — Após Tempo de Teste</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Campo label="Temp. do motor" valor={checklist.temp_motor_depois} />
            <Campo label="Pressão entrada trocador" valor={checklist.pressao_entrada_trocador_depois} />
            <Campo label="Entrada/saída trocadores" valor={checklist.entrada_saida_trocadores} />
            <Campo label="Mancal LA" valor={checklist.mancal_la_depois} />
            <Campo label="Mancal LOA" valor={checklist.mancal_loa_depois} />
            <Campo label="Anormalidade" valor={textoStatus(checklist.anormalidade)} />
          </div>
        </div>

        {/* Observações */}
        {checklist.observacoes && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm print:shadow-none print:border print:border-gray-200">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Observações</h2>
            <p className="text-sm text-gray-900">{checklist.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
