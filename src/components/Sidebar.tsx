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
  GraduationCap,
  Users,
  TrendingUp,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fazerLogout } from "@/services/authService";

const menuItems = [
  { nome: "Dashboard", href: "/", icone: LayoutDashboard },
  { nome: "Atividades", href: "/atividades", icone: ClipboardList },
  { nome: "Checklist Viaturas", href: "/checklist", icone: ClipboardCheck },
  { nome: "Relatórios", href: "/relatorios", icone: BarChart3 },
  { nome: "Solicitações", href: "/solicitacoes", icone: Mail },
  { nome: "PTs", href: "/pts", icone: Wrench },
  { nome: "Treinamentos", href: "/treinamentos", icone: GraduationCap },
  { nome: "RH", href: "/rh", icone: Users },
  { nome: "Indicadores", href: "/indicadores", icone: TrendingUp },
  { nome: "Administração", href: "/administracao", icone: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

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
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen p-4 flex flex-col">
      <h1 className="text-lg font-bold mb-6 px-2">Portal Rotinas Smart</h1>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => {
          const Icone = item.icone;
          return (
            <Link
              key={item.href}
              href={item.href}
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
        <span className="truncate">
          {email ? email : "Entrar"}
        </span>
      </button>
    </aside>
  );
}
