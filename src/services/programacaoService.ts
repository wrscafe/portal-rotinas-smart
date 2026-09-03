import { createClient } from "@/lib/supabase/client";
import { Programacao } from "@/types/programacao";

// Lista todas as programações, ordenadas pela data de início
export async function listarProgramacoes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programacao")
    .select("*")
    .order("data_inicio", { ascending: true });

  return { data: data as Programacao[] | null, error };
}

// Busca uma programação específica pelo id
export async function buscarProgramacaoPorId(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programacao")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as Programacao | null, error };
}

// Cria uma nova programação
export async function criarProgramacao(
  programacao: Omit<Programacao, "id" | "data_criacao" | "data_atualizacao">
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programacao")
    .insert([programacao])
    .select()
    .single();

  return { data: data as Programacao | null, error };
}

// Atualiza uma programação existente
export async function atualizarProgramacao(
  id: string,
  programacao: Partial<Programacao>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programacao")
    .update(programacao)
    .eq("id", id)
    .select()
    .single();

  return { data: data as Programacao | null, error };
}

// Exclui uma programação
export async function excluirProgramacao(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("programacao").delete().eq("id", id);

  return { error };
}
