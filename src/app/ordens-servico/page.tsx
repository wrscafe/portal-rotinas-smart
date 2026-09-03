import { createClient } from "@/lib/supabase/server";
import { OrdemServico } from "@/types/ordemServico";
import Link from "next/link";

// Retorna a data (YYYY-MM-DD) já no fuso de São Paulo, para servir de chave de agrupamento
function chaveDataSaoPaulo(dataISO: string) {
  // "en-CA" retorna no formato YYYY-MM-DD, que é ordenável como string
  return new Date(dataISO).toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
}

// Formata a data para exibição no título da seção (ex: "02 de setembro de 2026")
function formatarDataSecao(chave: string) {
  // Criamos a data ao meio-dia para evitar problemas de conversão na exibição do título
  return new Date(`${chave}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Agrupa as ordens de serviço por dia de emissão (considerando o fuso de São Paulo)
function agruparPorData(ordens: OrdemServico[]) {
  const grupos: Record<string, OrdemServico[]> = {};

  for (const os of ordens) {
    const chave = chaveDataSaoPaulo(os.data_emissao);

    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(os);
  }

  return grupos;
}

export default async function OrdensServicoPage() {
  const supabase = await createClient();

  const { data: ordens } = await supabase
    .from("ordens_servico")
    .select("*")
    .order("data_emissao", { ascending: false });

  const ordensServico = (ordens ?? []) as OrdemServico[];
  const grupos = agruparPorData(ordensServico);
  // Do dia mais recente para o mais antigo (mesma lógica da ordenação original: descending)
  const datasOrdenadas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

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

      {datasOrdenadas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">
            Nenhuma ordem de serviço cadastrada ainda.
          </p>
        </div>
      ) : (
        datasOrdenadas.map((data) => (
          <div key={data} className="mb-8">
            {/* Título da seção com a data */}
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
              {formatarDataSecao(data)}
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  {grupos[data].map((os) => (
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
                        {new Date(os.data_emissao).toLocaleDateString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                        })}
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
            </div>
          </div>
        ))
      )}
    </div>
  );
}
