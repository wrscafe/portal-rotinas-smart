## 🗓️ Data da documentação
**14 de agosto de 2026**

---

## 🎯 Visão Geral do Projeto

**Portal Rotinas Smart** — Sistema para controle de atividades da empresa (SMART/REGAP).

**Objetivo:** Criar um sistema web profissional, seguro, escalável e modular, servindo como principal projeto de aprendizado do Wagner rumo à área de tecnologia.

**Stack (tecnologias):**
| Tecnologia | Função |
|---|---|
| Next.js | Framework React (roteamento, renderização) |
| React | Biblioteca de interface (componentes) |
| TypeScript | JavaScript com tipagem estática |
| Tailwind CSS | Framework de estilos (classes utilitárias) |
| Supabase | Backend/banco de dados (já configurado) |
| GitHub | Versionamento de código |
| GitHub Codespaces | Ambiente de desenvolvimento na nuvem |
| Vercel | Hospedagem (deploy) |

**Visual inspirado em:** Notion, Linear, Jira, Monday e ClickUp (design limpo, cards, tabelas, filtros).

---

## 📦 Módulos planejados

- ✅ Dashboard *(em andamento)*
- ✅ Atividades *(em andamento)*
- ⬜ Relatórios
- ⬜ Solicitações
- ⬜ PTs
- ⬜ Treinamentos
- ⬜ RH
- ⬜ Indicadores
- ⬜ Administração
- ⬜ Controle de usuários

---

## ✅ O que já foi feito

### Etapa 1 — Setup e configuração inicial
- Projeto criado com `create-next-app`
- Supabase já configurado e funcionando
- Repositório no GitHub: **https://github.com/wagnerrol13/portal-rotinas-smart**
- Primeiro commit feito (automático pelo `create-next-app`)
- Código enviado via `git push origin main` (funcionou!)

### Etapa 2 — Página inicial
- Substituída a página padrão do Next.js por uma saudação simples "Portal Rotinas Smart"

### Etapa 3 — Sidebar (menu lateral)
- Criado o componente `src/components/Sidebar.tsx`
- Menu escuro (cinza) com todos os módulos: Dashboard, Atividades, Relatórios, Solicitações, PTs, Treinamentos, RH, Indicadores, Administração
- Links apontando para as rotas futuras (algumas ainda não existem)

### Etapa 4 — Layout raiz
- Modificado `src/app/layout.tsx`
- Sidebar integrada no layout → aparece em TODAS as páginas automaticamente
- Estrutura: Sidebar (esquerda) + conteúdo (direita), lado a lado
- Fonte Inter aplicada + fundo `bg-gray-50`
- Título da aba: "Portal Rotinas Smart"
- Idioma: `pt-BR`

### Etapa 5 — Dashboard (página inicial)
- Criado o componente `src/components/StatCard.tsx` (card reutilizável de estatística)
- Atualizado `src/app/page.tsx` com:
  - Saudação personalizada ao Wagner
  - 4 cards de estatísticas (Atividades Pendentes, Concluídas Hoje, Solicitações Abertas, PTs em Andamento)
  - Grid responsivo (1 coluna mobile → 4 colunas desktop)
  - Seção "Atividades Recentes"

### Etapa 6 — Página de Atividades
- Criada a pasta `src/app/atividades/`
- Criado o arquivo `src/app/atividades/page.tsx` (rota `/atividades`)
- Tabela de listagem com: Título, Responsável, Status, Prioridade, Data
- Badges coloridos para Status (`StatusBadge`) e Prioridade (`PrioridadeBadge`)
- Campo de busca (visual, ainda não funcional)
- Botão "+ Nova Atividade" → aponta para `/atividades/nova` (rota ainda não criada)
- Dados **mockados** (fictícios) para visualizar o layout

---

## 📁 Estrutura atual do projeto

