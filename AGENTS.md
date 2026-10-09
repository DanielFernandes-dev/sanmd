# SANMD — referência central

Consolidação de **08/10/2026**, conferida contra o código do commit `85b081e`. Este documento reúne identidade, arquitetura atual e manutenção de **Sim, Acredite nas Mentiras Dele (SANMD)**. A abertura também apresenta `kk`.

## Regras obrigatórias

- Investigar código, testes e documentação local antes de modificar. Intenção criativa não comprova funcionalidade.
- Reutilizar sistemas existentes; não duplicar Save, diálogos, transições ou controles dentro de cenas.
- Preservar **Conversar, Ir para, Celular e Bolsa**, desbloqueios, monólogos de fallback, cutscenes e regras de itens.
- **MJ é o nome definitivo da protagonista**; não existe escolha de outro nome.
- Save é um sistema geral, não um app exclusivo do celular. Preservar IDs e compatibilidade v1.
- Respeitar o escopo solicitado. Auditoria/documentação não autoriza refatoração, alteração de gameplay ou exclusão de documentos.
- Separar estado persistente de DOM, timers, áudio e interfaces; limpar recursos transitórios ao encerrar/restaurar.
- Atualizar esta referência e contratos afetados após mudanças arquiteturais. Executar testes proporcionais e informar limites da validação.
- Não atribuir desempenho à organização de pastas. Fechar uma interface não descarrega seu JavaScript.
- Preservar alterações preexistentes; não editar `www/` como fonte nem sobrescrever configuração nativa inadvertidamente.

## Índice

