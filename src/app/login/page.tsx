"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fazerLogin } from "@/services/authService"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    const resultado = await fazerLogin(email, senha)

    setCarregando(false)

    if (!resultado.sucesso) {
      setErro("E-mail ou senha inválidos.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800">
          Portal Rotinas Smart
        </h1>
        <p className="text-sm text-gray-500">Entre com sua conta</p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <a
            href="/esqueci-senha"
            className="text-sm text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </a>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Não tem conta?{" "}
          <a href="/cadastro" className="text-blue-600 hover:underline">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  )
}