```
portal-rotinas-smart/
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── public/
└── src/
    ├── app/
    │   ├── atividades/
    │   │   └── page.tsx          ← Listagem de atividades (com mock)
    │   ├── layout.tsx            ← Layout raiz (com Sidebar)
    │   ├── page.tsx              ← Dashboard
    │   └── globals.css
    └── components/
        ├── Sidebar.tsx           ← Menu lateral
        └── StatCard.tsx          ← Card de estatística
```

---

## 🗄️ Banco de dados (Supabase)

- **Status:** Configurado e funcionando, mas ainda **não criamos tabelas**
- Ainda não há conexão do frontend com o Supabase
- Os dados exibidos são mockados (fictícios)

---

## 🔑 Conceitos aprendidos até aqui

| Conceito | O que é |
|---|---|
| **Componente** | Peça reutilizável de interface (como bloco de LEGO) |
| **Props** | Dados passados para um componente (parâmetros) |
| **Interface (TS)** | Contrato que define a estrutura dos dados |
| **App Router** | Sistema de rotas do Next.js (pasta = rota) |
| **`layout.tsx`** | "Molde" que envolve todas as páginas |
| **`page.tsx`** | Página de uma rota específica |
| **`{children}`** | O conteúdo da página atual dentro do layout |
| **Mock** | Dados fictícios para testar antes do banco real |
| **`.map()`** | Percorre um array e gera elementos na tela |
| **`key`** | Identificador único em listas React |
| **Responsividade** | Site que se adapta ao tamanho da tela (`md:`, `lg:`) |
| **`@/`** | Atalho para a pasta `src/` |
| **Debugar** | Investigar e corrigir erros no código |

---

## 🔜 Próximos passos (sugeridos)

1. **Página "Nova Atividade"** (`/atividades/nova`) — formulário para cadastrar atividade
2. **Criar a tabela `atividades` no Supabase** — com SQL, índices e RLS
3. **Conectar o frontend ao Supabase** — substituir dados mockados por dados reais
4. **Autenticação de usuários** (login)
5. **Criar os demais módulos** (Relatórios, Solicitações, PTs, etc.)
6. **Deploy na Vercel**

---

## 📝 Observações importantes

- **Página `/atividades/nova`** ainda não existe → clicar no botão "+ Nova Atividade" vai dar erro 404 por enquanto (normal)
- Os links da Sidebar para módulos não criados ainda também dão 404
- Tudo que foi feito está commitado no GitHub, mas os commits das etapas 2–6 **ainda não foram enviados** (`git push`) — confirmar se o Wagner quer fazer isso

---

## 🚀 Como retomar amanhã

1. Abrir o projeto (localmente ou no Codespaces)
2. Rodar `npm run dev` no terminal
3. Acessar `http://localhost:3000`
4. Continuar a partir da **próxima etapa** (Nova Atividade)

---

## ✅ Sugestão de ação
# Histórico de Desenvolvimento — Portal Rotinas Smart

## 15/08/2026 — Resolvendo o RLS na tabela `atividades`

### Problema
Ao criar uma atividade, os dados não apareciam no Supabase.
O formulário funcionava, mas a inserção era bloqueada silenciosamente.

### Causa
O **RLS (Row Level Security)** estava ativado na tabela `atividades`.
Por padrão, o RLS bloqueia TODAS as operações até que uma
política (policy) seja criada.

### O que é RLS
RLS é uma proteção do Supabase que controla quem pode ler,
criar, atualizar ou excluir cada linha da tabela.
- RLS desligado: qualquer pessoa com a anon key acessa tudo
- RLS ligado sem política: ninguém acessa nada
- RLS ligado com política: acessa conforme as regras definidas

### Solução aplicada (PROVISÓRIA)
Criadas 4 políticas com `USING (true)` e `WITH CHECK (true)`,
permitindo SELECT, INSERT, UPDATE e DELETE para qualquer pessoa.

⚠️ IMPORTANTE: esta solução NÃO é segura para produção.
Ela serve apenas para desbloquear o desenvolvimento.

