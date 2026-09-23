export interface Abastecimento {
  id: string;
  veiculo_id: string;
  data: string; // formato ISO (YYYY-MM-DD)
  litros: number;
  km: number;
  posto: string;
  responsavel_id: string;
  aditivo_ml: number | null;
  criado_em: string;
}

// Formato usado quando o veículo vem "junto" via join do Supabase (select com relacionamento)
export interface AbastecimentoComVeiculo extends Abastecimento {
  viaturas_equipamentos: {
    nome: string;
  } | null;
}
