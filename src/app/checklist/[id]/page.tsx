import { createClient } from "@/lib/supabase/server";
import BotaoExportarPDF from "@/components/checklist/BotaoExportarPDF";
import { ChecklistViatura } from "@/types/checklist";

export default async function ChecklistDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: checklist, error } = await supabase
    .from("checklist_viaturas")
    .select("*")
    .eq("id", id)
    .single();

  if (!checklist) {
    return (
      <div className="p-8">
        Checklist não encontrado. {error?.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checklist — {checklist.viatura}</h1>
        <BotaoExportarPDF checklist={checklist as ChecklistViatura} />
      </div>
    </div>
  );
}
