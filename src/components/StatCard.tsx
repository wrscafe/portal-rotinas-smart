interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}
        >
          Ativo
        </span>
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
