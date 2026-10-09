# Auditoria e consolidação documental — 08/10/2026

## Escopo e resultado

Base técnica: commit `85b081e`. Consolidação somente documental; nenhum módulo, asset, HTML, CSS ou configuração nativa foi alterado. Nenhum documento foi apagado ou movido. [AGENTS](../AGENTS.md) passa a centralizar identidade, arquitetura atual e manutenção; README apresenta/ensina executar. Este relatório guarda evidências e decisões de limpeza, não duplica o manual do jogo.

A análise comparou documentação com index/styles, os 34 scripts JS, catálogos, persistência, testes, package/lockfile, Capacitor, configuração Gradle/manifest e MainActivity. Documentos extensos foram analisados por seções de identidade, arquitetura, contratos, regras e histórico; não se considera cada checkbox antigo uma certificação da versão atual.

## Inventário e destinação

Os 24 documentos preexistentes abaixo foram analisados. Referências locais de pasta foram preservadas; dependências instaladas e cópias geradas em www não são documentação-fonte.

| Documento | Responsabilidade anterior / conteúdo incorporado | Tratamento |
|---|---|---|
| [AGENTS](../AGENTS.md) | Guia inglês, composição, Save, testes e tarefas comuns | Reestruturado como central em português |
| [README](../README.md) | Apresentação, comandos, arquitetura/status e índice | Simplificado; comandos preservados |
| [GDD](../GDD.md) | Visão narrativa/mecânica, direção e estado técnico misturados | Identidade/direções incorporadas; planos preservados, ressalva histórica |
| [IDEIA_CONCEITUAL](../IDEIA_CONCEITUAL.md) | Decisões, hipóteses, personagens, finais e produção | Direções aprovadas incorporadas; dúvidas/ideias mantidas, MJ corrigida |
| [ESTRUTURA_GAMING](../ESTRUTURA_GAMING.md) | Arquitetura, fluxos, Save, fotos e registros de produção | Função central substituída; histórico preservado/sinalizado |
| [REGRAS_DE_DESIGN](../REGRAS_DE_DESIGN.md) | Tokens, composição, acessibilidade, naming e pipeline | Regras gerais consolidadas; especificações extensas preservadas |
| [TODO](../TODO.md) | Roadmap, revisões e convenções | Mantido separado; nota de precedência/status histórico |
| [ARCHITECTURE](ARCHITECTURE.md) | Composição/dependências antigas | Visão geral substituída; candidato a arquivar |
| [JS_MODULES](JS_MODULES.md) | Responsabilidades/APIs de 30 módulos | Inventário atualizado na central; candidato a arquivar após conferir APIs úteis |
| [STATUS_PROJETO](STATUS_PROJETO.md) | Status e evidências de QA de revisões antigas | Histórico sinalizado, link relativo corrigido |
| [ADR_LOG](ADR_LOG.md) | Decisões datadas, inclusive revisões superadas | Preservado como histórico; referência central |
| [MECHANICS_PATTERN](MECHANICS_PATTERN.md) | Factory/DI, estratégias e animação | Manter contrato específico; referência central |
| [SAVE_SYSTEM](SAVE_SYSTEM.md) | Schema, migração e interfaces de acesso | Corrigidos mapa, aparelho, checkpoints e validação de fases |
| [POINT_AND_CLICK](POINT_AND_CLICK.md) | Objetos, rects, hotspots e Bolsa | Corrigidos seleção, schema dos itens e ativação já implementada |
| [SCENE_TRANSITIONS](SCENE_TRANSITIONS.md) | Fade, input, assets e QA histórico | Corrigidos destino, Novo jogo, variantes, loader/cache |
| [TEXT_INPUT](TEXT_INPUT.md) | Editor/teclado próprios | Escopo dos inputs, wiring e layout de coordenadas corrigidos |
| [PHONE_THEMES](PHONE_THEMES.md) | Temas e identidade de aparelho | Tema MJ atual na casa, sem antecipar personalização |
| [cutscenes](cutscenes.md) | Sequências, tempos, produção e QA histórico | Distinção explícita entre execução atual e registros de espera/hold antigos |
| [mapa-global](mapa-global.md) | Bilhete, PC, coordenadas e viagens | Corrigido carregamento tardio da imagem |
| [INTERFACE_INPUT](INTERFACE_INPUT.md) | Foco, toque e verificações CDP | Preservado como guia específico |
| [audio/README](../assets/audio/README.md) | Receitas e contratos de SFX | Acrescentados efeitos de diálogo/blip e ressalva de proveniência |
| [cenario/README](../assets/cenario/README.md) | Beco e quadros cinematográficos | Acrescentados casa/crime/delegacia e limites de cover |
| [interfaces/README](../assets/interfaces/README.md) | Geometria, ícones, celular e caderno | Corrigidos responsabilidades, toque, apps/temas, PC e conclusão natural |
| [sprites/README](../assets/sprites/README.md) | Personagens/fotografias | MJ em outros locais, James/Lulith cadastrados e mapas identificados |