### Próximo passo (obrigatório)
Implementar autenticação (Supabase Auth) e trocar as políticas
provisórias por políticas baseadas em `auth.uid()`, garantindo
que cada usuário só acesse o que tem permissão.

## 15/08/2026 — Fase de Autenticação: Serviço de Auth

### O que foi feito
Criado o arquivo `src/services/authService.ts` com as funções:
- `fazerLogin(email, senha)` → autentica o usuário
- `fazerCadastro(nome, email, senha, cargo)` → cria conta nova
- `fazerLogout()` → encerra a sessão
- `verificarUsuarioLogado()` → retorna o usuário atual ou null

### Por que um serviço separado?
Para reutilizar a lógica em várias páginas (login, cadastro,
proteção de rotas) e centralizar o tratamento de erros.

### Conceito aprendido: User Metadata
O Supabase Auth permite guardar dados extras no cadastro
através do campo `options.data`. O trigger que criamos
antes pega esses dados e popula a tabela `usuarios`.

a partir dessa data, passei a usar o claude
# 📄 Documentação de Sessão — Portal Rotinas Smart

**Data:** 16/08/2026
**Módulo:** Middleware / Autenticação (Supabase)

---

## 🎯 Objetivo da sessão

Corrigir um problema de **redirecionamento indevido para `/login`** causado pela lógica de proteção de rotas no middleware, que estava bloqueando o acesso mesmo sem usuário autenticado configurado corretamente ainda.

---

## 🛠️ O que foi feito

### 1. `src/middleware.ts` — **Alterado**
- **Antes:** o middleware verificava se o usuário estava logado (`supabase.auth.getUser()`) em rotas protegidas (`/dashboard`, `/atividades`, `/relatorios`) e redirecionava para `/login` caso não houvesse sessão. Também tinha `console.log`s de debug.
- **Depois:** simplificado para apenas chamar `updateSession(request)` e devolver a resposta, **sem bloquear nenhuma rota** por enquanto.
- **Motivo:** a lógica de autenticação ainda não está pronta/configurada no projeto, então bloquear rotas causava redirecionamento indevido, impedindo o acesso às páginas mesmo em desenvolvimento.

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 2. Arquivos revisados — **Sem alterações necessárias**
Verificamos e confirmamos que os arquivos abaixo estavam corretos e não precisavam de mudanças:

| Arquivo | Função | Status |
|---|---|---|
| `src/lib/supabase/middleware.ts` | Cria cliente Supabase e atualiza cookies de sessão | ✅ Ok |
| `src/app/layout.tsx` | Layout raiz da aplicação (Sidebar + conteúdo) | ✅ Ok |
| `src/app/page.tsx` | Página do Dashboard (Home) | ✅ Ok |
| `src/components/Sidebar.tsx` | Menu lateral de navegação | ✅ Ok |

---

## ✅ Teste realizado

- Rodado `npm run dev`
- Acessado `http://localhost:3000` e `http://localhost:3000/atividades`
- **Resultado:** nenhuma tela redirecionou para `/login`, navegação funcionando normalmente.

---

## 💡 Aprendizado da sessão

- **Middleware** no Next.js roda antes da página carregar e pode redirecionar, bloquear ou modificar requisições — é onde a lógica de proteção de rotas costuma ficar.
- Antes de implementar autenticação/proteção de rotas de fato, é preciso ter o fluxo de login pronto, senão o sistema trava o próprio desenvolvedor fora das páginas.

---

## 📌 Pendências / Próximos passos discutidos

1. **Trocar emojis por ícones profissionais** usando a biblioteca `lucide-react` (gratuita, leve, visual estilo Linear/Notion).
   - Passo 1: `npm install lucide-react`
   - Passo 2: Atualizar `Sidebar.tsx` substituindo emojis por ícones (`LayoutDashboard`, `ClipboardList`, `BarChart3`, `Mail`, `Wrench`, `GraduationCap`, `Users`, `TrendingUp`, `Settings`).

2. **Planejar módulo de autenticação/login** completo antes de reativar a proteção de rotas no middleware.