- [Parte I — Identidade e visão criativa](#parte-i)
  - [Identidade e narrativa](#identidade)
  - [Gameplay](#gameplay)
  - [Direção artística](#arte)
- [Parte II — Arquitetura atual](#parte-ii)
  - [Ambiente e diretórios](#ambiente)
  - [Inicialização](#inicio)
  - [Módulos e comunicação](#modulos)
  - [Sistemas gerais](#sistemas)
  - [Cenas e cutscenes](#cenas)
  - [Assets e limitações](#recursos)
- [Parte III — Manutenção](#parte-iii)
  - [Convenções](#convencoes)
  - [Testes e Android](#validacao)
  - [Documentação especializada](#documentacao)

**Status:** implementado = confirmado em código/recursos/testes; parcialmente implementado = parte do escopo; planejado = intenção futura; desatualizado = contradiz o presente; não confirmado = evidência insuficiente. Decisão criativa aprovada orienta produção, mas não comprova implementação. Registros históricos descrevem sua época.

<a id="parte-i"></a>
## Parte I — Identidade e visão criativa

<a id="identidade"></a>
### Identidade e narrativa

Visual Novel investigativa com exploração point-and-click, ambientação urbana em São Paulo e mistério tecnológico. A experiência individual atual funciona em navegador e Android, com cenas ilustradas, diálogos e interfaces investigáveis. É um protótipo, não a campanha completa.

MJ é a protagonista, investigadora ligada à polícia. James participa da introdução na casa; Lulith aparece na apresentação cinematográfica e integra o mistério do aparelho encontrado posteriormente. Os três têm recursos cadastrados, sem que isso implemente todas as participações futuras.

O recorte começa com a apresentação de Lulith e percorre casa, cena do crime, delegacia e beco. Bilhete, coordenadas, cofre e telefone conectam os locais. Há encerramento cinematográfico do recorte do Ato I. O bilhete atual fornece coordenadas utilizáveis: o enigma definitivo e a opção de descartá-lo com final imediato continuam planejados.

Direções criativas preservadas: investigação por pistas/contradições, narrativa fragmentada, elenco contido (diretriz de até seis personagens relevantes) e ausência de romance MJ–Lulith. ARG, replay, reconstrução integral da verdade e finais como perspectivas de MJ são intenções de longo prazo. A antiga explicação centrada em vírus autônomo não deve ser retomada como cânone atual. Significados adicionais de `kk` e questões estéticas ainda abertas permanecem no histórico conceitual, sem conclusão inventada.

<a id="gameplay"></a>
### O que o jogador faz

- Explora ambientes, examina objetos, coleta uma chave e a usa numa maleta; abre um cofre e recolhe um aparelho.
- Usa **Conversar** para falas presenciais ou pensamentos de MJ na ausência de interlocutor.
- Usa **Ir para** para destinos do ambiente; viaja entre locais desbloqueados pelo mapa. Na delegacia, o computador oferece mapa e busca por coordenadas; o celular ativo da Lulith abre o mesmo mapa.
- Recolhe Bolsa e telefone de MJ na casa. O telefone original funciona nesse trecho e quebra posteriormente. O aparelho do beco precisa ser ativado pela Bolsa.
- Consulta Mensagens, Arquivos e Galeria. Mensagens oferece respostas, espera e entrega sequencial; Arquivos apresenta pistas e um enigma de identidade. Mapas funciona no celular ativo da Lulith, enquanto permanece indisponível no da MJ. Os demais ícones não equivalem a apps funcionais.
- Pesquisa itens e navega por páginas de nove slots na **Bolsa**. A chave exige seleção e é consumida na interação correta; o celular tem ação própria.
- Cria até nove saves manuais apresentados como fotografias, com nome, preview, load e exclusão. Autosave é separado. O caderno do menu também carrega registros.
- Avança falas por clique, Enter ou espaço; volta por Escape quando permitido. Duplo clique/toque pula cutscenes. O reset narrativo do aparelho preserva fotografias/saves.

<a id="arte"></a>
### Direção artística

Pixel art é a direção aprovada, com referências de linguagem em Ace Attorney, SIMULACRA, investigação/ARG e computação retrô, sem copiar suas artes. O cenário domina a apresentação; dispositivos e caderno oferecem superfícies diegéticas quando apropriado.

O runtime usa imagens 2D provisórias de tamanhos variados, sprites estáticos transparentes e animações de apresentação. MJ/James aparecem conforme falas/cenas; Lulith está cadastrada e possui sequências de quadros completos. As dez expressões fotográficas de MJ não são poses narrativas. O design final de todos os personagens não está fechado.

Regras preservadas:

- Separar fundos, objetos interativos, personagens e UI. Não gravar texto variável/hotspots em cenários. Rótulos do caderno na arte são exceção existente; telas ilustradas também exigem zonas interativas próprias.
- Preservar proporção e alpha, sem esticar sprites. Palco de referência `1672:941`; composição fotográfica `4:3`. Base futura `320×180` é proposta, não dimensão atual dos assets. A discussão final 2D/3D permanece aberta.
- Preservar paleta escura, texto claro e destaque âmbar; roxos da Bolsa e temas distintos MJ/Lulith. Reutilizar tokens antes de criar valores.
- Preferir grade de 2 px/passos de 4 px, espaços internos de 8–12 px e painéis em torno de 16 px, conforme contexto. São diretrizes, não certificação de toda a folha CSS.
- Bordas, raios e sombras dependem da superfície: arte pixelada sem arredondamento artificial, controles discretos e aparelhos com tratamento próprio. Manter estados e foco distinguíveis.
- Fontes locais: Trebuchet/Segoe UI/Verdana, Courier em contextos técnicos, cursiva na assinatura e Georgia no caderno; existem exceções contextuais de paisagem. Não introduzir fontes externas sem necessidade.
- Texto responsivo, altura adaptável e entrelinha confortável; caixa alta reservada a rótulos. A diretriz de toque mínimo de 44 px exige QA das exceções do teclado/caderno.
- Hover condicionado ao apontador e foco distinguindo teclado/toque; movimento reduzido diminui efeitos decorativos sem apagar prazos narrativos. `pixelated` para arte pixelada; fotos têm exceção de interpolação suave.

[Regras extensas](REGRAS_DE_DESIGN.md) e READMEs de assets preservam especificações e produção. A regra antiga de monólogo sem nome não descreve a placa atual de MJ; restrições editoriais sobre reticências não estão integralmente aplicadas. Não modificar roteiro/arte implicitamente durante manutenção técnica.

<a id="parte-ii"></a>
## Parte II — Arquitetura técnica atual

<a id="ambiente"></a>
### Ambiente e diretórios

HTML, CSS e JavaScript sem framework, bundler ou transpiler. Os arquivos do navegador são **scripts clássicos**, não ES modules: não usam `import`, `export` ou `import()`. `type: commonjs` em package.json atende ferramentas Node, não converte os scripts do navegador.

Dependências declaradas: Capacitor core/android/cli `^8.5.0`, com lockfile. Web não requer instalação npm; preferir HTTP local. Node/npm atendem testes/build; Java e Android SDK são necessários para APK. Comandos no [README](README.md#como-executar).

```text
.
├── index.html / styles.css    # Palco, overlays e apresentação
├── js/                       # 31 scripts iniciais
│   └── scenes/               # 3 scripts adicionais sob demanda
│       ├── casa/events.js
│       ├── cena-crime/events.js
│       └── delegacia/events.js
├── assets/                   # audio/, cenario/, interfaces/, sprites/
├── test/ / scripts/          # Testes Node e checks de navegador
├── android/                  # Projeto/configuração nativa versionada
├── www/                      # Cópia gerada e ignorada, quando criada
├── capacitor.config.json
├── package.json / package-lock.json
├── AGENTS.md / README.md
├── TODO.md                   # Roadmap separado
└── docs/                     # Contratos, ADR e auditoria
```

Os documentos criativos antigos permanecem na raiz. Não há pastas implementadas `core/`, `systems/` nem cenas totalmente autônomas. A pasta `.kilo/` citada no guia anterior não foi encontrada.

<a id="inicio"></a>
### Inicialização e ciclo de vida

1. `index.html` carrega 31 scripts em ordem, compartilhando o ambiente global clássico. `bootstrap.js` é a entrada executável final.
2. `criarJogo()` em `game.js` cria estado, DOM, repositório, fachada e 17 subsistemas. As fábricas já executam antes de começar a sessão.
3. Bootstrap conecta menu e callback `act1Complete`, inicia `intro_abertura` e bloqueia o menu. A abertura termina naturalmente após a luz ou por dois inputs primários em até **600 ms**; não espera indefinidamente por Skip.
4. **Novo jogo** prepara eventos da casa, limpa tarefas/estado e estabelece `casa/casa_quarto_mj`; inicializa gameplay e apresenta `lulith_codigo`. Revelar a casa inicia monólogo e autosave. O default de `criarEstadoJogo()` ainda é o beco, diferente do início escolhido pelo menu.
5. **Carregar** prepara o módulo do local salvo e restaura snapshot validado; não repete Lulith.
6. `game.iniciar()` configura animações, eventos, mapa/estação, cena, cabeçalho e Bolsa uma vez. Modos livre/diálogo/celular/bolsa e controladores de transição/cutscene/menu regulam input.
7. Trocas preparam script/imagens sob fade, trocam callbacks locais e aplicam cena. Menu/restore cancelam tarefas transitórias e limpam referências do cache; não descarregam JavaScript.

<a id="modulos"></a>
### Módulos e comunicação

Caminhos relativos a `js/`; todas as linhas são de carga inicial, exceto as três em `scenes/`. Responsabilidade não significa isolamento completo nem obrigação de permanecer carregado para sempre.

| Arquivo | Responsabilidade |
|---|---|
| `bootstrap.js` | Entrada e conexão menu/jogo |
| `game.js` | Composição global e fachada |
| `config.js` | Constantes/tempos compartilhados |
| `state.js` | Estado inicial persistente/transitório |
| `dom.js` | Referências DOM agrupadas |
| `data.js` | Catálogo misto: cenas, personagens, falas, itens, cutscenes |
| `events.js` | Wiring de controles e teclado |
| `interface.js` | Disponibilidade de comandos/feedback |
| `animation.js` | Fade/animação e movimento reduzido |
| `dialogue.js` | Conversar, digitação, blips e efeitos de falas |
| `monologues.js` | Resolução contextual de monólogos |
| `scene.js` | Renderização, personagens, navegação, hotspots e narrativa |
| `scene-transition.js` | Exclusão, input e cache de imagens |
| `scene-modules.js` | Registro/carga/ativação de eventos locais |
| `mechanics.js` | Estratégias compartilhadas de hotspots |
| `phone.js` | Dispositivo, apps, mensagens, arquivos, reset |
| `gallery.js` | Fotos e interface de acesso ao Save |
| `bag.js` | Regras de itens, seleção, pesquisa e UI |
| `save-system.js` | Repositório/armazenamento versionado |
| `persistence.js` | Snapshot, validação, migração e restore |
| `keyboard.js` | Layout/representação do teclado |
| `text-entry.js` | Buffer, cursor, acentos e confirmação |
| `title-menu.js` | Caderno, Novo jogo, Carregar, saída |
| `world-map.js` | Mapa, bilhete, coordenadas, disponibilidade |
| `world-travel.js` | Coordenação de viagens |
| `workstation.js` | PC da delegacia e atividade de inventário |
| `cutscene.js` | Sessão, exclusão, Skip e conclusão |
| `cutscene-renderers.js` | Seleção de apresentação |
| `cutscene-view.js` | Abertura/título |
| `cutscene-frames.js` | Quadros, câmera e efeitos |
| `cutscene-audio.js` | Pool transitório, preload/limpeza |
| `scenes/casa/events.js` | Eventos exclusivos da casa — sob demanda |
| `scenes/cena-crime/events.js` | Reações à investigação — sob demanda |
| `scenes/delegacia/events.js` | Bilhete/computador — sob demanda |

Fábricas recebem contexto com estado, DOM, dados, configuração, ambiente e `services`. A fachada congelada encaminha operações; isso não torna o estado imutável. Callbacks/eventos narrativos ligam hotspots e conclusões, sem biblioteca externa. Dependências são ordem dos scripts, nomes globais e serviços, não imports ES.

```text
index → bootstrap → game (context + services) ↔ title-menu
                     ├─ Conversar / Celular / Bolsa / Save
                     ├─ cena → transição → imagens + scene-modules
                     │                         └─ factories locais/callbacks
                     └─ cutscene → renderer → áudio/quadros
```

O loader usa `SANMD_CENAS`, caminhos permitidos, scripts async e cache de promessa. Factories recebem contexto; desativação chama disposer dos callbacks. Falha permite retry, mas não existe timeout/cancelamento próprio de script. Código/registro continuam carregados após desativação.

<a id="sistemas"></a>
### Sistemas gerais

#### Conversar

`dialogue.js` escolhe conversa do personagem presente ou monólogo; `monologues.js` resolve fallback e `data.js` contém falas. Após James, Conversar permanece desbloqueado mesmo sem NPC. Avançar durante digitação completa a linha; depois prossegue/encerra. Conclusão atualiza marcos, restaura personagem e salva checkpoint.

Autor/`personagemId` determina sprite; cena/animação controlam entrada/saída sem reiniciar a entrada em falas consecutivas. Há blip Web Audio e efeitos de notificação/impacto. Falha de áudio não bloqueia texto. Falas derivadas e pose não entram no snapshot.

#### Ir para

`scene.js` valida destinos de `DATA.locais`; `irParaLocal` atende viagens. `world-map.js` gerencia busca/disponibilidade, `world-travel.js` fecha interfaces e salva viagens bem-sucedidas. Computador não é app do celular.

Transição bloqueia input antes do await, faz fade-out, prepara módulo/imagens, aplica cena e revela. Tempos 320/100/400 ms; reduced motion e timeout de imagens de 10 s. Prepara fundo, variantes e frames de hotspots, não só variantes visíveis. Falha recupera localização/apresentação; concorrência retorna falso. Callbacks locais são desativados, mas listeners globais não são descartados por cena.

#### Celular

`phone.js` controla aparelho, tema, relógio, apps, filas, cooldown e reset. `aparelho` distingue original funcionando/quebrado, ativo (`null`, `mj`, `lulith`) e tema (`mj`, `lulith`). Disponibilidade depende de progresso e modo livre.

Mensagens, Arquivos e Galeria são funcionais. Mapas reutiliza o sistema global no celular ativo da Lulith. MJ usa seu tema na casa; ativar o celular do beco usa Lulith. Personalização livre não existe. Reset limpa conteúdo narrativo visível, preserva dados pré-reset previstos e saves.

`gallery.js` apresenta saves; não implementa armazenamento. `text-entry.js`/`keyboard.js` atendem nome de foto, identidade e coordenadas, com layouts/cursor/acentos. Mensagens usa opções; a pesquisa da Bolsa é input nativo, contrariando a antiga afirmação de ausência total de inputs.

#### Bolsa

`bag.js` reúne regras/UI. `ITEMS` define IDs, assets, descrição e ações; `state.inventory` contém IDs, `inventoryHistory` movimentações e `state.bolsa` seleção/página/pesquisa transitórias. Nove slots por página não significam limite de nove itens.

`scene.js` desenha objetos/hotspots percentuais; `mechanics.js` despacha `examine`, `collect`, `interact`, `use_item`. Condições e flags impedem repetição. `crime_small_key` usa `use_on_hotspot`, seleção obrigatória e consumo na maleta. `lulith_phone` usa `activate_phone`: sai da Bolsa ao virar aparelho ativo, apesar de não ser consumível genérico. A reação reutiliza diálogos.

#### Save — sistema geral

`save-system.js` mantém JSON em `sanmd:saves`: `storageVersion: 1`, até nove `manualSaves` e um `autosave`; storage null usa memória. `persistence.js` captura/valida/normaliza/restaura; menu e Galeria são clientes.

Snapshot `saveVersion: 1`: `capturedAt`, `act1Complete`, `aparelho`, `inventory`, `inventoryHistory`, `sceneState`, `worldMap`, `localizacao`, fase/rota de `dialogo`, prazos/status de `celular`, `arquivos` e `mensagens`. Exclui DOM, áudio, timers, interfaces abertas, texto/seleção, cutscene e foto pendente. Save manual acrescenta ID/nome/data/cena/expressão, não pixels.

Validação precede restauração; campos legados têm inferências específicas, não migração universal. Cenas removidas são rejeitadas. Fases de monólogo são validadas contra todos os catálogos, pois acompanham viagens. Mapa, marcos da casa, aparelho e inventário têm normalizações próprias; preservar IDs fotográficos e contrato v1.

Autosave: fim de diálogo/reset/hotspot, viagem bem-sucedida no mapa, desbloqueio de localização, início de sessão, encerramento do ato e saída elegível por visibilitychange/pagehide. Ativação conclui pela reação narrativa. Navegação interna isolada não é o mesmo que viagem pelo mapa. Load não sobrescreve checkpoint: cancela tarefas, restaura dados, retoma/normaliza deadlines e recompõe UI. [Contrato completo](docs/SAVE_SYSTEM.md).

<a id="cenas"></a>
### Cenas e cutscenes

Há **11 cenas em quatro locais**, em `data.js`:

| Local | IDs | Conteúdo |
|---|---|---|
| Casa | `casa_quarto_mj`, `casa_sala`, `casa_cozinha`, `casa_quarto_james` | Introdução, Bolsa, telefone, James, portas/quadrinhos |
| Crime | `crime_sala` | Vidros, chave, maleta |
| Delegacia | `delegacia_corredor`, `delegacia_investigadores`, `delegacia_mesa_mj` | Bilhete/PC/mapa |
| Beco | `beco_entrada`, `beco_interior`, `beco_fundo` | Cofre, aparelho, saída |

Definições têm background, destinos, personagens, initialState, objetos/variantes e hotspots com condições/changes/eventId. `sceneState` preserva flags em retorno/save. O banheiro removido não é destino atual. Pastas de eventos não contêm toda a cena: dados, falas, assets e regras do beco continuam compartilhados.

`CUTSCENES` contém `intro_abertura` (título/luz), `lulith_codigo` (dez quadros), `act1_ending` (oito quadros + preto gerado, sem nono PNG) e `act1_title`. Controlador mantém uma sessão, exclusão/Skip/conclusão idempotente; renderers e pool de áudio limpam tarefas. Preload é ligado à sequência solicitada. Fim natural e Skip compartilham efeitos narrativos.

**Sair do beco** surge na entrada após cofre aberto/aparelho coletado, com `act1Complete` falso; não exige ativação nem terminar mensagens. Coleta isolada não dispara a sequência. Conclusão salva flag/checkpoint e apresenta título/menu. [Detalhes e QA histórico](docs/cutscenes.md).

<a id="recursos"></a>
### Assets, carregamento e limites

Assets organizados em cenario/sprites/interfaces/audio. Caminhos relativos resolvem a partir do documento, não da pasta JS. Preservar caixa (`MJ.png`), IDs e grafias existentes (`custcene-beco`, `escritoria-mj.png`). Mapas estão em sprites, mas não são personagens.

HTML/CSS referenciam visuais; data.js concentra conteúdo. Mapas/PC recebem src ao abrir. Cache de cenas reduz referências após transições e limpa no menu/restore, sem forçar limpeza do cache do navegador. copy:web copia **todos** os assets, inclusive referências/READMEs; lazy loading não reduz automaticamente APK.

Limitações comprovadas: catálogo/CSS monolíticos, fábricas/overlays eager, scene.js com responsabilidades mistas, mutação de `DATA.cena`, listeners tanto nas fábricas quanto nos registradores e loader sem timeout próprio. DI não significa isolamento completo. Não foi medido ganho de FPS/memória/tempo nesta auditoria. Antes de ampliar lazy loading, comparar cache frio/quente, tempo até menu/cena, requests/bytes, tarefas longas e retenção após ciclos no mesmo dispositivo. A separação arquitetural continua parcial e não foi alterada aqui.

<a id="parte-iii"></a>
## Parte III — Desenvolvimento e manutenção

<a id="convencoes"></a>
### Convenções e integração

- Seguir factories `criar*`, camelCase, constantes UPPER_SNAKE_CASE e IDs existentes. Não há exports ES; conversão exige rever carga/testes.
- Usar contexto/fachada, sem importar internals de outra cena ou duplicar sistemas. Freeze de contratos não implica imutabilidade geral.
- Campo persistente novo exige captura, validação, defaults legados e testes de load. Não persistir DOM/callbacks/UI transitória.
- Hotspot novo: registro em mechanics.js; retornar false quando bloqueado; reaproveitar condições/flags/pipeline.
- Cutscene nova: CUTSCENES, tempos CONFIG e `services.iniciarCutscene(id, onComplete)`; reaproveitar áudio/Skip.
- App novo: markup na interface existente, comportamento no sistema apropriado e eventos/navegação integrados.
- Listeners precisam de dono, registro idempotente e disposer quando locais. Isso é requisito, não alegação de conformidade universal atual.
- Preferir tempos/tokens existentes; ainda há valores locais/CSS. Não declarar centralização absoluta.
- Preservar comentários/docstrings. TODO antigo proíbe comentários genericamente enquanto design admite justificativas: não usar a contradição para apagar explicações; evitar comentários redundantes e registrar contratos.
- Assets novos preservam proporção/alpha e IDs; atualizar README local/testes quando o contrato mudar.

Checklist: conferir escopo/diff, modos e marcos, reentrância/falhas, limpeza de tarefas, saves legados, assets, regressões e QA browser/Android proporcional. Não prometer ausência universal de erros não tratados.

<a id="validacao"></a>
### Testes e Android

`npm test` executa `node --test`. Há 18 arquivos *.test.js e load-game.cjs. Alguns usam VM/mocks próprios, outros inspecionam fontes/assets; não há Jest nem jsdom instalado. O helper simula DOM/Audio/Image, não renderização real. Loader tem teste dedicado; harness geral também prepara factories locais.

Testes exercitam navegação/marcos, monólogos, Bolsa/consumo, saves, fotos, texto, menu, cutscenes, transições, loader e workstation. Resultado desta execução no [relatório](docs/AUDITORIA_DOCUMENTAL.md#validacoes); não representa percentual de cobertura. Toque, clipping, foco, som, movimento reduzido e suspensão/retomada exigem QA real.

`npm ci` instala o lockfile; `npm run apk` copia fontes para www, sincroniza Capacitor e roda Gradle assembleDebug. O script recria www e usa cp/sed, não rsync. APK em `android/app/build/outputs/apk/debug/app-debug.apk`.

Capacitor: webDir www, app ID com.sanmd.game. Android: minSdk24, compile/target36, paisagem; MainActivity.java libera áudio sem gesto no WebView, sem garantir autoplay no navegador. Há configuração nativa versionada, não só arquivos descartáveis.

QA funcional: build/sync, conferir pacote, instalar preservando dados, testar Novo jogo/Load, percurso completo, comandos/overlays, saves v1, Skip/fim natural, som e retomada em aparelho. Build/abertura não equivalem a QA completo. Checks CDP em [INTERFACE_INPUT](docs/INTERFACE_INPUT.md) dependem de Chromium; não executados nesta consolidação.

<a id="documentacao"></a>
### Documentação especializada e histórico

README apresenta/executa; AGENTS é a referência geral; READMEs locais aprofundam assets; TODO mantém tarefas.

- [Save](docs/SAVE_SYSTEM.md), [point-and-click](docs/POINT_AND_CLICK.md), [transições](docs/SCENE_TRANSITIONS.md), [mecânicas](docs/MECHANICS_PATTERN.md).
- [Cutscenes](docs/cutscenes.md), [texto](docs/TEXT_INPUT.md), [temas](docs/PHONE_THEMES.md), [mapa/PC](docs/mapa-global.md), [input/QA](docs/INTERFACE_INPUT.md).
- [Cenários](assets/cenario/README.md), [sprites](assets/sprites/README.md), [interfaces](assets/interfaces/README.md), [áudio](assets/audio/README.md).
- [TODO](TODO.md): roadmap; [ADR](docs/ADR_LOG.md): decisões datadas.
- [GDD](GDD.md), [ideias](IDEIA_CONCEITUAL.md) e [regras de design](REGRAS_DE_DESIGN.md): intenções, dúvidas e especificações extensas preservadas, com ressalvas de atualização.
- [Auditoria documental](docs/AUDITORIA_DOCUMENTAL.md): inventário, divergências, validações e candidatos à limpeza. Não remover arquivos sem aprovação e revisão de backlinks.
