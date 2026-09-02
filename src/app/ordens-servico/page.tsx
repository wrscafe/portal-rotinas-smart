import { createClient } from "@/lib/supabase/server";
import { OrdemServico } from "@/types/ordemServico";
import Link from "next/link";

export default async function OrdensServicoPage() {
  const supabase = await createClient();

  const { data: ordens } = await supabase
    .from("ordens_servico")
    .select("*")
    .order("data_emissao", { ascending: false });

  const ordensServico = (ordens ?? []) as OrdemServico[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
          <p className="text-gray-500 mt-1">
            Ordens recebidas da refinaria (OSM)
          </p>
        </div>
        <Link
          href="/ordens-servico/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Nova OSM
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {ordensServico.length === 0 ? (
          <p className="text-gray-500 p-6">
            Nenhuma ordem de serviço cadastrada ainda.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Nº OSM</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Emissão</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Equipamento</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Prioridade</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Assinatura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordensServico.map((os) => (
                <tr key={os.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/ordens-servico/${os.id}/editar`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {os.numero_osm}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(os.data_emissao).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{os.equipamento}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        os.prioridade === "Alta"
                          ? "bg-red-100 text-red-700"
                          : os.prioridade === "Média"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {os.prioridade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        os.status_assinatura === "Assinado"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {os.status_assinatura}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
