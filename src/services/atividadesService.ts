import { createClient } from '@/lib/supabase/client';
import { Atividade } from '@/types/atividade';

const supabase = createClient();

// Tipo com os dados que o formulário envia
// prioridade e status são opcionais: se não vierem, usamos um valor padrão
type NovaAtividade = {
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade?: Atividade['prioridade'];
  status?: Atividade['status'];
};

export async function criarAtividade(dados: NovaAtividade) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .insert([
        {
          titulo: dados.titulo,
          descricao: dados.descricao || null,
          responsavel: dados.responsavel || null,
          prioridade: dados.prioridade ?? 'Média',
          status: dados.status ?? 'Pendente',
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

export async function buscarAtividadePorId(id: string) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as Atividade };
  } catch (erro) {
    console.error('Erro ao buscar atividade:', erro);
    return { sucesso: false, erro };
  }
}

type DadosAtualizacao = {
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: Atividade['prioridade'];
  status: Atividade['status'];
};

export async function atualizarAtividade(id: string, dados: DadosAtualizacao) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .update({
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        responsavel: dados.responsavel || null,
        prioridade: dados.prioridade,
        status: dados.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as Atividade };
  } catch (erro) {
    console.error('Erro ao atualizar atividade:', erro);
    return { sucesso: false, erro };
  }
}
export async function listarAtividadesRecentes(limite: number = 5) {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .select('*')
      .order('data_criacao', { ascending: false })
      .limit(limite);

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as Atividade[] };
  } catch (erro) {
    console.error('Erro ao listar atividades recentes:', erro);
    return { sucesso: false, dados: [] as Atividade[] };
  }
}
