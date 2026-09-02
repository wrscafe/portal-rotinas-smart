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
 * Envia um e-mail com link para redefinição de senha.
 */
export async function enviarEmailRecuperacao(
  email: string
): Promise<ResultadoAuth> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });

  if (error) {
    return { sucesso: false, erro: error.message };
  }

  return { sucesso: true };
}

/**
 * Define uma nova senha para o usuário (usado após clicar no link do e-mail).
 */
export async function redefinirSenha(
  novaSenha: string
): Promise<ResultadoAuth> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: novaSenha,
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
