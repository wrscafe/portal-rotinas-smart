import { supabase } from '@/lib/supabase';

// Tipo que define a estrutura de uma atividade
export type Atividade = {
  id?: string;
  titulo: string;
  descricao?: string;
  responsavel?: string;
  prioridade?: string;
  status?: string;
  data_criacao?: string;
  data_atualizacao?: string;
};

// Função para criar uma nova atividade
export async function criarAtividade(dados: Atividade) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .insert([
        {
          titulo: dados.titulo,
          descricao: dados.descricao || null,
          responsavel: dados.responsavel || null,
          prioridade: dados.prioridade || 'Média',
          status: dados.status || 'Pendente',
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data };
  } catch (erro) {
    console.error('Erro ao criar atividade:', erro);
    return { sucesso: false, erro };
  }
}
