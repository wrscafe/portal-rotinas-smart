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

export default async function ChecklistPage() {
  const supabase = await createClient();

  const { data: checklists, error } = await supabase
    .from("checklist_viaturas")
    .select("*")
    .order("data", { ascending: false })
    .order("hora", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checklist de Viaturas</h1>
        <Link
          href="/checklist/novo"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Novo Checklist
        </Link>
      </div>

      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Data</th>
            <th className="p-3">Viatura</th>
            <th className="p-3">Motorista</th>
            <th className="p-3">Status</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {checklists?.map((c: ChecklistViatura) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{new Date(c.data).toLocaleDateString('pt-BR')}</td>
              <td className="p-3 font-medium">{c.viatura}</td>
              <td className="p-3">{c.motorista}</td>
              <td className="p-3"><StatusBadge status={c.status_geral} /></td>
              <td className="p-3">
                <Link href={`/checklist/${c.id}`} className="text-blue-600 hover:underline">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