## Divergências e classificação

| Informação encontrada | Classificação atual e evidência |
|---|---|
| MJ provisória, jogador escolheria nome | Desatualizado. Nome definitivo por orientação do projeto; catálogo/falas usam MJ. Corrigido nos documentos de identidade |
| Novo jogo começa no beco | Desatualizado. title-menu prepara casa/quarto; state ainda tem default beco, explicando parte da confusão |
| James/casa/crime/delegacia/mapa futuros | Desatualizado no escopo básico. data, eventos locais, world-map/workstation e testes confirmam implementação |
| Toda a narrativa introdutória/enigma definitivo concluídos | Não confirmado; investigação e coordenadas são um recorte. Descarte da nota, terminal, metaprogressão/replay e múltiplos finais continuam planejados |
| Só três cenas e 30 módulos | Desatualizado: 11 cenas; 31 scripts iniciais + 3 scripts locais |
| Cada módulo exporta funções/imports ES | Desatualizado: scripts clássicos, factories e registro global; nenhum import/export ES |
| Lazy loading completo por sistemas/cenas | Parcialmente implementado: só eventos locais de três locais; dados/sistemas/CSS permanecem iniciais |
| Única global, instâncias plenamente isoladas | Desatualizado: ambiente clássico compartilhado, SANMD_CENAS e mutação DATA.cena |
| Todos os listeners ficam em events | Desatualizado: scene, cutscene, transição e outras fábricas também registram listeners |
| Todos os testes usam jsdom/helper | Desatualizado: mocks próprios, VM e inspeção de fontes/assets; sem dependência jsdom |
| Save só em memória / função exclusiva do celular | Desatualizado: repositório localStorage e persistência geral, usada por menu e Galeria |
| Telefone original sempre quebrado, ativo nunca MJ | Desatualizado: casa coleta telefone funcionando, crime o quebra; validação legada específica |
| Não há seleção/uso de item | Desatualizado: chave selecionável abre maleta e é consumida |
| Lulith não cadastrada / James sem sprite | Desatualizado: DATA.personagens registra ambos. Cadastro não implica participação em todas as cenas |
| Dez fotos concluem poses narrativas | Desatualizado: catálogo fotográfico independente do sprite neutral |
| Abertura espera eternamente por Skip / janela 350 ms | Desatualizado: sequência termina após luz, CONFIG usa 600 ms |
| Imagem do mapa pré-carregada no início | Desatualizado: src atribuído ao abrir; PC também adiado |
| Nenhum input nativo no jogo | Desatualizado: busca da Bolsa é nativa; coordenadas readonly acionam editor próprio |
| rsync no build / Android todo descartável / .kilo presente | Desatualizado: cp/sed no script, configuração nativa versionada, .kilo não encontrada |
| Ganho de performance comprovado por modularização | Não confirmado: adiamento existe, mas não há benchmark comparável nesta auditoria |

## Organização final

AGENTS começa por regras obrigatórias e índice; Parte I traz identidade/narrativa, gameplay e arte; Parte II cobre ambiente, inicialização, todos os scripts, sistemas, cenas/cutscenes e limites; Parte III reúne convenções, validação e índice especializado.

