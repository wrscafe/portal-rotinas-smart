export type Prioridade = "Alta" | "Média" | "Baixa";
export type StatusAssinatura = "Assinado" | "Aguardando Assinatura";

export interface OrdemServico {
  id: string;
  numero_osm: string;
  data_emissao: string; // formato YYYY-MM-DD
  equipamento: string;
  prioridade: Prioridade;
  descricao_solicitada: string;
  descricao_realizada: string | null;
  pecas_utilizadas: string | null;
  status_assinatura: StatusAssinatura;
  data_criacao: string;
  data_atualizacao: string;
}
