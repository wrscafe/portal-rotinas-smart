import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChecklistViatura } from "@/types/checklist";

// Agrupa a lista de checklists por data (chave = "YYYY-MM-DD")
function agruparPorData(checklists: ChecklistViatura[]) {
  const grupos: Record<string, ChecklistViatura[]> = {};

  for (const item of checklists) {
    const chave = item.data;
    if (!grupos[chave]) grupos[chave] = [];
    grupos[chave].push(item);
  }

  return Object.entries(grupos).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function badgeStatus(status: string) {
  if (status === "Liberada") return "bg-green-100 text-green-800";
  if (status === "Retida") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800"; // Liberada com Ressalva
}

export default async function ChecklistPage() {
  const supabase = await createClient();

  const { data: checklists, error } = await supabase
    .from("checklist_viaturas")
    .select("*")
    .order("data_criacao", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p>Erro ao carregar checklists: {error.message}</p>
      </div>
    );
  }

  const grupos = checklists ? agruparPorData(checklists as ChecklistViatura[]) : [];

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checklist de Viaturas</h1>
          <p className="text-sm text-gray-500">
            Acompanhe os checklists realizados por data
          </p>
        </div>
        <Link
          href="/checklist/novo"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap"
        >
          + Novo Checklist
        </Link>
      </div>

      {grupos.length > 0 ? (
        <div className="space-y-8">
          {grupos.map(([data, itens]) => (
            <div key={data}>
              <h2 className="text-sm font-bold text-gray-700 uppercase mb-3">
                {new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <th className="text-left px-4 py-3 font-medium">Viatura</th>
                      <th className="text-left px-4 py-3 font-medium">Motorista</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {itens.map((checklist) => (
                      <tr key={checklist.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {checklist.viatura}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {checklist.responsavel}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStatus(
                              checklist.status_geral
                            )}`}
                          >
                            {checklist.status_geral}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/checklist/${checklist.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Ver detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhum checklist encontrado.</p>
      )}
    </div>
  );
}