README mantém HTTP local, npm ci, npm run apk e npm test; remove detalhamento de fluxo/arquitetura para evitar duas centrais. READMEs locais preservam dimensões, IDs, geometria e receitas sem copiar o manual geral.

Documentos antigos recebem avisos de precedência, não uma reescrita silenciosa da história. Datas, resultados de QA e ideias ainda válidas não foram apagados. As regras de desenvolvimento antigas conflitantes (comentários/docstrings, listeners somente em um arquivo, ausência universal de erros) foram contextualizadas, sem mudança de código.

## Limpeza proposta — aguardando aprovação

| Candidato | Recomendação e motivo | Referências que exigem cuidado |
|---|---|---|
| ESTRUTURA_GAMING | Arquivar como histórico após preservar prompts/produção e detalhes únicos; arquitetura geral substituída | GDD, ideias, TODO, regras de design, READMEs de assets e documentos técnicos ainda apontam para suas seções |
| docs/ARCHITECTURE | Arquivar; sobreposição e descrição antiga | JS_MODULES ainda aponta para ele; rever também este inventário |
| docs/JS_MODULES | Arquivar após conferir detalhes de APIs não reproduzidos na central | GDD e índices legados; repetir busca de backlinks antes de mover |
| docs/STATUS_PROJETO | Arquivar como evidência datada, não apagar QA | Transições e entradas históricas de ADR ainda o referenciam |
| GDD / IDEIA_CONCEITUAL | Manter por ora; futura edição pode separar decisões vigentes, dúvidas e arquivo | Há ideias únicas, motivação, finais e questões artísticas não implementadas |
| REGRAS_DE_DESIGN | Manter como especificação aprofundada, reduzindo duplicação só após revisão humana | Tokens, exceções e pipeline não devem ser descartados por uma central resumida |

Não há recomendação de exclusão imediata. **Após aprovação**, `docs/ARCHITECTURE.md` e `docs/JS_MODULES.md` são candidatos à remoção, desde que seus contratos úteis estejam preservados e todos os links sejam redirecionados. `ESTRUTURA_GAMING.md` e `docs/STATUS_PROJETO.md` são candidatos a arquivamento, pois guardam produção e QA históricos. Referência de um documento legado para outro não o torna vigente. TODO, ADR, contratos especializados e quatro READMEs locais devem permanecer.

## Incertezas e validações não executadas

- Arte definitiva, dimensionalidade final, teor de algumas influências e detalhes futuros não são deduzidos do protótipo. Histórico criativo preservado.
- Proveniência completa dos assets e reprodutibilidade byte a byte dos geradores não verificadas; scripts não foram executados.
- Sem benchmark de desempenho, auditoria visual completa ou certificação de acessibilidade. Tokens/touch targets não foram declarados universalmente conformes.
- Build, instalação ADB e QA Android não foram repetidos nesta tarefa documental. Registros antigos de build/abertura não comprovam percurso/áudio da versão atual.
- Não foram executados checks CDP nesta revisão; comandos e caminhos foram inspecionados.

<a id="validacoes"></a>
## Validações desta execução

- Node v26.7.0, `npm test`: **241 aprovados, zero falhas, zero ignorados**, aproximadamente 14,35 s. O total do runner inclui o helper detectado; não é percentual de cobertura.
- Os comandos de execução/build foram conferidos em package.json, Capacitor e Gradle; nenhum build foi necessário para alterar Markdown.
- Verificador local: 25 documentos Markdown, 294 links relativos/âncoras verificados, nenhum erro; wikilinks Obsidian sem alvo ausente. Links externos não foram testados por rede.
- Catálogos executados em VM somente para leitura: 11 cenas, 69 caminhos de assets existentes, nenhum ausente; HTML contém 31 scripts iniciais e test contém 18 arquivos *.test.js.
- `git diff --check` sem erros; diff/status restrito a 24 Markdown existentes e este relatório novo. Nenhum JS, HTML, CSS, asset, configuração ou arquivo de teste foi alterado.

### Critério para concluir a limpeza futura

Aprovação explícita dos destinos; conteúdo único preservado; backlinks/âncoras redirecionados; índice central e TODO coerentes; diff apenas no escopo autorizado. Esta consolidação não inicia migração arquitetural.
