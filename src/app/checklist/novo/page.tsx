import ChecklistForm from "@/components/checklist/ChecklistForm";

export default function NovoChecklistPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Novo Checklist</h1>
      <ChecklistForm />
    </div>
  );
}
