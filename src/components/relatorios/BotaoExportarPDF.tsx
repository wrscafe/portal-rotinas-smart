"use client";

import dynamic from "next/dynamic";
import RelatorioPDF from "./RelatorioPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="bg-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-md inline-block">
        Carregando...
      </span>
    ),
  }
);

interface ResponsavelResumo {
  nome: string;
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
}

interface Atividade {
  titulo: string;
  descricao: string | null;
  status: string;
  prioridade: string;
  responsavel: string | null;
}

interface BotaoExportarPDFProps {
  periodo: string;
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  dadosResponsaveis: ResponsavelResumo[];
  atividades: Atividade[]; // ← novo
}

export default function BotaoExportarPDF(props: BotaoExportarPDFProps) {
  return (
    <PDFDownloadLink
      document={<RelatorioPDF {...props} />}
      fileName={`relatorio-atividades-${new Date().toISOString().slice(0, 10)}.pdf`}
      className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition inline-block"
    >
      {({ loading }) => (loading ? "Gerando PDF..." : "📄 Exportar PDF")}
    </PDFDownloadLink>
  );
}
