"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { buscarChecklistMotorPorId } from "@/services/checklistMotoresService";
import { ChecklistMotor, NovoChecklistMotor } from "@/types/checklistMotor";
import ChecklistMotorForm from "@/components/ChecklistMotorForm";

// Remove campos que não fazem parte do "NovoChecklistMotor" (id, created_at, etc.)
function paraDadosDoForm(checklist: ChecklistMotor): NovoChecklistMotor {
  const {
    id,
    created_at,
    updated_at,
    ...resto
  } = checklist as any;

  return resto;
}

export default function EditarChecklistMotorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [dadosIniciais, setDadosIniciais] = useState<NovoChecklistMotor | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const checklist = await buscarChecklistMotorPorId(id);

        if (!checklist) {
          setErro("Checklist não encontrado.");
          return;
        }

        setDadosIniciais(paraDadosDoForm(checklist));
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar o checklist.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Carregando...
      </div>
    );
  }

  if (erro || !dadosIniciais) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {erro ?? "Erro ao carregar checklist."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push(`/checklist-motor/${id}`)}
          className="mb-6 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <h1 className="mb-6 text-xl font-bold text-gray-900">Editar Checklist de Motor</h1>

        <ChecklistMotorForm checklistId={id} dadosIniciais={dadosIniciais} />
      </div>
    </div>
  );
}
