// Tipo para os campos de verificação com 3 estados possíveis
export type StatusVerificacao = boolean | null

export interface ChecklistMotor {
  id: string
  motor_id: string
  data_checklist: string
  numero_pt: string | null
  local: string | null
  verificador: string
  matricula: string | null
  operador: string | null
  gerente: string | null
  horimetro: number | null

  // Etapa 1: Antes de partir
  nivel_oleo_antes: string | null
  nivel_agua_antes: string | null
  tensao_banco1_antes: number | null
  tensao_banco2_antes: number | null
  pressao_entrada_trocador_antes: number | null

  // Etapa 2: Durante o funcionamento
  rpm_durante: number | null
  pressao_oleo_durante: number | null
  pressao_motor_durante: number | null
  pressao_entrada_trocador_durante: number | null
  temp_motor_durante: number | null
  mancal_la_durante: number | null
  mancal_loa_durante: number | null
  condicao_mangueiras: string | null

  // Verificações (Sim / Não / Não verificado)
  tem_agua_intercooler: StatusVerificacao
  vazamento_gaxetas: StatusVerificacao
  drenos_gaxeta_obstruidos: StatusVerificacao
  valvulas_agua_posicao_correta: StatusVerificacao
  vazamento_dreno_bomba: StatusVerificacao
  lacres_reguladores_integros: StatusVerificacao
  ruido_anormal: StatusVerificacao
  eletrovalvula_abriu: StatusVerificacao
  gaxeta_ajustada: StatusVerificacao

  // Etapa 3: Após tempo de teste
  temp_motor_depois: number | null
  pressao_entrada_trocador_depois: number | null
  entrada_saida_trocadores: string | null
  mancal_la_depois: number | null
  mancal_loa_depois: number | null
  anormalidade: StatusVerificacao

  observacoes: string | null
  created_at: string
}

// Tipo usado ao criar um novo checklist (sem id e created_at,
// que são gerados automaticamente pelo banco)
export type NovoChecklistMotor = Omit<ChecklistMotor, 'id' | 'created_at'>

// Motor/equipamento estacionário (vindo de viaturas_equipamentos)
export interface MotorEstacionario {
  id: string
  nome: string
  marca: string | null
}

