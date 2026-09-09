'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  listarMotoresEstacionarios,
  criarChecklistMotor,
  atualizarChecklistMotor,
} from '@/services/checklistMotoresService'
import { MotorEstacionario, NovoChecklistMotor, StatusVerificacao } from '@/types/checklistMotor'

// ---------- Sub-componente: campo Sim / Não / Não verificado ----------
function CampoVerificacao({
  label,
  value,
  onChange,
}: {
  label: string
  value: StatusVerificacao
  onChange: (v: StatusVerificacao) => void
}) {
  const opcoes: { valor: StatusVerificacao; texto: string; cor: string }[] = [
    { valor: true, texto: 'Sim', cor: 'bg-green-600' },
    { valor: false, texto: 'Não', cor: 'bg-red-600' },
    { valor: null, texto: 'Não verificado', cor: 'bg-gray-400' },
  ]

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        {opcoes.map((op) => (
          <button
            key={op.texto}
            type="button"
            onClick={() => onChange(op.valor)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              value === op.valor
                ? `${op.cor} text-white`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {op.texto}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Sub-componente: campo numérico simples ----------
function CampoNumero({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | null
  onChange: (v: number | null) => void
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        step="0.01"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  )
}

// ---------- Sub-componente: campo texto simples ----------
function CampoTexto({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string | null
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        required={required}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  )
}

// ---------- Sub-componente: campo select simples ----------
function CampoSelect({
  label,
  value,
  onChange,
  opcoes,
}: {
  label: string
  value: string | null
  onChange: (v: string) => void
  opcoes: string[]
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">Selecione...</option>
        {opcoes.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  )
}

// ---------- Sub-componente: seção/card ----------
function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">{titulo}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

// ---------- Estado inicial do formulário ----------
const estadoInicial: NovoChecklistMotor = {
  motor_id: '',
  data_checklist: new Date().toISOString().split('T')[0],
  numero_pt: null,
  local: null,
  verificador: '',
  matricula: null,
  operador: null,
  gerente: null,
  horimetro: null,
  nivel_oleo_antes: null,
  nivel_agua_antes: null,
  tensao_banco1_antes: null,
  tensao_banco2_antes: null,
  pressao_entrada_trocador_antes: null,
  rpm_durante: null,
  pressao_oleo_durante: null,
  pressao_motor_durante: null,
  pressao_entrada_trocador_durante: null,
  temp_motor_durante: null,
  mancal_la_durante: null,
  mancal_loa_durante: null,
  condicao_mangueiras: null,
  tem_agua_intercooler: null,
  vazamento_gaxetas: null,
  drenos_gaxeta_obstruidos: null,
  valvulas_agua_posicao_correta: null,
  vazamento_dreno_bomba: null,
  lacres_reguladores_integros: null,
  ruido_anormal: null,
  eletrovalvula_abriu: null,
  gaxeta_ajustada: null,
  temp_motor_depois: null,
  pressao_entrada_trocador_depois: null,
  entrada_saida_trocadores: null,
  mancal_la_depois: null,
  mancal_loa_depois: null,
  anormalidade: null,
  observacoes: null,
}

// ---------- Props do componente ----------
interface ChecklistMotorFormProps {
  checklistId?: string // se presente, o formulário entra em modo edição
  dadosIniciais?: NovoChecklistMotor // dados já salvos, usados para preencher o form
}

// ---------- Componente principal ----------
export default function ChecklistMotorForm({ checklistId, dadosIniciais }: ChecklistMotorFormProps) {
  const router = useRouter()
  const [motores, setMotores] = useState<MotorEstacionario[]>([])
  const [form, setForm] = useState<NovoChecklistMotor>(dadosIniciais ?? estadoInicial)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarMotoresEstacionarios().then(setMotores).catch(console.error)
  }, [])

  // Motor selecionado (para saber a marca e mostrar campos condicionais)
  const motorSelecionado = motores.find((m) => m.id === form.motor_id)
  const marca = motorSelecionado?.marca?.toUpperCase() ?? ''

  const ehCumminsOuCaterpillar = marca === 'CUMMINS' || marca === 'CATERPILLAR'
  const ehCummins = marca === 'CUMMINS'
  const ehScaniaOuMercedes = marca === 'SCANIA' || marca === 'MERCEDES'

  function atualizar<K extends keyof NovoChecklistMotor>(campo: K, valor: NovoChecklistMotor[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!form.motor_id) {
      setErro('Selecione o motor.')
      return
    }

    setSalvando(true)
    try {
      if (checklistId) {
        await atualizarChecklistMotor(checklistId, form)
      } else {
        await criarChecklistMotor(form)
      }
      router.push('/checklist-motor')
      router.refresh()
    } catch (err) {
      console.error(err)
      setErro('Erro ao salvar o checklist. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      {/* Identificação */}
      <Secao titulo="Identificação">
        <div className="mb-4 sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Motor <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.motor_id}
            onChange={(e) => atualizar('motor_id', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione o motor...</option>
            {motores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} {m.marca ? `(${m.marca})` : ''}
              </option>
            ))}
          </select>
        </div>

        <CampoTexto label="Verificador" value={form.verificador} onChange={(v) => atualizar('verificador', v)} required />
        <CampoTexto label="Matrícula" value={form.matricula} onChange={(v) => atualizar('matricula', v)} />
        <CampoTexto label="Local" value={form.local} onChange={(v) => atualizar('local', v)} />
        <CampoTexto label="Número da PT" value={form.numero_pt} onChange={(v) => atualizar('numero_pt', v)} />
        <CampoTexto label="Operador" value={form.operador} onChange={(v) => atualizar('operador', v)} />
        <CampoTexto label="TS Líder" value={form.gerente} onChange={(v) => atualizar('gerente', v)} />
        <CampoNumero label="Horímetro" value={form.horimetro} onChange={(v) => atualizar('horimetro', v)} />
      </Secao>

      {/* Etapa 1: Antes de partir */}
      <Secao titulo="Antes de Partir">
        <CampoSelect
          label="Nível de óleo"
          value={form.nivel_oleo_antes}
          onChange={(v) => atualizar('nivel_oleo_antes', v)}
          opcoes={['Baixo', 'Médio', 'Normal']}
        />
        <CampoTexto label="Nível de líquido de arrefecimento" value={form.nivel_agua_antes} onChange={(v) => atualizar('nivel_agua_antes', v)} />
        <CampoNumero label="Tensão banco de baterias 1" value={form.tensao_banco1_antes} onChange={(v) => atualizar('tensao_banco1_antes', v)} />
        <CampoNumero label="Tensão banco de baterias 2" value={form.tensao_banco2_antes} onChange={(v) => atualizar('tensao_banco2_antes', v)} />
        <CampoNumero label="Pressão de entrada do trocador (antes de partir)" value={form.pressao_entrada_trocador_antes} onChange={(v) => atualizar('pressao_entrada_trocador_antes', v)} />
      </Secao>

      {/* Etapa 2: Durante o funcionamento */}
      <Secao titulo="Durante o Funcionamento">
        <CampoNumero label="RPM" value={form.rpm_durante} onChange={(v) => atualizar('rpm_durante', v)} />
        <CampoNumero label="Pressão de óleo" value={form.pressao_oleo_durante} onChange={(v) => atualizar('pressao_oleo_durante', v)} />
        <CampoNumero label="Pressão de entrada do trocador" value={form.pressao_entrada_trocador_durante} onChange={(v) => atualizar('pressao_entrada_trocador_durante', v)} />
        <CampoNumero label="Temperatura do motor" value={form.temp_motor_durante} onChange={(v) => atualizar('temp_motor_durante', v)} />
        <CampoNumero label="Mancal da bomba - LA (motor)" value={form.mancal_la_durante} onChange={(v) => atualizar('mancal_la_durante', v)} />
        <CampoNumero label="Mancal da bomba - LOA (bomba)" value={form.mancal_loa_durante} onChange={(v) => atualizar('mancal_loa_durante', v)} />
        <CampoTexto label="Condição das mangueiras" value={form.condicao_mangueiras} onChange={(v) => atualizar('condicao_mangueiras', v)} />
      </Secao>

      {/* Verificações — condicionais por marca */}
      <Secao titulo="Verificações">
        {ehCummins && (
          <CampoVerificacao label="Tem água no intercooler? (CUMMINS)" value={form.tem_agua_intercooler} onChange={(v) => atualizar('tem_agua_intercooler', v)} />
        )}
        <CampoVerificacao label="Vazamento nas gaxetas?" value={form.vazamento_gaxetas} onChange={(v) => atualizar('vazamento_gaxetas', v)} />
        <CampoVerificacao label="Drenos da gaxeta obstruídos?" value={form.drenos_gaxeta_obstruidos} onChange={(v) => atualizar('drenos_gaxeta_obstruidos', v)} />
        {ehCumminsOuCaterpillar && (
          <>
            <CampoVerificacao label="Válvulas de água na posição correta? (CUMMINS/CATERPILLAR)" value={form.valvulas_agua_posicao_correta} onChange={(v) => atualizar('valvulas_agua_posicao_correta', v)} />
            <CampoVerificacao label="Lacres dos reguladores de pressão íntegros?" value={form.lacres_reguladores_integros} onChange={(v) => atualizar('lacres_reguladores_integros', v)} />
          </>
        )}
        <CampoVerificacao label="Vazamentos no dreno da bomba do motor?" value={form.vazamento_dreno_bomba} onChange={(v) => atualizar('vazamento_dreno_bomba', v)} />
        <CampoVerificacao label="Ruído anormal?" value={form.ruido_anormal} onChange={(v) => atualizar('ruido_anormal', v)} />
        {(ehCumminsOuCaterpillar || ehScaniaOuMercedes) && (
          <CampoVerificacao
            label={ehScaniaOuMercedes ? 'Válvula termostática abriu? (SCANIA/MERCEDES)' : 'Eletroválvula abriu? (CUMMINS/CATERPILLAR)'}
            value={form.eletrovalvula_abriu}
            onChange={(v) => atualizar('eletrovalvula_abriu', v)}
          />
        )}
        <CampoVerificacao label="Gaxeta foi ajustada?" value={form.gaxeta_ajustada} onChange={(v) => atualizar('gaxeta_ajustada', v)} />
      </Secao>

      {/* Etapa 3: Após o teste */}
      <Secao titulo="Após o Tempo de Teste">
        <CampoNumero label="Temperatura do motor" value={form.temp_motor_depois} onChange={(v) => atualizar('temp_motor_depois', v)} />
        <CampoNumero label="Pressão de entrada do trocador" value={form.pressao_entrada_trocador_depois} onChange={(v) => atualizar('pressao_entrada_trocador_depois', v)} />
        <CampoTexto label="Entrada e saída dos trocadores/radiador" value={form.entrada_saida_trocadores} onChange={(v) => atualizar('entrada_saida_trocadores', v)} />
        <CampoNumero label="Mancal da bomba - LA (motor)" value={form.mancal_la_depois} onChange={(v) => atualizar('mancal_la_depois', v)} />
        <CampoNumero label="Mancal da bomba - LOA (bomba)" value={form.mancal_loa_depois} onChange={(v) => atualizar('mancal_loa_depois', v)} />
        <CampoVerificacao label="Anormalidade?" value={form.anormalidade} onChange={(v) => atualizar('anormalidade', v)} />
      </Secao>

      {/* Observações */}
      <Secao titulo="Observações">
        <div className="sm:col-span-2">
          <textarea
            value={form.observacoes ?? ''}
            onChange={(e) => atualizar('observacoes', e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Descreva qualquer anormalidade ou observação relevante..."
          />
        </div>
      </Secao>

      {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {salvando ? 'Salvando...' : checklistId ? 'Atualizar Checklist' : 'Salvar Checklist'}
      </button>
    </form>
  )
}