---

# Documentação — Módulo Atividades (Listagem)

## 📁 Arquivo
`src/app/atividades/page.tsx`

## 🎯 Objetivo
Exibir a listagem de todas as atividades cadastradas no sistema, em formato de tabela, com indicadores visuais (badges coloridos) para **Status** e **Prioridade**.

## 🧩 Estrutura do arquivo

### 1. Imports
```typescript
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Atividade } from "@/types/atividade";
```
- `Link`: navegação entre páginas do Next.js sem recarregar a página inteira.
- `createClient`: cria a conexão com o Supabase (lado servidor).
- `Atividade`: tipo TypeScript que descreve o formato de uma atividade.

### 2. Componente `StatusBadge`
Recebe a prop `status` e retorna uma tag `<span>` colorida conforme o valor:

| Status | Cor |
|---|---|
| Pendente | Amarelo |
| Em Andamento | Azul |
| Concluída | Verde |
| (outro/desconhecido) | Cinza (fallback) |

### 3. Componente `PrioridadeBadge`
Recebe a prop `prioridade` e retorna uma tag `<span>` colorida:

| Prioridade | Cor |
|---|---|
| Baixa | Cinza |
| Média | Laranja |
| Alta | Vermelho |
| (outro/desconhecido) | Cinza (fallback) |

⚠️ **Ponto de atenção:** as chaves usadas nos dicionários (`styles`) precisam ser **idênticas** aos valores salvos no banco (`Pendente`, `Em Andamento`, `Concluída` / `Alta`, `Média`, `Baixa` — com acentos e maiúsculas, pois é assim que estão definidos no `CHECK CONSTRAINT` da tabela `atividades`).

### 4. Componente principal `AtividadesPage`
- É um **Server Component assíncrono** (`async function`), ou seja, roda no servidor e pode usar `await` diretamente.
- Busca os dados:
```typescript
const { data: atividades, error } = await supabase
  .from("atividades")
  .select("*")
  .order("data_criacao", { ascending: false });
```
- Renderiza um cabeçalho com título e botão "**+ Nova Atividade**" (link para `/atividades/nova`).
- Renderiza uma tabela com colunas: Título, Responsável, Status, Prioridade, Data Prevista, Ações.
- Cada linha tem um link "**Editar**" para `/atividades/[id]/editar`.

## 🗄️ Tabela no Supabase

```sql
create table public.atividades (
  id uuid not null default gen_random_uuid (),
  titulo text not null,
  descricao text null,
  responsavel text null,
  prioridade text not null default 'Média'::text,
  status text not null default 'Pendente'::text,
  data_criacao timestamp with time zone null default now(),
  data_atualizacao timestamp with time zone null default now(),
  usuario_id uuid null,
  data_prevista date null,
  ...
)
```

- **prioridade / status**: restritos por `CHECK CONSTRAINT` a valores específicos (evita dados inconsistentes).
- **usuario_id**: relaciona a atividade a um usuário autenticado (`auth.users`).
- **Índices**: criados em `status`, `prioridade`, `data_criacao`, `usuario_id`, `data_prevista` para acelerar buscas e ordenações.
- **Trigger**: atualiza automaticamente `data_atualizacao` sempre que a linha é modificada.

## ✅ Como testar
1. Acesse `/atividades` no navegador.
2. Verifique se a tabela carrega os dados do Supabase.
3. Confirme que os badges de Status e Prioridade aparecem com cores diferentes conforme o valor.
4. Clique em "+ Nova Atividade" e em "Editar" para confirmar que os links funcionam (mesmo que as páginas de destino ainda não existam completamente).

## 🐛 Erros resolvidos nesta sessão
1. **`StatusBadge` não encontrado**: componente foi apagado acidentalmente durante uma edição.
2. **"Default export is not a React Component"**: arquivo foi substituído inteiro, perdendo o `export default function AtividadesPage`.
3. **Badges sem cor**: valores das chaves no dicionário não coincidiam com os valores reais do banco (diferença de acentuação/capitalização).

