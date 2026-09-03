import { createClient } from '@/lib/supabase/client';
import { OrdemServico } from '@/types/ordemServico';


const supabase = createClient();

type NovaOrdemServico = {
  numero_osm: string;
  data_emissao: string;
  equipamento: string;
  prioridade: OrdemServico['prioridade'];
  descricao_solicitada: string;
  descricao_realizada?: string | null;
  pecas_utilizadas?: string | null;
  status_assinatura?: OrdemServico['status_assinatura'];
};

export async function listarOrdensServico() {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*')
      .order('data_emissao', { ascending: false });

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as OrdemServico[] };
  } catch (erro) {
    console.error('Erro ao listar ordens de serviço:', erro);
    return { sucesso: false, erro, dados: [] as OrdemServico[] };
  }
}

export async function buscarOrdemServicoPorId(id: string) {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as OrdemServico };
  } catch (erro) {
    console.error('Erro ao buscar ordem de serviço:', erro);
    return { sucesso: false, erro, dados: null };
  }
}

export async function criarOrdemServico(dados: NovaOrdemServico) {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .insert([
        {
          numero_osm: dados.numero_osm,
          data_emissao: dados.data_emissao,
          equipamento: dados.equipamento,
          prioridade: dados.prioridade,
          descricao_solicitada: dados.descricao_solicitada,
          descricao_realizada: dados.descricao_realizada || null,
          pecas_utilizadas: dados.pecas_utilizadas || null,
          status_assinatura: dados.status_assinatura || 'Aguardando Assinatura',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as OrdemServico };
  } catch (erro) {
    console.error('Erro ao criar ordem de serviço:', erro);
    return { sucesso: false, erro, dados: null };
  }
}

export async function atualizarOrdemServico(
  id: string,
  dados: Partial<NovaOrdemServico>
) {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .update({
        numero_osm: dados.numero_osm,
        data_emissao: dados.data_emissao,
        equipamento: dados.equipamento,
        prioridade: dados.prioridade,
        descricao_solicitada: dados.descricao_solicitada,
        descricao_realizada: dados.descricao_realizada ?? null,
        pecas_utilizadas: dados.pecas_utilizadas ?? null,
        status_assinatura: dados.status_assinatura,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { sucesso: true, dados: data as OrdemServico };
  } catch (erro) {
    console.error('Erro ao atualizar ordem de serviço:', erro);
    return { sucesso: false, erro, dados: null };
  }
}

export async function deletarOrdemServico(id: string) {
  try {
    const { error } = await supabase
      .from('ordens_servico')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao deletar ordem de serviço:', erro);
    return { sucesso: false, erro };
  }
}
