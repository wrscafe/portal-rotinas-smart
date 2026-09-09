"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import {
  listarChecklistsMotores,
  listarMotoresEstacionarios,
} from "@/services/checklistMotoresService";
import { ChecklistMotor, MotorEstacionario } from "@/types/checklistMotor";

export default function ChecklistMotorPage() {
  const router = useRouter();

  const [checklists, setChecklists] = useState<ChecklistMotor[]>([]);
  const [motores, setMotores] = useState<MotorEstacionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [checklistsData, motoresData] = await Promise.all([
          listarChecklistsMotores(),
          listarMotoresEstacionarios(),
        ]);
        setChecklists(checklistsData);
        setMotores(motoresData);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar os checklists.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Cria um "dicionário" id -> nome do motor, para exibir na tabela
  const nomeDoMotor = (motorId: string) => {
    const motor = motores.find((m) => m.id === motorId);
    return motor ? motor.nome : "—";
  };

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho da página */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Checklist de Motores
          </h1>
          <Link
            href="/checklist-motor/novo"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Checklist
          </Link>
        </div>

        {/* Estado de carregamento */}
        {carregando && (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="mr-2 animate-spin" size={20} />
            Carregando checklists...
          </div>
        )}

        {/* Estado de erro */}
        {erro && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Lista vazia */}
        {!carregando && !erro && checklists.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Nenhum checklist cadastrado ainda.
          </div>
        )}

        {/* Tabela de checklists */}
        {!carregando && !erro && checklists.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Motor</th>
                  <th className="px-4 py-3 font-medium">Local</th>
                  <th className="px-4 py-3 font-medium">Nº PT</th>
                  <th className="px-4 py-3 font-medium">Verificador</th>
                  <th className="px-4 py-3 font-medium">Horímetro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {checklists.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/checklist-motor/${item.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {formatarData(item.data_checklist)}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {nomeDoMotor(item.motor_id)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.local ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.numero_pt ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.verificador}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.horimetro ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
