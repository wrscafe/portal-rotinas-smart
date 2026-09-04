import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChecklistViatura } from "@/types/checklist";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Liberada": "bg-green-100 text-green-800",
    "Liberada com Ressalva": "bg-yellow-100 text-yellow-800",
    "Retida": "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

// Formata a data para exibição no título da seção (ex: "02 de setembro de 2026")
function formatarDataSecao(data: string) {
  if (data === "sem-data") return "Sem data";

  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Agrupa os checklists por data (campo "data", sem considerar a hora)
function agruparPorData(checklists: ChecklistViatura[]) {
  const grupos: Record<string, ChecklistViatura[]> = {};

  for (const c of checklists) {
    const chave = c.data ? c.data.split("T")[0] : "sem-data";

    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(c);
  }

  return grupos;
}

export default async function ChecklistPage() {
  const supabase = await createClient();

  const { data: checklists, error } = await supabase
    .from("checklist_viaturas")
    .select("*")
    .order("data", { ascending: false })
    .order("hora", { ascending: false });

  if (error) {
    console.error("Erro ao buscar checklists:", error.message);
  }

  const listaChecklists: ChecklistViatura[] = checklists ?? [];
  const grupos = agruparPorData(listaChecklists);
  const datasOrdenadas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checklist de Viaturas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe os checklists realizados por data
          </p>
        </div>
        <Link
          href="/checklist/novo"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Novo Checklist
        </Link>
      </div>

      {datasOrdenadas.map((data) => (
        <div key={data} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            {formatarDataSecao(data)}
          </h2>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-6 py-3">Viatura</th>
                  <th className="px-6 py-3">Motorista</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grupos[data].map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.viatura}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.motorista}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status_geral} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/checklist/${c.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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

      {datasOrdenadas.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum checklist encontrado.</p>
      )}
    </div>
  );
}
