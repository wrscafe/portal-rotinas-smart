import { createClient } from '@/lib/supabase/client';
import { PT } from '@/types/pt';

const supabase = createClient();

type NovaPT = {
  numero_pt: string;
  titulo: string;
  tipo: PT['tipo'];
  emitente: string;
  executante: string;
  data_emissao: string;
  data_execucao?: string | null;
  data_validade?: string | null;
  status?: PT['status'];
};

export async function listarPts() {
  try {
    const { data, error } = await supabase
      .from('pts')
      .select('*')
      .order('data_emissao', { ascending: false });

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as PT[] };
  } catch (erro) {
    console.error('Erro ao listar PTs:', erro);
    return { sucesso: false, erro, dados: [] as PT[] };
  }
}

export async function buscarPtPorId(id: string) {
  try {
    const { data, error } = await supabase
      .from('pts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as PT };
  } catch (erro) {
    console.error('Erro ao buscar PT:', erro);
    return { sucesso: false, erro, dados: null };
  }
}

export async function criarPt(dados: NovaPT) {
  try {
    const { data, error } = await supabase
      .from('pts')
      .insert([
        {
          numero_pt: dados.numero_pt,
          titulo: dados.titulo,
          tipo: dados.tipo,
          emitente: dados.emitente,
          executante: dados.executante,
          data_emissao: dados.data_emissao,
          data_execucao: dados.data_execucao || null,
          data_validade: dados.data_validade || null,
          status: dados.status ?? 'Aberta',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as PT };
  } catch (erro) {
    console.error('Erro ao criar PT:', erro);
    return { sucesso: false, erro };
  }
}

export async function atualizarPt(id: string, dados: NovaPT) {
  try {
    const { data, error } = await supabase
      .from('pts')
      .update({
        numero_pt: dados.numero_pt,
        titulo: dados.titulo,
        tipo: dados.tipo,
        emitente: dados.emitente,
        executante: dados.executante,
        data_emissao: dados.data_emissao,
        data_execucao: dados.data_execucao || null,
        data_validade: dados.data_validade || null,
        status: dados.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Detalhes do erro Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    return { sucesso: true, dados: data as PT };
  } catch (erro) {
    console.error('Erro ao atualizar PT:', erro);
    return { sucesso: false, erro };
  }
}
