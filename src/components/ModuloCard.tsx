import Link from "next/link";

interface ModuloCardProps {
  titulo: string;
  icon: string;
  href: string;
  color: string;
}

export default function ModuloCard({ titulo, icon, href, color }: ModuloCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <span className="font-medium text-gray-800">{titulo}</span>
    </Link>
  );
}
