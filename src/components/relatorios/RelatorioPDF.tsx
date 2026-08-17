import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

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

interface RelatorioPDFProps {
  periodo: string;
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  dadosResponsaveis: ResponsavelResumo[];
  atividades: Atividade[];
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  logo: { width: 50, height: 50 },
  titulo: { fontSize: 18, fontWeight: "bold" },
  subtitulo: { fontSize: 11, color: "#666" },
  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
  },
  cardLabel: { fontSize: 9, color: "#666", marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: "bold" },
  secaoTitulo: { fontSize: 13, fontWeight: "bold", marginBottom: 10, marginTop: 10 },
  tabelaHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tabelaRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 6,
  },
  colNome: { flex: 2, fontWeight: "bold" },
  col: { flex: 1, textAlign: "center" },
  atividadeItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  atividadeTitulo: { fontSize: 11, fontWeight: "bold", marginBottom: 2 },
  atividadeDescricao: { fontSize: 9, color: "#555", marginBottom: 4 },
  atividadeMeta: { fontSize: 8, color: "#888" },
  rodape: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

export default function RelatorioPDF({
  periodo,
  total,
  pendentes,
  emAndamento,
  concluidas,
  dadosResponsaveis,
  atividades,
}: RelatorioPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo_smart_redonda.png" style={styles.logo} />
          <View>
            <Text style={styles.titulo}>Relatório de Atividades</Text>
            <Text style={styles.subtitulo}>Período: {periodo}</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total</Text>
            <Text style={styles.cardValue}>{total}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pendentes</Text>
            <Text style={styles.cardValue}>{pendentes}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Em Andamento</Text>
            <Text style={styles.cardValue}>{emAndamento}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Concluídas</Text>
            <Text style={styles.cardValue}>{concluidas}</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Atividades por Responsável</Text>

        <View style={styles.tabelaHeader}>
          <Text style={styles.colNome}>Responsável</Text>
          <Text style={styles.col}>Total</Text>
          <Text style={styles.col}>Pendentes</Text>
          <Text style={styles.col}>Em Andamento</Text>
          <Text style={styles.col}>Concluídas</Text>
        </View>

        {dadosResponsaveis.map((r) => (
          <View style={styles.tabelaRow} key={r.nome}>
            <Text style={styles.colNome}>{r.nome}</Text>
            <Text style={styles.col}>{r.total}</Text>
            <Text style={styles.col}>{r.pendentes}</Text>
            <Text style={styles.col}>{r.emAndamento}</Text>
            <Text style={styles.col}>{r.concluidas}</Text>
          </View>
        ))}

        <Text style={styles.secaoTitulo}>Detalhamento das Atividades</Text>

        {atividades.map((a, index) => (
          <View style={styles.atividadeItem} key={index}>
            <Text style={styles.atividadeTitulo}>{a.titulo}</Text>
            {a.descricao && (
              <Text style={styles.atividadeDescricao}>{a.descricao}</Text>
            )}
            <Text style={styles.atividadeMeta}>
              Responsável: {a.responsavel ?? "-"}  |  Status: {a.status}  |  Prioridade: {a.prioridade}
            </Text>
          </View>
        ))}

        <Text style={styles.rodape}>
          Gerado pelo Portal Rotinas Smart em {new Date().toLocaleDateString("pt-BR")}
        </Text>
      </Page>
    </Document>
  );
}
