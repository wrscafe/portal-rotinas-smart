// Representa uma solicitação de serviço (ex: manutenção de viatura)
export type StatusSolicitacao = "Pendente" | "Aprovada" | "Rejeitada";
export type PrioridadeSolicitacao = "Baixa" | "Média" | "Alta";

// Lista fixa de equipamentos disponíveis para seleção
export const EQUIPAMENTOS: string[] = [
  "AB-01",
  "AB-02",
  "AB-03",
  "AB-04",
  "AB-05",
  "AB-06",
  "AB-07",
  "AB-08",
  "30-DP-01B",
  "30-DP-01C",
  "30-DP-01D",
  "30-DP-01E",
  "30-DP-05B",
  "38-DP-01A",
  "38-DP-01B",
  "38-DP-01C",
  "Outros",
];

export interface Solicitacao {
  id: string;
  equipamento: string;               // um dos valores de EQUIPAMENTOS
  equipamento_outros: string | null; // preenchido só quando equipamento === "Outros"
  descricao: string;
  prioridade: PrioridadeSolicitacao;
  status: StatusSolicitacao;
  resposta: string | null;
  criado_por: string;
  respondido_por: string | null;
  criado_em: string;
  respondido_em: string | null;
}
