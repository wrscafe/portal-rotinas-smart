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
