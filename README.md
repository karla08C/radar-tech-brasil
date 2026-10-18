# Radar Tech Brasil

Plataforma inteligente para descoberta, mapeamento geoespacial e acompanhamento de eventos de tecnologia, conferências e hackathons no Brasil, com análise automatizada de editais via Inteligência Artificial.

---

## Visão do Produto

Concebido a partir da vivência prática em gestão de comunidades tech e liderança em ecossistemas de inovação, o **Radar Tech Brasil** resolve a dispersão de informações sobre iniciativas tecnológicas no país. A plataforma centraliza meetups, conferências nacionais e competições de inovação (hackathons), fornecendo filtros avançados por formato, estado e volume de premiação.

Além da navegação tradicional, o sistema conta com recursos de **IA Generativa (Google Gemini)** para leitura e extração estruturada de regras de editais complexos, mapa interativo do território nacional e agenda consolidada para desenvolvedores e organizadores.

---

## Tecnologias Utilizadas

- **Frontend Core:** React 19, TypeScript, Vite
- **Backend & API:** Node.js, Express, TSX, Esbuild
- **Estilização e Componentes:** Tailwind CSS v4, Lucide React, Motion (Framer Motion)
- **Inteligência Artificial:** Google Gen AI SDK (`@google/genai`) com modelos Gemini
- **Visualização de Dados:** Mapa interativo do Brasil e visão de calendário dinâmico
- **Efeitos de Interface:** Canvas Confetti

---

## Módulos e Funcionalidades

### 1. Mapa Interativo do Brasil (BrazilMapView)
Visualização geoespacial da distribuição de eventos por estado e região, permitindo identificar pólos de inovação e encontros presenciais locais.

### 2. Scanner e Importador Inteligente de Editais (AiScannerModal & ImportEditalModal)
Integração com a API do Google Gemini para processar textos e editais de hackathons, extraindo automaticamente:
- Prazos de inscrição e datas de submissão
- Temáticas e tecnologias exigidas
- Critérios de premiação e valores em destaque

### 3. Calendário Dinâmico e Grade de Eventos (CalendarView & TableView)
Alternância intuitiva entre visualização em formato de grade (Cards), tabela detalhada e calendário mensal, facilitando o planejamento de participação.

### 4. Destaque de Premiações (PrizeSpotlight)
Painel dedicado para competições com premiação financeira ou aceleração, auxiliando desenvolvedores a priorizarem oportunidades de alto impacto.

### 5. Central de Alertas e Notificações (AlertModal)
Configuração de preferências e lembretes para fechamento de inscrições e novos editais publicados.

---

## Arquitetura de Software

```
src/
├── components/
│   ├── AiScannerModal.tsx    # Scanner de editais com inteligência artificial
│   ├── ImportEditalModal.tsx # Modal de importação e processamento de editais
│   ├── BrazilMapView.tsx     # Componente de mapa interativo por estados
│   ├── CalendarView.tsx      # Agenda cronológica de eventos
│   ├── TableView.tsx         # Visão tabular com ordenação e filtros
│   ├── EventCard.tsx         # Card responsivo com detalhes do evento
│   ├── PrizeSpotlight.tsx    # Destaque de hackathons com premiações
│   ├── StatsBanner.tsx       # Métricas consolidadas do ecossistema tech
│   ├── FilterBar.tsx         # Barra de filtros (formato, UF, premiação)
│   ├── EventModal.tsx        # Detalhamento completo do evento
│   └── Header.tsx            # Cabeçalho da aplicação e ações rápidas
├── data/
│   └── initialEvents.ts      # Base inicial de eventos e conferências
├── utils/
│   └── eventUtils.ts         # Funções utilitárias de datas, filtros e ordenação
├── types.ts                  # Contratos de dados (Event, FilterOptions, etc.)
├── App.tsx                   # Estado compartilhado e gerenciamento de abas
└── server.ts                 # Servidor Node.js/Express para suporte à aplicação
```

---

## Execução Local

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes npm

### Passo a passo
1. Clone o repositório:
```bash
git clone https://github.com/karla08C/Radar-Tech-Brasil.git
cd Radar-Tech-Brasil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Adicione sua chave GEMINI_API_KEY no arquivo .env
```

4. Inicie em modo de desenvolvimento (Frontend + Servidor integrado via TSX):
```bash
npm run dev
```

5. Para compilar e executar o servidor de produção:
```bash
npm run build
npm start
```
