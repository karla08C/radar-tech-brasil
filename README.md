# Radar Tech Brasil

**Plataforma Civic Tech para monitoramento, centralização e análise de editais de fomento à inovação, programas de aceleração e hackathons no Brasil.**

---

## Visão Geral do Produto

O **Radar Tech Brasil** é uma solução de inteligência cívica e transparência de dados desenvolvida para eliminar o trabalho manual de busca por oportunidades de financiamento espalhadas em diários oficiais e portais governamentais descentralizados.

A plataforma centraliza chamadas públicas de fomento à inovação (como **FUNCAP**, **FINEP**, **CNPq** e FAPs estaduais), programas de aceleração para startups (como **InovAtiva Brasil**, **Corredores Digitais**, **Hubine**) e maratonas de dados e desafios cívicos.

Cada oportunidade conta com um raio-X detalhado de elegibilidade, identificação do tipo de capital (não-reembolsável/subvenção a fundo perdido, equity-free, bolsas de P&D), contagem regressiva em tempo real para prazos de submissão e links diretos para as plataformas oficiais de inscrição.

---

## Principais Funcionalidades

### 1. Scanner e Varredura Automatizada de Editais Reais
- Script de coleta contínua que consulta portais governamentais e APIs oficiais (incluindo a API REST oficial da **FUNCAP Ceará**, chamadas públicas da **FINEP**, **FAPESP PIPE** e **CNPq**).
- Extração de prazos, links de editais em PDF e ementas de chamadas públicas.
- Execução sob demanda via comando ou programada em pipelines de dados.

### 2. Filtros Territoriais e Verticais Temáticas
- **Filtro Territorial:** Seleção rápida por estados com foco no ecossistema do **Ceará**, **Nordeste** e chamadas de abrangência **Nacional**.
- **Tipo de Aporte:** Filtros por capital a fundo perdido (não-reembolsável), aceleração equity-free (0% de diluição) e prêmios em dinheiro.
- **Áreas Temáticas:** Impacto Social & GovTech, Inteligência Artificial & Dados, SaaS & B2B, Saúde & HealthTech, AgTech & BioTech, FinTech e Educação.

### 3. Contagem Regressiva e Gestão de Prazos (Countdown Timer)
- Indicador cronológico em tempo real nos cards e modais:
  - **Crítico (< 48 horas):** Alerta de encerramento iminente com cálculo de horas e minutos.
  - **Atenção (< 7 dias):** Indicação destacada de dias restantes.
  - **Regular (> 7 dias):** Acompanhamento contínuo do cronograma.

### 4. Raio-X de Elegibilidade
- Visualização rápida dos critérios eliminatórios para submissão (porte empresarial: MEI, ME, EPP; exigência de CNPJ no estado; dedicação da equipe técnica; contrapartida financeira ou econômica).
- Integração direta para download de editais completos em PDF e acesso à plataforma de envio da proposta.

### 5. Central de Alertas (WhatsApp & Telegram)
- Registro de preferências de notificação por canal direto para avisos de novas chamadas abertas e alertas de 72 horas pré-encerramento de prazo.

---

## Arquitetura de Software

```
radar-tech-brasil/
├── scripts/
│   └── scanner_editais.ts    # Script de varredura e extração de editais em portais governamentais
├── src/
│   ├── components/
│   │   ├── CountdownBadge.tsx # Componente de contagem regressiva de prazos em tempo real
│   │   ├── EventCard.tsx      # Card de oportunidade com aporte, contrapartida e selo regional
│   │   ├── EventModal.tsx     # Modal com raio-X de elegibilidade e links oficiais
│   │   ├── FilterBar.tsx      # Barra de filtros (Fomento, Aceleração, Ceará, Áreas)
│   │   ├── Header.tsx         # Cabeçalho institucional e métricas consolidadas
│   │   ├── StatsBanner.tsx    # Painel de métricas (Fomento total, prazos críticos, CE)
│   │   ├── AlertModal.tsx     # Central de configuração de alertas via WhatsApp/Telegram
│   │   ├── BrazilMapView.tsx  # Mapa geoespacial de editais por UF
│   │   ├── CalendarView.tsx   # Calendário cronológico de submissões
│   │   └── TableView.tsx      # Visão tabular para triagem rápida
│   ├── data/
│   │   ├── initialEvents.ts       # Base curada de oportunidades (FUNCAP, FINEP, CNPq)
│   │   └── discovered_editais.json# Base coletada pelo scanner automatizado
│   ├── types.ts               # Contratos de dados e tipagens TypeScript
│   └── App.tsx                # Gerenciamento de estado e composição de visões
├── server.ts                  # Backend Node.js / Express integrado ao Vite
├── package.json
└── vite.config.ts
```

---

## Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite
- **Estilização e Design System:** Tailwind CSS v4, Lucide React (iconografia institucional sóbria)
- **Backend & Servidor:** Node.js, Express, TSX, Esbuild
- **Inteligência Artificial & Extração:** Google Gen AI SDK (`@google/genai`) para resumo e parsing de editais
- **Gerenciador de Pacotes e Runtime:** Bun / NPM

---

## Execução Local

### Pré-requisitos
- Node.js (v18+) ou Bun (v1.0+)
- Git

### 1. Clonar o repositório
```bash
git clone https://github.com/karla08C/radar-tech-brasil.git
cd radar-tech-brasil
```

### 2. Instalar dependências
```bash
bun install
# ou
npm install
```

### 3. Executar o servidor de desenvolvimento
```bash
bun run dev
# ou
npm run dev
```
Acesse a aplicação no navegador em: `http://localhost:3000`

### 4. Executar a varredura de editais reais
Para consultar as APIs oficiais e portais de fomento (FUNCAP, FAPESP, FINEP) e atualizar a base local de editais:
```bash
bun run scan:editais
# ou
npm run scan:editais
```

---

## Licença

Projeto desenvolvido sob licença MIT.
