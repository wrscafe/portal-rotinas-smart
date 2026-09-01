export interface PT {
  id: string;
  numero_pt: string;
  titulo: string;
  tipo: "Trabalho a Quente" | "Espaço Confinado" | "Trabalho em Altura" | "Outro";
  emitente: string;
  executante: string;
  data_emissao: string;
  data_execucao: string | null;
  data_validade: string | null;
  status: 'Aberta' | 'Em Andamento' | 'Encerrada' | 'Cancelada';
  usuario_id: string | null;
  data_criacao: string;
  data_atualizacao: string;
}
