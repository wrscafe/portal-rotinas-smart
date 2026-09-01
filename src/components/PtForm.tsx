'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarPt, atualizarPt, buscarPtPorId } from '@/services/ptsService';
import { PT } from '@/types/pt';

type PtFormProps = {
  ptId?: string;
};

export default function PtForm({ ptId }: PtFormProps) {
  const router = useRouter();
  const modoEdicao = Boolean(ptId);

  // Estados para os campos do formulário
  const [numeroPt, setNumeroPt] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<PT['tipo']>('Trabalho a Quente');
  const [emitente, setEmitente] = useState('');
  const [executante, setExecutante] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [status, setStatus] = useState<PT['status']>('Aberta');

  // Estados de controle
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(modoEdicao);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Se estiver em modo edição, busca os dados da PT ao carregar a página
  useEffect(() => {
    if (!ptId) return;

    async function carregarDados() {
      const resultado = await buscarPtPorId(ptId!);

      if (resultado.sucesso && resultado.dados) {
        const pt = resultado.dados;
        setNumeroPt(pt.numero_pt);
        setTitulo(pt.titulo);
        setTipo(pt.tipo);
        setEmitente(pt.emitente);
        setExecutante(pt.executante);
        setDataEmissao(pt.data_emissao?.slice(0, 10) ?? '');
        setDataValidade(pt.data_validade?.slice(0, 10) ?? '');
        setStatus(pt.status);
      } else {
        setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar a PT.' });
      }

      setCarregandoDados(false);
    }

    carregarDados();
  }, [ptId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCarregando(true);
    setMensagem(null);

    const dados = {
      numero_pt: numeroPt,
      titulo,
      tipo,
      emitente,
      executante,
      data_emissao: dataEmissao,
      data_validade: dataValidade || null,
      status,
    };

    const resultado = modoEdicao
      ? await atualizarPt(ptId!, dados)
      : await criarPt(dados);

    if (resultado.sucesso) {
      setMensagem({
        tipo: 'sucesso',
        texto: modoEdicao ? 'PT atualizada com sucesso!' : 'PT criada com sucesso!',
      });

      if (!modoEdicao) {
        // Limpa o formulário apenas na criação
        setNumeroPt('');
        setTitulo('');
        setTipo('Trabalho a Quente');
        setEmitente('');
        setExecutante('');
        setDataEmissao('');
        setDataValidade('');
      } else {
        // Na edição, volta para a listagem após 1 segundo
        setTimeout(() => {
          router.push('/pt');
        }, 1000);
      }
    } else {
      setMensagem({
        tipo: 'erro',
        texto: modoEdicao ? 'Erro ao atualizar PT. Tente novamente.' : 'Erro ao criar PT. Tente novamente.',
      });
    }

    setCarregando(false);
  }

  if (carregandoDados) {
    return <p className="text-center p-6">Carregando dados da PT...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{modoEdicao ? 'Editar PT' : 'Nova PT'}</h1>

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

      {/* Número da PT */}
      <div>
        <label className="block text-sm font-medium mb-1">Número da PT</label>
        <input
          type="text"
          value={numeroPt}
          onChange={(e) => setNumeroPt(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: PT-2026-001"
        />
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Descreva o trabalho a ser realizado"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as PT['tipo'])}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Trabalho a Quente">Trabalho a Quente</option>
          <option value="Espaço Confinado">Espaço Confinado</option>
          <option value="Trabalho em Altura">Trabalho em Altura</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {/* Emitente */}
      <div>
        <label className="block text-sm font-medium mb-1">Emitente</label>
        <input
          type="text"
          value={emitente}
          onChange={(e) => setEmitente(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Nome de quem emite a PT"
        />
      </div>

      {/* Executante */}
      <div>
        <label className="block text-sm font-medium mb-1">Executante</label>
        <input
          type="text"
          value={executante}
          onChange={(e) => setExecutante(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Nome de quem vai executar o trabalho"
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

      {/* Data de Validade */}
      <div>
        <label className="block text-sm font-medium mb-1">Data de Validade</label>
        <input
          type="date"
          value={dataValidade}
          onChange={(e) => setDataValidade(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Status (só aparece em modo edição) */}
      {modoEdicao && (
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PT['status'])}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Aberta">Aberta</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Encerrada">Encerrada</option>
            <option value="Cancelada">Cancelada</option>
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
