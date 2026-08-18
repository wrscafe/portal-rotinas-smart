import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { ChecklistViatura } from "@/types/checklist";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  logo: { width: 50, height: 50 },
  title: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 10, textAlign: "center", color: "#666" },
  section: { marginBottom: 12, borderBottom: "1px solid #ddd", paddingBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6, backgroundColor: "#f3f4f6", padding: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  statusBox: { padding: 4, borderRadius: 4, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 20, left: 30, right: 30, textAlign: "center", fontSize: 8, color: "#999" },
});

function getStatusColor(status: string) {
  if (status === "Retida") return "#dc2626";
  if (status === "Liberada com Ressalva") return "#ca8a04";
  return "#16a34a";
}

export default function ChecklistPDF({ checklist }: { checklist: ChecklistViatura }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Image src="/logo_smart_redonda.png" style={styles.logo} />
          <View>
            <Text style={styles.title}>CHECKLIST DE VIATURA</Text>
            <Text style={styles.subtitle}>Relatório Diário</Text>
          </View>
          <View />
        </View>

        <View style={styles.row}>
          <Text>Nº Relatório: #{checklist.data.replace(/-/g,"")}-{checklist.viatura}</Text>
          <Text style={{ ...styles.statusBox, color: getStatusColor(checklist.status_geral) }}>
            Status: {checklist.status_geral}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS GERAIS</Text>
          <Text>Data: {new Date(checklist.data).toLocaleDateString('pt-BR')}    Hora: {checklist.hora}    Turno: {checklist.turno}</Text>
          <Text>Viatura: {checklist.viatura}    Motorista: {checklist.motorista}</Text>
          <Text>Quilometragem: {checklist.quilometragem} km</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NÍVEIS</Text>
          {checklist.niveis.map((n, i) => (
            <Text key={i}>
              {n.status === "OK" ? "✓" : "!"} {n.nome}: {n.status} {n.observacao ? `- ${n.observacao}` : ""}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LUZES DIANTEIRAS</Text>
          {checklist.luzes_dianteiras.map((l, i) => (
            <Text key={i}>{l.funcionando ? "✓" : "✗"} {l.nome}: {l.funcionando ? "Funcionando" : "Não Funciona"}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LUZES TRASEIRAS</Text>
          {checklist.luzes_traseiras.map((l, i) => (
            <Text key={i}>{l.funcionando ? "✓" : "✗"} {l.nome}: {l.funcionando ? "Funcionando" : "Não Funciona"}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VERIFICAÇÕES ADICIONAIS</Text>
          <Text>Avaria Externa: {checklist.avaria_externa}</Text>
          {checklist.avaria_descricao && <Text>Detalhe: {checklist.avaria_descricao}</Text>}
          <Text>Alerta no Painel: {checklist.alerta_painel}</Text>
          <Text>Pneus: {checklist.pneus}</Text>
          <Text>Cabine: {checklist.cabine}</Text>
        </View>

        {checklist.observacoes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OBSERVAÇÕES GERAIS</Text>
            <Text>{checklist.observacoes}</Text>
          </View>
        )}

        <View style={{ marginTop: 30 }}>
          <Text style={{ marginTop: 15 }}>Assinatura do Responsável: _________________________</Text>
        </View>

        <Text style={styles.footer}>
          Gerado automaticamente | {new Date().toLocaleString('pt-BR')}
        </Text>
      </Page>
    </Document>
  );
}
