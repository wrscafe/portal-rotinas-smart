'use client';

import { useState } from 'react';
import { criarAtividade } from '@/services/atividadesService';

export default function AtividadesForm() {
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');

  // Estados de controle
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Função chamada ao enviar o formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // Impede o recarregamento da página
    setCarregando(true);
    setMensagem(null);

    // Chama o serviço para salvar no Supabase
    const resultado = await criarAtividade({
      titulo,
      descricao,
      responsavel,
    });

    if (resultado.sucesso) {
      setMensagem({ tipo: 'sucesso', texto: 'Atividade criada com sucesso!' });
      // Limpa o formulário
      setTitulo('');
      setDescricao('');
      setResponsavel('');
    } else {
      setMensagem({ tipo: 'erro', texto: 'Erro ao criar atividade. Tente novamente.' });
    }

    setCarregando(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nova Atividade</h1>

      {/* Mensagem de feedback */}
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

      {/* Campo Título */}
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Digite o título da atividade"
        />
      </div>

      {/* Campo Descrição */}
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Descreva a atividade"
          rows={3}
        />
      </div>

      {/* Campo Responsável */}
      <div>
        <label className="block text-sm font-medium mb-1">Responsável</label>
        <input
          type="text"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Nome do responsável"
        />
      </div>

      {/* Botão de salvar */}
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

