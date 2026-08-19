import { createClient } from '@/lib/supabase/client';
import { Ativo } from '@/types/ativo';

const supabase = createClient();

// Função para buscar todos os ativos cadastrados
export async function listarAtivos() {
  try {
    const { data, error } = await supabase
      .from('ativos')
      .select('*')
      .order('codigo_interno', { ascending: true });

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as Ativo[] };
  } catch (erro) {
    console.error('Erro ao listar ativos:', erro);
    return { sucesso: false, erro, dados: [] as Ativo[] };
  }
  
}
import { Atividade } from '@/types/atividade';

// Tipo com os dados que o formulário envia (sem os campos gerados pelo banco)
type NovaAtividade = {
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: string;
  status: string;
};

// Função para criar uma nova atividade
export async function criarAtividade(dados: NovaAtividade) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .insert([
        {
          titulo: dados.titulo,
          descricao: dados.descricao || null,
          responsavel: dados.responsavel || null,
          prioridade: dados.prioridade,
          status: dados.status,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as Atividade };
  } catch (erro) {
    console.error('Erro ao criar atividade:', erro);
    return { sucesso: false, erro };
  }
}
