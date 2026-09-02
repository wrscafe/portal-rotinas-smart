'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  criarOrdemServico,
  atualizarOrdemServico,
  buscarOrdemServicoPorId,
} from '@/services/ordensServicoService';
import { OrdemServico } from '@/types/ordemServico';

type OsmFormProps = {
  osmId?: string;
};

export default function OsmForm({ osmId }: OsmFormProps) {
  const router = useRouter();
  const modoEdicao = Boolean(osmId);

  // Estados dos campos do formulário
  const [numeroOsm, setNumeroOsm] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [prioridade, setPrioridade] = useState<OrdemServico['prioridade']>('Média');
  const [descricaoSolicitada, setDescricaoSolicitada] = useState('');
  const [descricaoRealizada, setDescricaoRealizada] = useState('');
  const [pecasUtilizadas, setPecasUtilizadas] = useState('');
  const [statusAssinatura, setStatusAssinatura] = useState<OrdemServico['status_assinatura']>(
    'Aguardando Assinatura'
  );

  // Estados de controle
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(modoEdicao);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  // Se estiver em modo edição, busca os dados da OSM ao carregar a página
  useEffect(() => {
    if (!osmId) return;

    async function carregarDados() {
      const resultado = await buscarOrdemServicoPorId(osmId!);

      if (resultado.sucesso && resultado.dados) {
        const osm = resultado.dados;
        setNumeroOsm(osm.numero_osm);
        setDataEmissao(osm.data_emissao?.slice(0, 10) ?? '');
        setEquipamento(osm.equipamento);
        setPrioridade(osm.prioridade);
        setDescricaoSolicitada(osm.descricao_solicitada);
        setDescricaoRealizada(osm.descricao_realizada ?? '');
        setPecasUtilizadas(osm.pecas_utilizadas ?? '');
        setStatusAssinatura(osm.status_assinatura);
      } else {
        setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar a OSM.' });
      }

      setCarregandoDados(false);
    }

    carregarDados();
  }, [osmId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCarregando(true);
    setMensagem(null);

    const dados = {
      numero_osm: numeroOsm,
      data_emissao: dataEmissao,
      equipamento,
      prioridade,
      descricao_solicitada: descricaoSolicitada,
      descricao_realizada: descricaoRealizada || null,
      pecas_utilizadas: pecasUtilizadas || null,
      status_assinatura: statusAssinatura,
    };

    const resultado = modoEdicao
      ? await atualizarOrdemServico(osmId!, dados)
      : await criarOrdemServico(dados);

    if (resultado.sucesso) {
      setMensagem({
        tipo: 'sucesso',
        texto: modoEdicao ? 'OSM atualizada com sucesso!' : 'OSM criada com sucesso!',
      });

      if (!modoEdicao) {
        // Limpa o formulário apenas na criação
        setNumeroOsm('');
        setDataEmissao('');
        setEquipamento('');
        setPrioridade('Média');
        setDescricaoSolicitada('');
        setDescricaoRealizada('');
        setPecasUtilizadas('');
      } else {
        // Na edição, volta para a listagem após 1 segundo
        setTimeout(() => {
          router.push('/ordens-servico');
        }, 1000);
      }
    } else {
      setMensagem({
        tipo: 'erro',
        texto: modoEdicao ? 'Erro ao atualizar OSM. Tente novamente.' : 'Erro ao criar OSM. Tente novamente.',
      });
    }

    setCarregando(false);
  }

  if (carregandoDados) {
    return <p className="text-center p-6">Carregando dados da OSM...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{modoEdicao ? 'Editar OSM' : 'Nova OSM'}</h1>

      {mensagem && (
        <div
          className={`p-3 rounded ${
            mensagem.tipo === 'sucesso'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Número da OSM */}
      <div>
        <label className="block text-sm font-medium mb-1">Número da OSM</label>
        <input
          type="text"
          value={numeroOsm}
          onChange={(e) => setNumeroOsm(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: OSM-2026-001"
        />
      </div>

      {/* Data de Emissão */}
      <div>
        <label className="block text-sm font-medium mb-1">Data de Emissão</label>
        <input
          type="date"
          value={dataEmissao}
          onChange={(e) => setDataEmissao(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Equipamento */}
      <div>
        <label className="block text-sm font-medium mb-1">Equipamento</label>
        <input
          type="text"
          value={equipamento}
          onChange={(e) => setEquipamento(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Bomba 03-A"
        />
      </div>

      {/* Prioridade */}
      <div>
        <label className="block text-sm font-medium mb-1">Prioridade</label>
        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value as OrdemServico['prioridade'])}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
      </div>

      {/* Descrição Solicitada */}
      <div>
        <label className="block text-sm font-medium mb-1">Descrição Solicitada</label>
        <textarea
          value={descricaoSolicitada}
          onChange={(e) => setDescricaoSolicitada(e.target.value)}
          required
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="Descreva o que a refinaria solicitou"
        />
      </div>

      {/* Descrição Realizada (só em edição) */}
      {modoEdicao && (
        <div>
          <label className="block text-sm font-medium mb-1">Descrição Realizada</label>
          <textarea
            value={descricaoRealizada}
            onChange={(e) => setDescricaoRealizada(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Descreva o que foi realizado"
          />
        </div>
      )}

      {/* Peças Utilizadas (só em edição) */}
      {modoEdicao && (
        <div>
          <label className="block text-sm font-medium mb-1">Peças Utilizadas</label>
          <textarea
            value={pecasUtilizadas}
            onChange={(e) => setPecasUtilizadas(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
            placeholder="Liste as peças utilizadas"
          />
        </div>
      )}

      {/* Status de Assinatura (só em edição) */}
      {modoEdicao && (
        <div>
          <label className="block text-sm font-medium mb-1">Status de Assinatura</label>
          <select
            value={statusAssinatura}
            onChange={(e) =>
              setStatusAssinatura(e.target.value as OrdemServico['status_assinatura'])
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="Aguardando Assinatura">Aguardando Assinatura</option>
            <option value="Assinado">Assinado</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {carregando ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
