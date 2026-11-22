import { ArrowLeft, ArrowUpRight, Eye, HeartHandshake, Radar } from 'lucide-react';

const sources = [
  { name: 'FINEP', description: 'Financiadora de Estudos e Projetos: chamadas de apoio à pesquisa, ao desenvolvimento e à inovação no Brasil.', url: 'https://www.finep.gov.br/' },
  { name: 'FUNCAP', description: 'Fundação Cearense de Apoio ao Desenvolvimento Científico e Tecnológico: oportunidades de ciência, pesquisa e inovação no Ceará.', url: 'https://www.funcap.ce.gov.br/' },
  { name: 'FAPESP', description: 'Fundação de Amparo à Pesquisa do Estado de São Paulo: chamadas de pesquisa e inovação, incluindo o programa PIPE.', url: 'https://fapesp.br/' },
  { name: 'CNPq', description: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico: bolsas e chamadas de apoio à pesquisa científica e tecnológica.', url: 'https://www.gov.br/cnpq/pt-br' },
  { name: 'CONFAP', description: 'Conselho Nacional das Fundações Estaduais de Amparo à Pesquisa: divulga oportunidades e articula as FAPs estaduais.', url: 'https://confap.org.br/' },
];

export function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <a href="#/" className="button-quiet mb-8 -ml-2.5"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar às oportunidades</a>
      <div className="border-b border-stone-200 pb-10">
        <p className="mb-3 text-xs font-medium text-brand-600">Sobre o projeto</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Mais acesso ao fomento.<br />Mais espaço para boas ideias.</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">O Radar Tech Brasil é uma iniciativa Civic Tech que usa a tecnologia para ampliar a transparência e democratizar o acesso ao fomento público. Reunimos editais, bolsas e programas de inovação para aproximar pessoas e projetos das oportunidades de que precisam.</p>
      </div>

      <section aria-labelledby="mission-title" className="py-10">
        <div className="mb-4 flex items-center gap-2 text-brand-600"><Radar className="h-5 w-5" aria-hidden="true" /><h2 id="mission-title" className="text-xl font-semibold text-stone-900">Nossa missão</h2></div>
        <p className="text-sm leading-7 text-stone-600">Encontrar recursos para inovar não deveria depender de conhecer dezenas de portais. Nossa missão é reduzir essa barreira, centralizando informações que ajudam estudantes, pesquisadores, empreendedores e organizações a descobrir chamadas e entender seus prazos e critérios.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-6"><h3 className="font-semibold">Transparência</h3><p className="mt-2 text-sm leading-7 text-stone-600">Informações organizadas e acesso às fontes oficiais para que cada pessoa possa conferir as regras e tomar suas decisões.</p></div>
          <div className="rounded-xl border border-stone-200 bg-white p-6"><h3 className="font-semibold">Acesso democrático</h3><p className="mt-2 text-sm leading-7 text-stone-600">Oportunidades mais fáceis de encontrar, com filtros por região, financiador e estágio do projeto.</p></div>
        </div>
      </section>

      <section aria-labelledby="sources-title" className="border-t border-stone-200 py-10">
        <div className="mb-4 flex items-center gap-2 text-brand-600"><Eye className="h-5 w-5" aria-hidden="true" /><h2 id="sources-title" className="text-xl font-semibold text-stone-900">Fontes que monitoramos</h2></div>
        <p className="mb-6 text-sm leading-7 text-stone-600">A base combina curadoria e coleta automatizada de portais oficiais. Entre as fontes acompanhadas estão órgãos federais, fundações de amparo à pesquisa (FAPs) e redes estaduais.</p>
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white px-6">
          {sources.map(source => (
            <li key={source.name} className="py-5">
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">{source.name}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
              <p className="mt-2 text-sm leading-7 text-stone-600">{source.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-6 text-stone-500">O Radar Tech Brasil é uma iniciativa independente, sem vínculo institucional com os órgãos listados. A cobertura pode variar e não substitui a consulta aos portais oficiais. Antes de se candidatar, confira o edital, os prazos e eventuais retificações na fonte.</p>
      </section>

      <section aria-labelledby="collaborate-title" className="border-t border-stone-200 py-10">
        <div className="mb-4 flex items-center gap-2 text-brand-600"><HeartHandshake className="h-5 w-5" aria-hidden="true" /><h2 id="collaborate-title" className="text-xl font-semibold text-stone-900">Como colaborar</h2></div>
        <p className="text-sm leading-7 text-stone-600">O projeto é aberto e toda contribuição pode ampliar o acesso à inovação. Você pode sugerir fontes e oportunidades, apontar informações desatualizadas, propor melhorias de acessibilidade ou contribuir com código e documentação.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="https://github.com/karla08C/radar-tech-brasil/issues/new" target="_blank" rel="noopener noreferrer" className="button-primary">Sugerir melhoria ou correção<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
          <a href="https://github.com/karla08C/radar-tech-brasil" target="_blank" rel="noopener noreferrer" className="button-secondary">Contribuir no GitHub<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
        </div>
      </section>
    </article>
  );
}
