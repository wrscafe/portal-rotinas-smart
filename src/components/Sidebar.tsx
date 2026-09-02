"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  ClipboardCheck,
  BarChart3,
  Mail,
  Wrench,
  FileText,
  GraduationCap,
  Users,
  TrendingUp,
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fazerLogout } from "@/services/authService";

const menuItems = [
  { nome: "Dashboard", href: "/", icone: LayoutDashboard },
  { nome: "Atividades", href: "/atividades", icone: ClipboardList },
  { nome: "Checklist Viaturas", href: "/checklist", icone: ClipboardCheck },
  { nome: "Relatórios", href: "/relatorios", icone: BarChart3 },
  { nome: "Solicitações", href: "/solicitacoes", icone: Mail },
  { nome: "PT", href: "/pt", icone: Wrench },
  { nome: "Ordens de Serviço", href: "/ordens-servico", icone: FileText },
  { nome: "Treinamentos", href: "/treinamentos", icone: GraduationCap },
  { nome: "RH", href: "/rh", icone: Users },
  { nome: "Indicadores", href: "/indicadores", icone: TrendingUp },
  { nome: "Administração", href: "/administracao", icone: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false); // controla a sidebar no mobile

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleClick() {
    if (email) {
      await fazerLogout();
      setEmail(null);
      router.push("/login");
    } else {
      router.push("/login");
    }
  }

  return (
    <>
      {/* Botão hambúrguer - só aparece no mobile (some a partir de md:) */}
      <button
        onClick={() => setAberto(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay escuro - só aparece quando o menu está aberto no mobile */}
      {aberto && (
        <div
          onClick={() => setAberto(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen md:min-h-screen w-64
          bg-gray-900 text-gray-100 p-4 flex flex-col z-50
          transform transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <h1 className="text-lg font-bold">Portal Rotinas Smart</h1>
          {/* Botão fechar - só aparece no mobile */}
          <button
            onClick={() => setAberto(false)}
            className="md:hidden text-gray-300 hover:text-white"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => {
            const Icone = item.icone;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <Icone size={18} />
                <span>{item.nome}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm border-t border-gray-800 mt-2 pt-4"
        >
          {email ? <LogOut size={18} /> : <LogIn size={18} />}
          <span className="truncate">{email ? email : "Entrar"}</span>
        </button>
      </aside>
    </>
  );
}
