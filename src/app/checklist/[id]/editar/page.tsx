import ChecklistForm from "@/components/checklist/ChecklistForm";

export default async function EditarChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Checklist</h1>
      <ChecklistForm checklistId={id} />
    </div>
  );
}
