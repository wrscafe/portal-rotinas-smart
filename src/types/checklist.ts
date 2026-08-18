export interface NivelItem {
  nome: string;
  status: 'OK' | 'Baixo' | 'Crítico';
  observacao?: string;
}

export interface LuzItem {
  nome: string;
  funcionando: boolean;
}

export interface ChecklistViatura {
  id: string;
  data: string;
  hora: string;
  turno: 'Manhã' | 'Tarde' | 'Noite';
  viatura: string;
  motorista: string;
  quilometragem: number;
  niveis: NivelItem[];
  luzes_dianteiras: LuzItem[];
  luzes_traseiras: LuzItem[];
  avaria_externa: 'Sim' | 'Não';
  avaria_descricao?: string;
  avaria_foto_url?: string;
  alerta_painel: string;
  pneus: 'OK' | 'Atenção' | 'Crítico';
  cabine: string;
  observacoes?: string;
  status_geral: 'Liberada' | 'Liberada com Ressalva' | 'Retida';
  usuario_id?: string;
  data_criacao: string;
  data_atualizacao: string;
}
