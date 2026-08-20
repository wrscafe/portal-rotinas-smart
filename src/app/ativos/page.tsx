import { createClient } from "@/lib/supabase/server";
import { Ativo } from "@/types/ativo";

function CategoriaBadge({ categoria }: { categoria: string }) {
  const styles: Record<string, string> = {
    Caminhao: "bg-blue-100 text-blue-800",
    "Motor Estacionario": "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[categoria] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {categoria}
    </span>
  );
}

export default async function AtivosPage() {
  const supabase = await createClient();

  const { data: ativos, error } = await supabase
    .from("ativos")
    .select("*")
    .order("codigo_interno", { ascending: true });

  if (error) {
    console.error("Erro ao buscar ativos:", error);
  }

  const listaAtivos: Ativo[] = ativos ?? [];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ativos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Caminhões e motores estacionários cadastrados
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fabricante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Modelo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listaAtivos.map((ativo) => (
              <tr key={ativo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {ativo.codigo_interno}
                </td>
                <td className="px-6 py-4">
                  <CategoriaBadge categoria={ativo.categoria} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ativo.fabricante ?? "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ativo.modelo ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

