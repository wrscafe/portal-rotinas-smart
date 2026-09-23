import { createClient } from "@/lib/supabase/server";
import { AbastecimentoComVeiculo } from "@/types/abastecimento";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalhesAbastecimentoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: abastecimento } = await supabase
    .from("abastecimentos")
    .select("*, viaturas_equipamentos(nome)")
    .eq("id", id)
    .single();

  if (!abastecimento) {
    notFound();
  }

  const item = abastecimento as AbastecimentoComVeiculo;

  return (
    <div className="p-6 max-w-2xl">
      <Link
        href="/abastecimentos"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Detalhes do Abastecimento
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Veículo</p>
          <p className="font-medium text-gray-900">
            {item.viaturas_equipamentos?.nome ?? "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data</p>
          <p className="font-medium text-gray-900">
            {new Date(item.data).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Litros</p>
            <p className="font-medium text-gray-900">{item.litros} L</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">KM</p>
            <p className="font-medium text-gray-900">{item.km} km</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Aditivo Bardahl (mL)</p>
          <p className="font-medium text-gray-900">
            {item.aditivo_ml !== null ? `${item.aditivo_ml} mL` : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fornecedor</p>
          <p className="font-medium text-gray-900">{item.posto}</p>
        </div>
      </div>
    </div>
  );
}
