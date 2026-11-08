# Radar Tech Brasil

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Plataforma Civic Tech para monitoramento contínuo, centralização e análise de editais de fomento à inovação, programas de aceleração e hackathons no Brasil.**

---

## Visão Geral do Produto

O **Radar Tech Brasil** é uma solução de inteligência cívica e transparência de dados desenvolvida para eliminar o trabalho manual de busca por oportunidades de financiamento espalhadas em diários oficiais e portais governamentais descentralizados.

A plataforma centraliza chamadas públicas de fomento à inovação (como **FUNCAP**, **FINEP**, **CNPq**, **FAPESP**, **FACEPE** e FAPs estaduais), programas de aceleração para startups (como **InovAtiva Brasil**, **Corredores Digitais**, **Hubine BNB**) e maratonas de dados e desafios cívicos.

Cada oportunidade conta com um raio-X detalhado de elegibilidade, identificação do tipo de capital (não-reembolsável/subvenção a fundo perdido, equity-free, bolsas de P&D), contagem regressiva em tempo real para prazos de submissão e links diretos para as plataformas oficiais de inscrição.

---

## Principais Módulos & Filtros

### 1. Filtros Especializados de Editais
- **Tags:** Busca e filtragem por palavras-chave (`#Ceará`, `#FUNCAP`, `#FINEP`, `#Fundo Perdido`, `#Subvenção`, `#GovTech`, `#SaaS`, `#IA`, `#PIPE`).
- **Data Limite:** Seletor de calendário para filtrar chamadas que encerram até a data desejada.
- **Fluxo Contínuo:** Filtro dedicado para linhas de fomento com submissão aberta o ano todo (ex: *FAPESP PIPE Fluxo Contínuo*).
- **Maturidade da Startup:** Categorização pelos 4 estágios do ecossistema:
  - *Ideação* (Centelha, maratonas, ideação)
  - *Validação* (PIPE Fase 1, Corredores Digitais)
  - *Tração* (Inovafit, Hubine BNB)
  - *Crescimento* (FINEP Mais Inovação, Capital Empreendedor)
- **Financiador:** Seleção por órgão concedente (*FUNCAP*, *FINEP*, *CNPq*, *FAPESP*, *SEBRAE*, *FACEPE*, *Banco do Nordeste*, etc.).
- **Origem do Recurso:** *Federal*, *Estadual*, *Municipal*, *Privado*, *Internacional*.
- **Abrangência:** *Nacional*, *Estadual*, *Regional*.
- **Botão "Limpar filtros":** Redefinição instantânea com um único clique.

### 2. Scanner e Varredura Automatizada de Editais Reais
- Script de coleta contínua que consulta portais governamentais e APIs oficiais:
  - API REST oficial da **FUNCAP Ceará** (`ce.gov.br/funcap`);
  - Portal **CONFAP** (Conselho Nacional das FAPs);
  - Chamadas públicas federais da **FINEP** e **CNPq**;
  - Chamadas de inovação tecnológica **FAPESP (PIPE)** e **FAPs do Nordeste** (FAPESQ-PB, FACEPE).
- Extração de prazos, links diretos de editais em PDF e ementas.

### 3. Disparador de Alertas (Telegram & WhatsApp)
- Rotina automatizada (`scripts/alert_notifier.ts`) para envio de boletins com:
  - Editais com encerramento de inscrições em menos de 72 horas (Prazos Críticos);
  - Novas chamadas abertas no ecossistema do Ceará e no Brasil;
  - Suporte a Telegram Bot API e Webhook para WhatsApp/n8n.

### 4. Contagem Regressiva em Tempo Real
- Indicador visual e cronológico nos cards:
  - **Crítico (< 48 horas):** Alerta em vermelho discreto com cálculo exato de horas e minutos.
  - **Atenção (< 7 dias):** Indicação de dias restantes.
  - **Regular (> 7 dias):** Acompanhamento contínuo.

---

## Arquitetura de Software

```
radar-tech-brasil/
├── .github/workflows/
│   └── deploy_and_alerts.yml # CI e scanner diário automatizado
├── scripts/
│   ├── scanner_editais.ts     # Script de varredura multi-FAPs e federal
│   └── alert_notifier.ts      # Disparador de alertas Telegram e WhatsApp
├── src/
│   ├── components/
│   │   ├── CountdownBadge.tsx # Contagem regressiva em tempo real
│   │   ├── EventCard.tsx      # Card de edital com aporte, contrapartida e selo regional
│   │   ├── EventModal.tsx     # Modal com raio-X de elegibilidade e links oficiais
│   │   ├── FilterBar.tsx      # Barra de filtros avançados (Maturidade, Financiador, etc.)
│   │   ├── Header.tsx         # Cabeçalho institucional
│   │   ├── StatsBanner.tsx    # Painel de métricas (Fomento total, prazos críticos, CE)
│   │   └── AlertModal.tsx     # Central de configuração de alertas via WhatsApp/Telegram
│   ├── data/
│   │   ├── initialEvents.ts       # Base curada de oportunidades
│   │   └── discovered_editais.json# Base coletada pelo scanner automatizado
│   ├── types.ts               # Contratos de dados e tipagens TypeScript
│   └── App.tsx                # Gerenciamento de estado e filtros combinados
├── vercel.json                # Configuração para deploy na Vercel
├── render.yaml                # Configuração para deploy no Render
├── server.ts                  # Backend Node.js / Express integrado ao Vite
├── package.json
└── vite.config.ts
```

---

## Execução Local & Comandos

### Pré-requisitos
- Node.js (v18+) ou Bun (v1.0+)
- Git

### 1. Clonar e Instalar
```bash
git clone https://github.com/karla08C/radar-tech-brasil.git
cd radar-tech-brasil
bun install # ou npm install
```

### 2. Rodar Servidor Local
```bash
bun run dev # ou npm run dev
```
Acesse a aplicação em: `http://localhost:3000`

### 3. Executar Varredura de Editais Reais
```bash
bun run scan:editais # ou npm run scan:editais
```

### 4. Executar Disparador de Alertas
```bash
bun run notify:alerts # ou npm run notify:alerts
```

### 5. Build de Produção
```bash
bun run build # ou npm run build
```

---

## Deploy em Nuvem

### Deploy na Vercel
O projeto já conta com [`vercel.json`](file:///C:/Users/Usuário/Radar-Tech-Brasil/vercel.json) configurado:
1. Conecte o repositório no dashboard da [Vercel](https://vercel.com).
2. O framework Vite será detectado automaticamente com a pasta de saída `dist`.

### Deploy no Render
O repositório inclui [`render.yaml`](file:///C:/Users/Usuário/Radar-Tech-Brasil/render.yaml) para provisionamento de serviço web com backend Express ativo.

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
