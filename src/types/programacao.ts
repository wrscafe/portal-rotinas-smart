// Tipos possíveis para o campo "tipo"
export type TipoProgramacao = "Mecânica" | "Administrativa" | "Outra";

// Tipos possíveis para o campo "status"
export type StatusProgramacao =
  | "Programada"
  | "Em andamento"
  | "Concluída"
  | "Cancelada";

// Formato completo de uma Programação (como vem do banco)
export interface Programacao {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoProgramacao;
  data_inicio: string; // formato ISO (ex: "2026-09-10T14:00:00Z")
  data_fim: string | null;
  responsavel: string | null;
  local: string | null;
  status: StatusProgramacao;
  usuario_id: string | null;
  data_criacao: string;
  data_atualizacao: string;
}
