import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PT } from "@/types/pt";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aberta: "bg-yellow-100 text-yellow-800",
    "Em Andamento": "bg-blue-100 text-blue-800",
    Encerrada: "bg-green-100 text-green-800",
    Cancelada: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const styles: Record<string, string> = {
    "Trabalho a Quente": "bg-orange-100 text-orange-800",
    "Espaço Confinado": "bg-purple-100 text-purple-800",
    "Trabalho em Altura": "bg-cyan-100 text-cyan-800",
    Outro: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[tipo] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {tipo}
    </span>
  );
}

export default async function PtPage() {
  const supabase = await createClient();

  const { data: pts, error } = await supabase
    .from("pts")
    .select("*")
    .order("data_criacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar PTs:", error);
  }

  const listaPts: PT[] = pts ?? [];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Permissões de Trabalho (PTs)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as PTs emitidas
          </p>
        </div>
        <Link
          href="/pt/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nova PT
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nº PT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Executante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data Emissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listaPts.map((pt) => (
              <tr key={pt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {pt.numero_pt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {pt.titulo}
                </td>
                <td className="px-6 py-4">
                  <TipoBadge tipo={pt.tipo} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {pt.executante}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={pt.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {pt.data_emissao}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/pt/${pt.id}/editar`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
