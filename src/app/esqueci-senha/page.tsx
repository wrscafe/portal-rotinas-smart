"use client";

import { useState } from "react";
import Link from "next/link";
import { enviarEmailRecuperacao } from "@/services/authService";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setCarregando(true);

    const resultado = await enviarEmailRecuperacao(email);

    setCarregando(false);

    if (!resultado.sucesso) {
      setErro(resultado.erro ?? "Erro ao enviar e-mail.");
      return;
    }

    setMensagem("Enviamos um link de recuperação para seu e-mail!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Esqueci minha senha
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Digite seu e-mail para receber o link de recuperação.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {mensagem && <p className="text-sm text-green-600">{mensagem}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {carregando ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>

        <Link
          href="/login"
          className="block text-center text-sm text-gray-500 mt-4 hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
