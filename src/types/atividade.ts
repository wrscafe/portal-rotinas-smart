export type Atividade = {
  id: string;
  titulo: string;
  descricao: string | null;
  responsavel: string | null;
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Em Andamento" | "Concluída";
  data_criacao: string | null;
  data_atualizacao: string | null;
  usuario_id: string | null;
  data_prevista: string | null;
};
