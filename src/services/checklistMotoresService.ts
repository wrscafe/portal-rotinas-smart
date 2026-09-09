import { createClient } from '@/lib/supabase/client'
import { ChecklistMotor, NovoChecklistMotor, MotorEstacionario } from '@/types/checklistMotor'

// Lista todos os motores estacionários cadastrados (para o campo de seleção do formulário)
export async function listarMotoresEstacionarios(): Promise<MotorEstacionario[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('viaturas_equipamentos')
    .select('id, nome, marca')
    .eq('tipo', 'estacionario')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) {
    console.error('Erro ao listar motores estacionários:', error)
    throw error
  }

  return data ?? []
}

// Lista o histórico de checklists (mais recentes primeiro)
export async function listarChecklistsMotores(): Promise<ChecklistMotor[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checklist_motores')
    .select('*')
    .order('data_checklist', { ascending: false })

  if (error) {
    console.error('Erro ao listar checklists de motores:', error)
    throw error
  }

  return data ?? []
}

// Busca um checklist específico pelo id (usado na tela de edição/detalhe)
export async function buscarChecklistMotorPorId(id: string): Promise<ChecklistMotor | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checklist_motores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar checklist de motor:', error)
    throw error
  }

  return data
}

// Cria um novo checklist
export async function criarChecklistMotor(checklist: NovoChecklistMotor): Promise<ChecklistMotor> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checklist_motores')
    .insert(checklist)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar checklist de motor:', error)
    throw error
  }

  return data
}

// Atualiza um checklist existente (usado na tela de edição)
export async function atualizarChecklistMotor(
  id: string,
  checklist: NovoChecklistMotor
): Promise<ChecklistMotor> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checklist_motores')
    .update(checklist)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar checklist de motor:', error)
    throw error
  }

  return data
}

// Exclui um checklist pelo id
export async function excluirChecklistMotor(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('checklist_motores')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir checklist de motor:', error)
    throw error
  }
}
