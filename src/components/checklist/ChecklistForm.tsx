"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const VIATURAS = ["AB-01","AB-02","AB-03","AB-04","AB-05","AB-06","AB-07","AB-08"];
const NIVEIS_PADRAO = ["Óleo do Motor","Óleo Hidráulico","Diesel","Arrefecimento","Limpador de Parabrisa","Ar (pneus/sistema)"];
const LUZES_DIANTEIRAS_PADRAO = ["Farol Alto","Farol Baixo","Seta Direita","Seta Esquerda"];
const LUZES_TRASEIRAS_PADRAO = ["Lanternas","Seta Direita","Seta Esquerda"];

export default function ChecklistForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0,5),
    turno: "Manhã",
    viatura: "AB-01",
    motorista: "",
    quilometragem: "",
    avaria_externa: "Não",
    avaria_descricao: "",
    alerta_painel: "Nenhum",
    pneus: "OK",
    cabine: "OK",
    observacoes: "",
  });

  const [niveis, setNiveis] = useState(
    NIVEIS_PADRAO.map(nome => ({ nome, status: "OK", observacao: "" }))
  );
  const [luzesDianteiras, setLuzesDianteiras] = useState(
    LUZES_DIANTEIRAS_PADRAO.map(nome => ({ nome, funcionando: true }))
  );
  const [luzesTraseiras, setLuzesTraseiras] = useState(
    LUZES_TRASEIRAS_PADRAO.map(nome => ({ nome, funcionando: true }))
  );

  function calcularStatusGeral() {
    const temProblemaGrave = form.avaria_externa === "Sim" || 
      form.alerta_painel !== "Nenhum" || form.pneus === "Crítico";
    const temRessalva = niveis.some(n => n.status !== "OK") ||
      luzesDianteiras.some(l => !l.funcionando) ||
      luzesTraseiras.some(l => !l.funcionando) ||
      form.pneus === "Atenção";

    if (temProblemaGrave) return "Retida";
    if (temRessalva) return "Liberada com Ressalva";
    return "Liberada";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const status_geral = calcularStatusGeral();

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("checklist_viaturas").insert({
      ...form,
      quilometragem: parseInt(form.quilometragem),
      niveis,
      luzes_dianteiras: luzesDianteiras,
      luzes_traseiras: luzesTraseiras,
      status_geral,
      usuario_id: userData?.user?.id,
    });

    setLoading(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    router.push("/checklist");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      
      {/* Dados Gerais */}
      <fieldset className="bg-white p-4 rounded-lg shadow space-y-3">
        <legend className="font-bold text-gray-700">Dados Gerais</legend>
        <div className="grid grid-cols-2 gap-4">
          <label>Data
            <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})}
              className="w-full border rounded p-2 mt-1" required />
          </label>
          <label>Hora
            <input type="time" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})}
              className="w-full border rounded p-2 mt-1" required />
          </label>
          <label>Turno
            <select value={form.turno} onChange={e => setForm({...form, turno: e.target.value})}
              className="w-full border rounded p-2 mt-1">
              <option>Manhã</option><option>Tarde</option><option>Noite</option>
            </select>
          </label>
          <label>Viatura
            <select value={form.viatura} onChange={e => setForm({...form, viatura: e.target.value})}
              className="w-full border rounded p-2 mt-1">
              {VIATURAS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>Colaborador
         <input type="text" value={form.motorista} onChange={e => setForm({...form, motorista: e.target.value})}
             className="w-full border rounded p-2 mt-1" required />
            </label>

          <label>Quilometragem
            <input type="number" value={form.quilometragem} onChange={e => setForm({...form, quilometragem: e.target.value})}
              className="w-full border rounded p-2 mt-1" required />
          </label>
        </div>
      </fieldset>

      {/* Níveis */}
      <fieldset className="bg-white p-4 rounded-lg shadow space-y-3">
        <legend className="font-bold text-gray-700">Níveis</legend>
        {niveis.map((n, i) => (
          <div key={n.nome} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm">{n.nome}</span>
            <select value={n.status} onChange={e => {
              const novo = [...niveis]; novo[i].status = e.target.value as any; setNiveis(novo);
            }} className="border rounded p-1 text-sm">
              <option>OK</option><option>Baixo</option><option>Crítico</option>
            </select>
            <input type="text" placeholder="Observação" value={n.observacao}
              onChange={e => { const novo = [...niveis]; novo[i].observacao = e.target.value; setNiveis(novo); }}
              className="border rounded p-1 text-sm" />
          </div>
        ))}
      </fieldset>

      {/* Luzes Dianteiras */}
      <fieldset className="bg-white p-4 rounded-lg shadow space-y-2">
        <legend className="font-bold text-gray-700">Luzes Dianteiras</legend>
        {luzesDianteiras.map((l, i) => (
          <label key={l.nome} className="flex items-center gap-2">
            <input type="checkbox" checked={l.funcionando}
              onChange={e => { const novo = [...luzesDianteiras]; novo[i].funcionando = e.target.checked; setLuzesDianteiras(novo); }} />
            {l.nome}
          </label>
        ))}
      </fieldset>

      {/* Luzes Traseiras */}
      <fieldset className="bg-white p-4 rounded-lg shadow space-y-2">
        <legend className="font-bold text-gray-700">Luzes Traseiras</legend>
        {luzesTraseiras.map((l, i) => (
          <label key={l.nome} className="flex items-center gap-2">
            <input type="checkbox" checked={l.funcionando}
              onChange={e => { const novo = [...luzesTraseiras]; novo[i].funcionando = e.target.checked; setLuzesTraseiras(novo); }} />
            {l.nome}
          </label>
        ))}
      </fieldset>

      {/* Verificações adicionais */}
      <fieldset className="bg-white p-4 rounded-lg shadow space-y-3">
        <legend className="font-bold text-gray-700">Verificações Adicionais</legend>
        <div className="grid grid-cols-2 gap-4">
          <label>Avaria Externa
            <select value={form.avaria_externa} onChange={e => setForm({...form, avaria_externa: e.target.value})}
              className="w-full border rounded p-2 mt-1">
              <option>Não</option><option>Sim</option>
            </select>
          </label>
          <label>Alerta no Painel
            <input type="text" value={form.alerta_painel} onChange={e => setForm({...form, alerta_painel: e.target.value})}
              className="w-full border rounded p-2 mt-1" placeholder="Nenhum" />
          </label>
          <label>Pneus
            <select value={form.pneus} onChange={e => setForm({...form, pneus: e.target.value})}
              className="w-full border rounded p-2 mt-1">
              <option>OK</option><option>Atenção</option><option>Crítico</option>
            </select>
          </label>
          <label>Cabine
            <input type="text" value={form.cabine} onChange={e => setForm({...form, cabine: e.target.value})}
              className="w-full border rounded p-2 mt-1" />
          </label>
        </div>
        {form.avaria_externa === "Sim" && (
          <textarea placeholder="Descreva a avaria" value={form.avaria_descricao}
            onChange={e => setForm({...form, avaria_descricao: e.target.value})}
            className="w-full border rounded p-2" rows={2} />
        )}
      </fieldset>

      {/* Observações */}
      <fieldset className="bg-white p-4 rounded-lg shadow">
        <legend className="font-bold text-gray-700">Observações Gerais</legend>
        <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
          className="w-full border rounded p-2" rows={3} />
      </fieldset>

      <button type="submit" disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
        {loading ? "Salvando..." : "Salvar Checklist"}
      </button>
    </form>
  );
}
