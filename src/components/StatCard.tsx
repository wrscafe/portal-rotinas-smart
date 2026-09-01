import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  href?: string;
  active?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  href,
  active = false,
}: StatCardProps) {
  const conteudo = (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 transition hover:shadow-md ${
        active ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      } ${href ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
          Ativo
        </span>
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{conteudo}</Link>;
  }

  return conteudo;
}
