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

export async function criarAbastecimento(dados: NovoAbastecimento) {
  const supabase = createClient();

  const { error } = await supabase.from("abastecimentos").insert(dados);

  return { error };
}
