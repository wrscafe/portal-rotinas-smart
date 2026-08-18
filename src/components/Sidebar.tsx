"use client";

import Link from "next/link";
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
} from "lucide-react";

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
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen p-4">
      <h1 className="text-lg font-bold mb-6 px-2">Portal Rotinas Smart</h1>
      <nav className="flex flex-col gap-1">
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
    </aside>
  );
}
