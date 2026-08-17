"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface GraficoPrioridadeProps {
  dados: { name: string; total: number }[];
}

export default function GraficoPrioridade({ dados }: GraficoPrioridadeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Atividades por Prioridade
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
