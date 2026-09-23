// src/services/abastecimentoService.ts
import { createClient } from "@/lib/supabase/client";

interface NovoAbastecimento {
  veiculo_id: string;
  data: string; // formato YYYY-MM-DD
  litros: number;
  km: number;
  posto: string; // nome do fornecedor/empresa do caminhão-tanque
  responsavel_id: string;
  aditivo_ml: number;
}

// Os dados de edição são os mesmos do cadastro, exceto o responsavel_id
// (não precisa mudar quem originalmente registrou o abastecimento)
type DadosEdicaoAbastecimento = Omit<NovoAbastecimento, "responsavel_id">;

export async function criarAbastecimento(dados: NovoAbastecimento) {
  const supabase = createClient();

  const { error } = await supabase.from("abastecimentos").insert(dados);

  return { error };
}

// Atualiza um abastecimento existente, identificado pelo id
export async function atualizarAbastecimento(
  id: string,
  dados: DadosEdicaoAbastecimento
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("abastecimentos")
    .update(dados)
    .eq("id", id);

  return { error };
}

// Remove um abastecimento pelo id
export async function excluirAbastecimento(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("abastecimentos")
    .delete()
    .eq("id", id);

  return { error };
}
