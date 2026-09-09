import ChecklistMotorForm from '@/components/ChecklistMotorForm'

export default function NovoChecklistMotorPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Checklist Semanal de Motor</h1>
        <p className="mb-6 text-sm text-gray-500">
          Preencha os dados de verificação do motor estacionário
        </p>
      </div>
      <ChecklistMotorForm />
    </div>
  )
}