## 📌 Boas práticas aplicadas
- Uso de **Server Component** para buscar dados diretamente no servidor (mais seguro e rápido, sem expor lógica de banco no cliente).
- **Componentização**: `StatusBadge` e `PrioridadeBadge` são reutilizáveis e podem ser usados em outras telas (ex: detalhes da atividade).
- **Fallback visual**: uso do operador `??` garante que valores inesperados não quebrem a interface.

# 📄 Documentação — Exportação de Relatório em PDF

## 🎯 Objetivo
Permitir que o usuário exporte o relatório de atividades (visualizado na tela `/relatorios`) como um arquivo **PDF**, contendo:
- Logo da empresa
- Título e período do relatório
- Cards de resumo (Total, Pendentes, Em Andamento, Concluídas)
- Tabela de atividades por responsável
- Lista detalhada de atividades (título, descrição, status, prioridade, responsável)
- Rodapé com data de geração

---

## 🧩 Tecnologia utilizada
**`@react-pdf/renderer`** — biblioteca que permite criar documentos PDF usando componentes React (`<Document>`, `<Page>`, `<Text>`, `<View>`, `<Image>`), de forma parecida com criar uma página normal.

---

## 📁 Arquivos criados/alterados

### 1. `src/app/relatorios/page.tsx`
- Busca as atividades no Supabase, incluindo `titulo` e `descricao` (antes só buscava dados para os gráficos/tabela)
- Passa todos os dados (resumo + lista de atividades) para o componente `BotaoExportarPDF`

### 2. `src/components/relatorios/BotaoExportarPDF.tsx`
- Componente client-side (`"use client"`) que renderiza o botão **"📄 Exportar PDF"**
- Usa `PDFDownloadLink` do `@react-pdf/renderer`, mas carregado via `dynamic(..., { ssr: false })`

**Por que isso é importante:**
`PDFDownloadLink` depende de APIs do navegador (como `Blob` e `URL.createObjectURL`), que não existem no servidor. O Next.js tenta renderizar componentes no servidor primeiro (**SSR - Server Side Rendering**), causando o erro:
> *"PDFDownloadLink is a web specific API"*

A solução é usar `dynamic()` com `ssr: false`, dizendo ao Next.js: *"esse componente só deve carregar no navegador"*.

### 3. `src/components/relatorios/RelatorioPDF.tsx`
- Componente que define o **layout/design do PDF** em si (o "papel" que será gerado)
- Usa `StyleSheet.create()` (sistema de estilos próprio do `react-pdf`, parecido com CSS, mas com nome de propriedades em camelCase)
- Exibe a logo (`/logo_smart_redonda.png`, servida pela pasta `public`)
- Renderiza dinamicamente a tabela de responsáveis e a lista de atividades com `.map()`

---

## 🔑 Conceitos técnicos aprendidos

| Conceito | Explicação |
|---|---|
| **SSR (Server Side Rendering)** | O Next.js renderiza páginas no servidor antes de enviar ao navegador, por performance e SEO |
| **`dynamic(() => import(...), { ssr: false })`** | Força um componente a carregar **apenas no navegador**, ignorando a etapa de SSR |
| **`@react-pdf/renderer`** | Gera arquivos PDF reais usando sintaxe parecida com React/JSX |
| **`public/` no Next.js** | Pasta cujos arquivos são servidos diretamente pela raiz do site (ex: `public/logo.png` → `/logo.png`) |
| **Props tipadas com `interface`** | Cada componente define o "formato" dos dados que recebe, evitando erros e facilitando manutenção |

---

## ✅ Fluxo final
1. Usuário acessa `/relatorios`
2. Aplica filtro de período (opcional)
3. Clica em **"📄 Exportar PDF"**
4. O sistema gera o PDF no navegador com todos os dados filtrados
5. Download automático do arquivo `relatorio-atividades-AAAA-MM-DD.pdf`