"use client";

import dynamic from "next/dynamic";
import { ChecklistViatura } from "@/types/checklist";
import ChecklistPDF from "./ChecklistPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Carregando...</span> }
);

export default function BotaoExportarPDF({ checklist }: { checklist: ChecklistViatura }) {
  return (
    <PDFDownloadLink
      document={<ChecklistPDF checklist={checklist} />}
      fileName={`checklist_${checklist.viatura}_${checklist.data}.pdf`}
    >
      {({ loading }) => (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {loading ? "Gerando..." : "📄 Exportar PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
