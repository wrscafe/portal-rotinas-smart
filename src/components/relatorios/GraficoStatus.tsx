"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GraficoStatusProps {
  dados: { name: string; value: number }[];
}

const CORES = ["#facc15", "#3b82f6", "#22c55e"]; // amarelo, azul, verde

export default function GraficoStatus({ dados }: GraficoStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Atividades por Status
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {dados.map((_, index) => (
              <Cell key={index} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
