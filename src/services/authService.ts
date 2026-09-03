import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

/**
 * Formato padrão de retorno das funções de autenticação.
 */
export type ResultadoAuth = {
  sucesso: boolean
  erro?: string
}

/**
 * Realiza login do usuário com email e senha.
 */
export async function fazerLogin(
  email: string,
  senha: string
): Promise<ResultadoAuth> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error) {
    return { sucesso: false, erro: error.message }
  }

  return { sucesso: true }
}

/**
 * Cadastra um novo usuário. O perfil na tabela "usuarios" é criado
 * automaticamente por um trigger no banco de dados (ao_criar_usuario),
 * que lê o nome a partir do metadata enviado aqui.
 */
export async function fazerCadastro(
  nome: string,
  email: string,
  senha: string
): Promise<ResultadoAuth> {
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
      },
    },
  })

  if (error) {
    return { sucesso: false, erro: error.message }
  }

  return { sucesso: true }
}

/**
 * Encerra a sessão do usuário atual.
 */
export async function fazerLogout(): Promise<ResultadoAuth> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { sucesso: false, erro: error.message }
  }

  return { sucesso: true }
}
