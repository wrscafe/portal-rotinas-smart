import { createClient } from "@/lib/supabase/client";

// Tipo que representa o resultado de uma operação de autenticação
type ResultadoAuth = {
  sucesso: boolean;
  erro?: string;
};

/**
 * Faz login do usuário com email e senha.
 */
export async function fazerLogin(
  email: string,
  senha: string
): Promise<ResultadoAuth> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { sucesso: false, erro: error.message };
  }

  return { sucesso: true };
}

/**
 * Encerra a sessão do usuário logado.
 */
export async function fazerLogout(): Promise<ResultadoAuth> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { sucesso: false, erro: error.message };
  }

  return { sucesso: true };
}
