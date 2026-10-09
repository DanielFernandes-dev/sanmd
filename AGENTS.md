# SANMD — referência central

O protótipo atual é a versão **1.1.1**. Esta indicação descreve o estágio do projeto; a campanha completa continua planejada.

Consolidação de **08/10/2026**, conferida contra o código do commit `85b081e`. Este documento reúne identidade, arquitetura atual e manutenção de **Sim, Acredite nas Mentiras Dele (SANMD)**. A abertura também apresenta `kk`.

Atualização pontual de **09/10/2026**, referente ao commit `cfa1b28`: acesso ao mapa pelo celular da Lulith, ajuste vertical da bolsa e ampliação da chave. As demais seções mantêm a base da consolidação; esta atualização não representa uma nova auditoria integral.

Consolidação complementar de **09/10/2026**, sobre `5dd9ea5`: conteúdo útil dos cinco documentos legados da raiz incorporado a esta referência, com autorização de remoção. Decisões criativas, regras, pendências e produção estão nas seções abaixo; descrições antigas conflitantes não são contratos atuais. Texto integral e checklists datados continuam recuperáveis pelo Git (`git show 5dd9ea5:NOME_DO_ARQUIVO.md`).

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
  - [Personagens e campanha planejada](#visao-criativa)
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
- [Parte IV — Regras detalhadas e roadmap](#parte-iv)
  - [Design e apresentação](#design)
  - [Roadmap do Ato I](#roadmap)
  - [Produção fotográfica e histórico](#producao-fotografica)

**Status:** implementado = confirmado em código/recursos/testes; parcialmente implementado = parte do escopo; planejado = intenção futura; desatualizado = contradiz o presente; não confirmado = evidência insuficiente. Decisão criativa aprovada orienta produção, mas não comprova implementação. Registros históricos descrevem sua época.

<a id="parte-i"></a>
## Parte I — Identidade e visão criativa

<a id="identidade"></a>
### Identidade e narrativa

Visual Novel investigativa com exploração point-and-click, ambientação urbana em São Paulo e mistério tecnológico. A experiência individual atual funciona em navegador e Android, com cenas ilustradas, diálogos e interfaces investigáveis. É um protótipo, não a campanha completa.

MJ é a protagonista, investigadora ligada à polícia. James participa da introdução na casa; Lulith aparece na apresentação cinematográfica e integra o mistério do aparelho encontrado posteriormente. Os três têm recursos cadastrados, sem que isso implemente todas as participações futuras.

O recorte começa com a apresentação de Lulith e percorre casa, cena do crime, delegacia e beco. Bilhete, coordenadas, cofre e telefone conectam os locais. Há encerramento cinematográfico do recorte do Ato I. O bilhete atual fornece coordenadas utilizáveis: o enigma definitivo e a opção de descartá-lo com final imediato continuam planejados.

Direções criativas preservadas: investigação por pistas/contradições, narrativa fragmentada, elenco contido (diretriz de até seis personagens relevantes) e ausência de romance MJ–Lulith. ARG, replay, reconstrução integral da verdade e finais como perspectivas de MJ são intenções de longo prazo. A antiga explicação centrada em vírus autônomo não deve ser retomada como cânone atual. Significados adicionais de `kk` e questões estéticas ainda abertas estão preservados na [visão criativa](#visao-criativa), sem conclusão inventada.

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

[Regras detalhadas](#design), [produção fotográfica](#producao-fotografica) e READMEs de assets preservam especificações e produção. A regra antiga de monólogo sem nome não descreve a placa atual de MJ; restrições editoriais sobre reticências não estão integralmente aplicadas. Não modificar roteiro/arte implicitamente durante manutenção técnica.

<a id="visao-criativa"></a>
### Personagens e campanha planejada

Esta seção preserva decisões e hipóteses criativas; a Parte II detalha a implementação atual. O projeto experimental/vibecoding se dirige a quem gosta de investigação, enigmas, narrativa não linear e metalinguagem. Android é o alvo de distribuição, com navegador já funcional; distribuição desktop própria permanece possibilidade. Além de Ace Attorney e SIMULACRA, Cicada 3301 e Enigma do Medo são referências de investigação e ARG, e CRT/terminal são referências visuais.

| Personagem | Decisões de escrita | Questões abertas |
|---|---|---|
| MJ | Mulher adulta, investigadora criminal/consultora técnica ligada à polícia, curiosa e analítica; experiência prévia com ARGs, enigmas e escape rooms. Cansaço e sono ruim por trabalho antecedem a trama. Questiona mentalmente o que observa; curiosidade aparentemente superficial ganha contexto depois | Quem apresenta sua experiência, em qual cena e quanto o jogador sabe antes do aparelho |
| Lulith | Mulher, dona do aparelho; persuade com leveza e brincadeiras, prefere que o outro aja por vontade própria e se irrita quando perde controle. Sem romance com MJ; evitar a leitura de perseguição romântica/stalker | O que perdeu, quem tirou, o que significa recuperar, alvo e natureza da aparente vingança |
| William James | Amigo de dormitório, antigo professor na preparação de MJ para o concurso e colega de ramo há cerca de dois anos. Preocupa-se com cansaço e percepção, sem acusá-la de mentir nem negar sua competência | Desenvolvimento das cenas futuras e participação no caso original |

O gênero de MJ é preferência autoral, sem obrigação de justificativa narrativa. O de Lulith contribui para o tom pretendido, sem determinar toda a trama. O medo de MJ interpretar mal uma farsa, ilusão ou alucinação sustenta a personalidade; não deve virar eixo central ou mecânica psicológica. Seu código dramático **provisório** é medo de estar errada → aprender a confiar → compartilhar informações. No máximo seis personagens relevantes; não é obrigatório ocupar todas as vagas.

Lulith pesquisou candidatos da região com experiência em ARG/escape room e selecionou MJ por competência; ela não é a única testada. Uma cena do computador de Lulith mostrando a pesquisa é **provisória**. Quantidade/destino dos candidatos, processo de seleção, presença atual e participação no elenco continuam abertos; o registro parcial do aparelho não fecha essas respostas para a campanha inteira.

**Princípio narrativo aprovado:** o jogo não mente diretamente ao jogador. Personagens podem mentir e a apresentação pode omitir, esconder ou contextualizar; as pistas precisam permitir releitura justa depois da descoberta. Cenários, horários, fotografias, inscrições, notícias, objetos, expressões, interfaces, arquivos e mecânicas contam a história, sem exposição verbal excessiva. Pistas opcionais aprofundam a investigação sem bloquear a campanha básica.

A progressão desejada é história → investigação → metalinguagem → ARG → verdade. O jogador casual conclui uma rota; novas partidas permitem perceber manipulação, reconstruir cronologia e compreender a história oculta. Cada replay precisa oferecer outra descoberta ou interpretação, não repetição sem finalidade.

| Etapa planejada | Conteúdo e limite atual |
|---|---|
| Ato I — A Curiosidade | Lulith silenciosa → James/MJ → caso tutorial → delegacia/nota → descarte ou solução → coordenadas/viagem → puzzle do cofre → aparelho/primeiro contato/reset → apresentação dos sistemas. O protótipo já percorre os locais, mas não implementa todos esses puzzles, escolhas ou tutoriais |
| Nota descartada | Escolha explícita, com confirmação antes de encerrar, seguida de final imediato e progresso mínimo. Nome, texto, percentual, pista de replay e inclusão na lista oficial de finais ainda indefinidos |
| Ato II — O Falso Teste | Pendente de reestruturação; aprofundar candidatos, testes, pistas pré-reset e reinterpretar a aparente vingança |
| Ato III — A Conspiração | Pendente de definição; motivação, origem dos testes, finalidade do celular, destino dos participantes, clímax e eventual tempo como recurso |

O primeiro caso deve ser curto, original e ensinar dedução por pistas/contradições. O primeiro julgamento de Ace Attorney foi sugerido apenas como referência estrutural temporária, sem manter conteúdo copiado. O cofre precisa de puzzle diferente do da nota, com pistas e dicas dedutíveis; hoje abre por interação. Bairro, delegacia real/fictícia, locais reconhecíveis de São Paulo, relevância do esconderijo, garantia de MJ encontrá-lo e risco de outra pessoa chegar antes continuam em aberto. O mapa ilustrado e o fast travel atuais não decidem a representação final da cidade nem exigem integração com Google Maps.

**Apps futuros:** Notas para registros contextuais sem transformar hipóteses em fatos; Câmera para pistas ou função narrativa mínima; Galeria poderá receber gravações/pistas; Terminal para informação escondida; Progresso para descobertas. O Save fotográfico já funciona na Galeria, mas a introdução diegética, um app Câmera separado e sua relação com replay continuam decisões futuras. Mapas já funciona no aparelho da Lulith. Ícones sem função precisam comunicar indisponibilidade.

Terminal: comandos candidatos `decode`, `scan`, `decrypt`, `access`, `trace`; sintaxe, ajuda, erros úteis, quantidade e dificuldade de puzzles ainda por definir. Ensinar ao menos um comando por puzzle curto no Ato I, sem exigir conhecimento externo. Substituição, padrões, criptografia, sequências e fragmentos textuais são possibilidades. A trava que esconde funções na presença de outras pessoas é **provisória**: não implementar sem justificar narrativa, feedback e viabilidade.

Finais são perspectivas de MJ, com um encerramento completo associado à reconstrução da verdade. Quantidade, nomes, condições, diferenças, necessidade de ver todos e relação exata com 100% não estão definidos. O progresso pretende registrar finais, evidências, gravações, arquivos, pistas, personagens ocultos e ARG, sem revelar como obter o que falta. Um botão central do celular e uma tela após finais são propostas de acesso. Percentual e pesos precisam ser definidos; 100% significa compreensão de tudo que existe para descobrir, não simples coleta de itens. Pistas pós-final podem apontar para cenas reinterpretáveis e informações perdidas antes do reset.

ARG/metalinguagem continuam planejados: investigação de arquivos reais do APK em paralelo aos arquivos ficcionais, possíveis mensagens/códigos/documentos ocultos e expansão Web/mundo real. As antigas pastas exemplificativas `scenes/scripts/data/archive` não descrevem assets atuais. Essa camada não deve ser obrigatória sem avaliar acessibilidade e manutenção. A progressão pretendida vai de perceber segredos a perceber que a história reconhece a investigação externa. `kk` como pista textual recorrente de Lulith ou outro personagem é hipótese, a confirmar sem revelar identidade ou mentira cedo demais.

**Produção visual:** Protótipo 1 valida compreensão e composição; Protótipo 2, adequação ao mundo/personagens; Protótipo 3 fecha designs. Arte genérica pode usar IA com origem declarada. Pixel art permanece direção final; cenários finais 2D, 3D tratado ou híbridos não estão decididos. A antiga menção a influência hentai permanece uma questão estética não resolvida, sem designs exagerados nem função narrativa/gameplay presumida. Não a transformar automaticamente em gênero ou conteúdo aprovado.

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
└── docs/                     # Contratos, ADR e auditoria
```

A raiz mantém apenas AGENTS.md e README.md como documentos Markdown; visão criativa e roadmap estão centralizados aqui. Não há pastas implementadas `core/`, `systems/` nem cenas totalmente autônomas. A pasta `.kilo/` citada no guia anterior não foi encontrada.

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

O ícone Mapas é habilitado por `activePhone === "lulith"`, independentemente do tema. Abre o overlay global existente com `source: "lulith_phone"`; fechar retorna à tela inicial e ao foco do ícone. Viagens fecham o celular antes da transição. Origem e retorno são transitórios, sem mudança no Save v1. A apresentação permanece no overlay global, sem uma tela de mapa própria encaixada no celular; responsividade, reset e navegação por toque desse acesso ainda exigem QA real.

`gallery.js` apresenta saves; não implementa armazenamento. `text-entry.js`/`keyboard.js` atendem nome de foto, identidade e coordenadas, com layouts/cursor/acentos. Mensagens usa opções; a pesquisa da Bolsa é input nativo, contrariando a antiga afirmação de ausência total de inputs.


<a id="primeiro-contato"></a>
#### Primeiro contato, arquivos e ritmo

O contato é `???` durante toda a conversa, sem revelar nome, gênero ou dados pessoais. MJ presume um homem até resolver a identidade. A primeira resposta condicional fixa `rotaMonologoArquivo`; outras leituras não substituem essa rota individual.

| ID / arquivo | Informação e efeito |
|---|---|
| `candidatos` / `CANDIDATOS_04.log` | Perfis avaliados em São Paulo; libera pergunta e monólogo `arquivoCandidatos` |
| `rota` / `ROTA_013.txt` | Nota → coordenadas → cofre → aparelho; libera rota e monólogo `arquivoRota` |
| `recuperar` / `RECUPERAR.tmp` | Recuperar algo que foi tirado; libera cobrança e monólogo `arquivoRecuperar` |
| `identidade` / `REMETENTE.enc` | Liberado ao concluir o contato; `5-12-1`, chave A1Z26, solução `ELA` |

Os três primeiros registros podem ser vistos antes/durante o contato. Resolver `ELA` preserva a rota individual e muda os pronomes para feminino. Examinar os quatro e resolver o enigma dá prioridade a `todosArquivos`, inclusive depois do reset. Fases gerais incluem `inicial`, `identidadeResolvida`, `aposPrimeiroEnvio` e `conversaConcluida`, além dos monólogos locais.

As etapas de `DATA.mensagens.dono` são `celular-encontrado`, `explicar-escolha`, `explicar-teste`, `questionar-confianca`, `encerrar-contato` e `antes-reset`. Opções têm ID, texto enviado, resposta, próximo destino e requisitos opcionais revalidados no domínio. A rota principal/candidatos passa por `explicar-escolha`; rota/recuperação passa por teste/confiança/encerramento; convergem antes do reset. Só escolhas realizadas entram no histórico; quantidade de opções varia pelas pistas.

`CONFIG` define digitação de fala em 65 ms/caractere, cooldown inicial de 60 s, entregas individuais de 1,2 s, janela de 60 s após o chat, reset de 2,8 s, relógio de 1 s e cronômetro visual de 250 ms. Cooldown só ocorre no primeiro envio; escolhas ficam bloqueadas, depois aparece o indicador de digitação. Concluir o chat libera `REMETENTE.enc` e o cronômetro vermelho. Reset passa por `inativo`, `agendado`, `executando`, `concluido`, bloqueia a navegação durante a limpeza e deixa Mensagens/Arquivos vazios. Arquivos vistos, identidade e histórico pré-reset ficam preservados no estado e nos snapshots, não apenas em memória da sessão. Isso não implementa metaprogressão entre campanhas.

Ao fechar o celular, relógio/tarefas de mensagens são cancelados; deadlines absolutos permitem retomada. Load recria timers e normaliza reset expirado sem sobrescrever o autosave. Falhas de áudio não impedem a entrega narrativa.

<a id="tela-inicial"></a>
#### Caderno e apresentação dos saves

`title-menu.js` apresenta a capa (`menu.png`) e páginas (`save-menu.png`) com botões transparentes sobre os rótulos. `animateBook` é compartilhada por abrir/fechar; estados `menu`, `opening`, `load`, `closing`, `startingGame` e `inert` são transitórios. Novo jogo aguarda animação, prepara/reset da casa, inicializa e apresenta Lulith; Carregar reutiliza o repositório e a restauração geral, sem repetir a cutscene.

O caderno mostra quatro slots por página, dois em paisagem com altura até 500 px, metadados e miniaturas. Inclui o autosave como `Último progresso · automático`, usando o cenário como thumbnail. Sem registros, abre e informa `Nenhum registro disponível.`; vazios são decorativos. Portanto, a tarefa antiga de criar acesso ao autosave já foi atendida. Autosave de saída é condicionado a gameplay sem cutscene/transição; encerramento forçado não garante esse checkpoint.

<a id="galeria"></a>
#### Galeria e composição fotográfica

A Galeria usa grade 3×3, contador e espaços vazios tracejados; nomes longos e metadados não devem deformar os slots. Captura cria snapshot temporário e sorteia uma expressão evitando repetição imediata; flash de 140 ms precede preview com nome (até 28 caracteres), confirmar/cancelar. Cancelar não ocupa slot; o décimo save é recusado sem sobrescrever fotos. Detalhe permite carregar, excluir por ID ou voltar. Load/exclusão usam confirmação nativa; exclusão não altera autosave nem campanha corrente. Datas são timestamps apresentados em `pt-BR`, com hora/minuto.

Composição 4:3 reutilizada em miniatura/preview/detalhe: fundo independente e MJ centralizada, altura de 92%, base em -10%, sem sorteio ao reabrir. IDs `mj__photo__01`–`10` permanecem estáveis e não viram poses narrativas. Fallback neutro recusa propriedades herdadas/valores inválidos do mapa. Não há screenshot real, cloud save, compartilhamento, seleção de capítulos ou metaprogressão. Papel claro, rosa/lilás no tema MJ e painéis translúcidos deixam o wallpaper aparecer; temas atuais prevalecem sobre mockups antigos. Ações, metadados e rolagem adaptam-se à paisagem; medidas dos assets estão nos READMEs locais e o contrato de persistência em [Save](docs/SAVE_SYSTEM.md).

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

No quarto da MJ, `backgroundSize: [1672, 941]` ativa a compensação do recorte `cover` já existente. A bolsa usa `rect: [78, 64.74, 9, 13]` e hotspot `[77, 62.74, 12, 17]`. Na cena do crime, a chave usa `[42.75, 68.75, 6, 8]` e hotspot `[40.5, 66.5, 10.5, 12]`. Os valores são porcentagens da arte lógica: ajustes de poucos pixels nessa arte podem ser pouco perceptíveis no aparelho. Os SVGs e as regras de interação foram preservados. O alinhamento final da bolsa com o chão ainda não foi confirmado visualmente.

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
- Preservar comentários/docstrings. A antiga proibição genérica de comentários conflitava com as justificativas de design: não usar a contradição para apagar explicações; evitar comentários redundantes e registrar contratos.
- Assets novos preservam proporção/alpha e IDs; atualizar README local/testes quando o contrato mudar.

Checklist: conferir escopo/diff, modos e marcos, reentrância/falhas, limpeza de tarefas, saves legados, assets, regressões e QA browser/Android proporcional. Não prometer ausência universal de erros não tratados.

<a id="validacao"></a>
### Testes e Android

`npm test` executa `node --test`. Há 18 arquivos *.test.js e load-game.cjs. Alguns usam VM/mocks próprios, outros inspecionam fontes/assets; não há Jest nem jsdom instalado. O helper simula DOM/Audio/Image, não renderização real. Loader tem teste dedicado; harness geral também prepara factories locais.

Validação pontual em 09/10/2026: 241 testes passaram com as mudanças de `cfa1b28`. Builds anteriores desse conjunto de ajustes foram instalados por ADB no SM_A055M, com inicialização confirmada; na última reinstalação antes do commit, o SHA-256 do APK no aparelho coincidiu com o artefato local. A correção final de foco do commit foi validada pela suíte, sem QA visual específico. Esses resultados não comprovam o alinhamento da bolsa nem todos os fluxos do mapa no celular.

Testes exercitam navegação/marcos, monólogos, Bolsa/consumo, saves, fotos, texto, menu, cutscenes, transições, loader e workstation. Resultado desta execução no [relatório](docs/AUDITORIA_DOCUMENTAL.md#validacoes); não representa percentual de cobertura. Toque, clipping, foco, som, movimento reduzido e suspensão/retomada exigem QA real.

`npm ci` instala o lockfile; `npm run apk` copia fontes para www, sincroniza Capacitor e roda Gradle assembleDebug. O script recria www e usa cp/sed, não rsync. APK em `android/app/build/outputs/apk/debug/app-debug.apk`.

Capacitor: webDir www, app ID com.sanmd.game. Android: minSdk24, compile/target36, paisagem; MainActivity.java libera áudio sem gesto no WebView, sem garantir autoplay no navegador. Há configuração nativa versionada, não só arquivos descartáveis.

QA funcional: build/sync, conferir pacote, instalar preservando dados, testar Novo jogo/Load, percurso completo, comandos/overlays, saves v1, Skip/fim natural, som e retomada em aparelho. Build/abertura não equivalem a QA completo. Checks CDP em [INTERFACE_INPUT](docs/INTERFACE_INPUT.md) dependem de Chromium; não executados nesta consolidação.

<a id="documentacao"></a>
### Documentação especializada e histórico

README apresenta/executa; AGENTS reúne referência geral, regras e roadmap; READMEs locais aprofundam assets.

- [Save](docs/SAVE_SYSTEM.md), [point-and-click](docs/POINT_AND_CLICK.md), [transições](docs/SCENE_TRANSITIONS.md), [mecânicas](docs/MECHANICS_PATTERN.md).
- [Cutscenes](docs/cutscenes.md), [texto](docs/TEXT_INPUT.md), [temas](docs/PHONE_THEMES.md), [mapa/PC](docs/mapa-global.md), [input/QA](docs/INTERFACE_INPUT.md).
- [Cenários](assets/cenario/README.md), [sprites](assets/sprites/README.md), [interfaces](assets/interfaces/README.md), [áudio](assets/audio/README.md).
- [Roadmap](#roadmap), [visão criativa](#visao-criativa) e [design](#design): conteúdo consolidado dos documentos removidos; [ADR](docs/ADR_LOG.md): decisões datadas.
- [Auditoria documental](docs/AUDITORIA_DOCUMENTAL.md): inventário, divergências, validações e candidatos à limpeza. Não remover arquivos sem aprovação e revisão de backlinks.

<a id="parte-iv"></a>
## Parte IV — Regras detalhadas e roadmap

<a id="design"></a>
### Design e apresentação

Regras transversais herdadas da especificação de design; não significam conformidade integral do CSS. A implementação é evidência do comportamento, não aprovação automática de toda divergência. Exceções precisam de justificativa e validação; este trabalho documental não autoriza corrigir arte, CSS ou roteiro. Regras gerais ficam aqui; dimensões, geometria e receitas de cada asset permanecem nos READMEs das pastas. Decisões que alteram arquitetura, apresentação ou pipeline entram no ADR. Uma arte nova não redefine regra geral ou layout silenciosamente.

#### Tokens, cor e tipografia

Reutilizar tokens de `:root` e tempos de `CONFIG`; para novas cores, fontes, durações e raios, preferir token semântico e registrar exceção quando necessário. A regra herdada proíbe novos valores desses tipos espalhados no CSS; os valores locais existentes são dívida, não um design system completo.

| Papel | Token ou paleta de referência |
|---|---|
| Fundo / tinta / tela / interação | `--cor-fundo: #0b0e16`, `--cor-texto: #f0ead6`, `--cor-tela: #11182d`, `--cor-destaque: #e8b34b` |
| Repouso dos comandos | Creme `#f4f0df`; âmbar reservado a interação/feedback |
| Bolsa | `--bolsa-accent: #9b7fd6`, `--bolsa-accent-soft: #7a5c9e` |
| Celular MJ | Rosa `#f2b5cd`, `#ed9bbc`, `#f3a5c1` |
| Celular Lulith | Frio `#64748c`, `#35435c`, `#edf0f6` |
| Caderno | Foco `#ffe0a0`, papel `#e6c593` |
| Diálogo / fotografia | Papel `#d9d6cf` / `#efe3da`; diálogo com texto escuro `#16181f` e placa azul `#1a3d4f` |
| Semântica | Vermelho `#ff536d`/`#ff667d` para erro/limite/urgência; verde `#72e0a4` para resposta do sistema; aviso `#ffe0ba` |

Subsistema com acento próprio não deve adotar âmbar de gameplay por conveniência. Vermelho não é decoração; verde não é confirmação genérica de ação do jogador. Cor nunca é o único sinal de estado. Papel claro distingue objetos diegéticos; separar tintas/fundos e verificar contraste real.

Quatro papéis tipográficos: `--fonte` para UI, Courier New para código/metadados/sistema do aparelho, cursiva para assinatura de MJ e Georgia para o caderno. Avenir Next/Trebuchet/system-ui na paisagem do celular é exceção contextual já registrada. Sem fonte externa nova por simples preferência.

| Faixa de referência | Uso |
|---|---|
| 7–9 px | Somente metadados dentro do celular; exige QA de legibilidade |
| 10–12 px | Corpo de app; gameplay não deve ficar abaixo de 11 px |
| 13–15 px | Botões, menus, campos e diálogo |
| 18–24 px | Títulos e marca manuscrita |

Texto adaptável usa `clamp()`, `vw` em texto livre e `cqw` sobre arte de proporção fixa. Entrelinha 1,2–1,6, corpo corrido a partir de 1,4; pesos 400/500/600/700. `letter-spacing` de `0.06em`–`0.12em` somente em rótulos curtos em caixa alta; não em parágrafos. Reservar altura mínima para conteúdo variável. Seleção deve ser permitida no conteúdo (diálogo, arquivos, mensagens e editor), não em controles/ícones/grades. A escala acima é uma regra de trabalho, não prova de legibilidade universal.

#### Espaço, superfícies e composição

Grade de 2 px, passo de trabalho de 4 px, espaçamentos usuais 2/4/6/8/10/12/16/20. Interior de controles em 8–12 px, distância entre grupos aproximadamente o dobro e painéis a partir de 16 px. Criar famílias semânticas de espaço/raio/sombra/camada permanece proposta, sem migrar o CSS nesta limpeza.

| Tratamento | Diretriz |
|---|---|
| Raios | 0 para leitura pixelada; 4–8 px para controles; 9–14 px para bolhas/itens; 17–34 px só para moldura/tela do aparelho. Teclado tem contextos conflitantes de 0 e 4–8: avaliar superfície |
| Bordas | 0 em ícones/áreas transparentes; 1 px em separadores; 1,5 px em slot preenchido da Bolsa; 2 px em escolhas/ação; 3–4 px em papel e moldura |
| Tracejado | Vazio/ainda não ocupado, nunca erro |
| Sombra pixelada | Dura/deslocada, referência `6px 6px 0 rgba(0,0,0,0.55)`; não difusa |
| Sombra ambiente | Referência `0 16px 48px rgba(0,0,0,0.75)` em overlays com backdrop |
| Brilho | Referência de 12 px na cor do subsistema, só para seleção/foco; não decoração em repouso |

Preservar `1672:941` na composição do palco/caderno e recorte fotográfico 4:3. Não esticar assets por eixo ou `fill`; recorte `cover` precisa ser planejado, e sprites mantêm proporção/alpha. Arte de proporção fixa usa container de referência para textos/zonas percentuais. Preferir `dvh` em regras novas de altura; `vh` ainda existe. Geometria real e cascata CSS prevalecem sobre medidas antigas como “todos os botões têm 60×60”.

Condições de layout de referência: até 700 px (comandos/tela estreita), até 680 px (Bolsa em coluna), paisagem até 600 px de altura (densidade de celular/Bolsa/teclado/apps), paisagem até 500 px (caderno compacto), `hover: hover` + `pointer: fine` (hover). Justificar condição nova e adaptar somente apresentação, nunca conteúdo/regra narrativa. Hover não deve ficar preso no toque.

Safe areas ainda exigem implementação/QA: `viewport-fit=cover` precisa vir junto de `env(safe-area-inset-*)` no componente que toca a borda; soma-se ao padding, sem encolher o cenário inteiro. Alvos primários devem ter ao menos 44 px em cada eixo. Áreas pintadas do caderno e teclas compactas de 26–34 px são exceções documentadas a revisar, não licença geral para alvos pequenos.

Overlays não empurram o cenário; usam posicionamento absoluto/fixo e camada própria. A ordem de referência da especificação é cenário 0 → objetos 1 → personagens 2 → hotspots/status 3 → diálogo 5 → menu 6 → fade 7 → celular 50 → menu inicial 1000 → cutscene 1001. Novas superfícies devem considerar também os overlays e `<dialog>` existentes; não elevar z-index arbitrariamente. Camada decorativa usa `pointer-events: none`; alvos transparentes sobre arte usam botão, eventos ativos e `touch-action: manipulation`.

Preferir estado explícito para layout. `:has()` ainda é usado no celular e no controle visual de input; `dvh`/`cqw` também exigem validar a versão real do WebView. Não repetir a antiga alegação de ausência de `:has()` nem inferir a versão mínima do motor pelo minSdk Android.

#### Movimento, controles e copy

Tempos narrativos e visuais compartilhados vêm de CONFIG. Referências de UI: compressão 50–80 ms, mudança de estado 150 ms, entrada curta 180 ms, piscar/cursor 0,7–1 s; personagem sai em 280 ms e entra em 320 ms, celular 280 ms, flash 140 ms, reset 2,8 s. Ainda há valores locais. Interação direta anima `transform`, evitando tamanho/posição que provoquem layout. Usar `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out` ou `steps()` para efeito pixelado; não introduzir `cubic-bezier` sem revisão da regra. Entrada de personagem usa ease-out e saída ease-in; disparo único fecha com forwards/both quando necessário.

Keyframes próximos ao componente, nomeados por função (`mj-entrar`, `falha-reset`) ou efeito (`piscar`, `subir`). Reduced motion deve reduzir decoração, flashes, câmera, shake e transições sem apagar eventos, quadros ou prazos narrativos. CSS e JS precisam refletir a preferência; progresso de reset continua comunicando estado. Animação não é snapshot e não retoma frame intermediário após load. Detalhes de título, câmera e cortes estão no [contrato de cutscenes](docs/cutscenes.md), inclusive texto de erro já pintado no notebook como parte da arte.

Interações usam controles semânticos com nome acessível; imagens/SVGs decorativos não recebem handlers. Campos nativos existentes, como pesquisa da Bolsa, mantêm seu papel. Foco por teclado precisa de substituto visível se remover outline; toque/mouse seguem o [contrato de input](docs/INTERFACE_INPUT.md). Referências: gameplay outline de 3 px/offset 2; hotspot 2/2; Bolsa 2/1; celular 2 px no acento do tema; caderno 3/3. Listas/arquivos podem usar borda/fundo em vez de outline. Pressionado, selecionado e desabilitado devem ser distinguíveis além da cor. `disabled` nativo ou `aria-disabled` coerente com a regra; opacidade 0,25–0,6 sozinha não comunica indisponibilidade a leitor de tela. Remover tap highlight exige feedback próprio.

Conteúdo dinâmico usa status anunciável, cronômetro usa semântica de timer; `aria-live="assertive"` fica reservado a urgência. Busca, estado do item e resultado vazio devem ser anunciáveis. Cenário decorativo não substitui nome acessível de pistas/hotspots. Preservar foco inicial/retorno e avaliar trava de foco dos overlays.

**Ir para:** contextual, compacto e próximo ao ícone, sem sidebar, título, modal ou backdrop. Referência de largura 170–230 px, altura pelo conteúdo; o antigo mínimo local de 40 px é dívida perante a meta geral de 44 px. Destinos são `button.message-choice`, com indicador pixelado e texto claro; alterações de estilo ficam em `#ir-para-menu .message-choice`, sem mudar respostas do telefone. Preservar `criarBotaoDestino`, `renderizarMenuIrPara`, `obterDestinos`, `temDestinos`, `irPara`, IDs e conexões. Foco inicial na primeira opção, Enter/espaço nativos, Escape devolvendo foco e fechamento após escolha. Evitar glow, grandes sombras, escala ao clicar ou ornamentação que concorra com a cena.

**Voz:** ambiente e ações sustentam a narrativa; monólogo é pensamento de MJ, diálogo é fala do autor indicado. A placa atual de MJ também aparece nos monólogos, substituindo a descrição antiga “monólogo sem nome”. Itens informam fatos e uso; termos técnicos são artefatos diegéticos. Evitar exposição antecipada, reticências decorativas e metalinguagem sobre modelos/prompts/assistente como voz do autor; menções ficcionais precisam de contexto narrativo. A política editorial não está integralmente aplicada e não autoriza reescrever falas neste escopo. Registro formal por personagem (idioma, cadência, gíria, concordância, comprimento de linha, pontuação e informação que não deve ser revelada) segue pendente antes do Protótipo 3.

#### Naming, arte e validação

IDs narrativos não dependem do nome físico. Arte é nomeada pela função, sem `ai`, `wip` ou descrição provisória no nome de runtime; origem fica na documentação. Preservar exceções existentes como `MJ.png`. Objetos/quadro usam snake_case e número (`safe_opening_01`), fotos `mj__photo__NN`, ícones `icon-*.svg`, fundos pelo local lógico. SVGs inline e fontes devem ficar sincronizados, com `viewBox="0 0 32 32"`, `currentColor` e `crispEdges` quando esse é o contrato existente.

CSS usa identidade por ID, itens/estados por classe, prefixo de componente e sufixos como `--selected`; evitar nomes dependentes de cor/número, seletores profundos e efeitos globais em outro componente. Overrides vêm depois da regra adaptada e recebem justificativa quando necessária. Não apagar comentários/docstrings úteis. A composição continua em `criarJogo`; factories ainda podem executar trabalho inicial, e caminhos também existem em HTML/CSS: a antiga declaração de todos os assets exclusivamente em data.js não é factual. Novos dados narrativos devem usar o catálogo/contratos existentes.

Assets opacos podem ser RGB, recortes/sobreposições RGBA; preservar alpha, inclusive valores interiores próximos de 255. Não embutir interface variável, diálogos, máscaras clicáveis ou molduras nos fundos; rótulos pintados do caderno são exceção documentada. Área segura percentual protege conteúdo essencial em recortes retrato/paisagem; rosto/gesto devem continuar visíveis acima do diálogo. Pixel art usa pixelated; fotografias/retratos derivados têm exceção explícita auto. Mockups não viram telas funcionais só por estarem empacotados. Produção por IA é derivação declarada, sem alegar extração pixel a pixel. Substituição que exige outra composição precisa de decisão, não ajuste silencioso do layout.

Documentação em português, links relativos, índice no README para documentos novos e estados explícitos de implementação/decisão. Frontmatter (`aliases`, `tags`, `status`, `updated`), nomes em caixa alta na raiz/kebab-case em docs e callout de objetivo eram convenções editoriais legadas; arquivos existentes têm exceções, sem renomeação automática. Atualizar referência geral, contrato local e ADR conforme escopo, indicando como conferir cada regra.

Fonte web é raiz/js/assets; www e assets web copiados no Android são gerados. O projeto nativo contém configuração versionada. `copy:web` recria a cópia e injeta versão de cache, não transforma runtime em ES modules. Verificar contratos de arquivos por existência/formato/dimensões e geometria contra arte; testes de fonte não provam aparência. Cor, composição, contraste, toque, foco e áudio precisam de inspeção real quando não automatizados.

<a id="roadmap"></a>
### Roadmap do Ato I e pendências

Substitui o TODO antigo. Caixas representam trabalho ainda pendente, não negação do recorte já implementado. Ordem sugerida: fechar conteúdo → integrar ao sistema existente → produzir arte provisória → validar → classificar feedback. Ato II/III, ARG completo, final verdadeiro e 100% ficam fora da entrega do Ato I. Polimento técnico não autoriza transformar hipóteses em cânone.

#### Conteúdo e progressão

- [ ] Fechar roteiro jogável completo, informação obrigatória/opcional, condições de avanço/falha e pontos de tutorial por cena; definir posição canônica do encerramento depois dos sistemas futuros. A saída atual do beco já funciona após coleta.
- [ ] Refinar MJ curiosa/competente/cansada e seu código dramático; apresentar experiência em enigmas naturalmente. Refinar James preocupado e Lulith persuasiva, preservando anonimato e ausência de romance. Decidir necessidade de elenco adicional no ato.
- [ ] Responder o mínimo necessário sobre recuperação/vingança, seleção de MJ, pistas dos demais candidatos, objetivo aparente do aparelho e garantia/risco de descoberta do cofre. Não fechar a história completa por inferência.
- [ ] Definir bairros, delegacia real/fictícia, local do crime, destino e importância para Lulith; escolher representação final de São Paulo, mapa e deslocamento. Mapa/PC/viagens atuais já existem.
- [ ] Desenvolver o caso original: vítima/incidente/envolvidos, cronologia, participação de James, objetos e pistas obrigatórias/opcionais, dedução justa, apresentação/relação de evidências, respostas erradas, dicas e conclusão sem conteúdo copiado.
- [ ] Criar enigma definitivo da nota: arte/texto, criptografia, pistas e dicas graduais, coordenadas coerentes com o destino, revelação após solução. Inspeção do bilhete e busca de coordenadas já funcionam.
- [ ] Criar escolha explícita de descartar/resolver, confirmação do descarte, reação, final imediato com nome/texto/percentual, opção de reinício/menu e eventual pista de replay; decidir se integra lista oficial de finais.
- [ ] Criar puzzle do cofre diferente da nota: design/esconderijo, pistas/solução/dicas, feedback e estado do aparelho. Abertura/coleta/ativação básicas já existem.
- [ ] Estender marcos/estado persistente apenas para conteúdo novo, com defaults legados e validação. Separar dados/regras conforme necessidade; não duplicar eventos/diálogos. Sistema de apresentação de evidências e interface geral de puzzles seguem futuros.
- [ ] Garantir bloqueios durante puzzles/diálogos/transições, foco correto, revisão de pistas sem quebrar progresso, impossibilidade de concluir sem evidências obrigatórias e ausência de bloqueio permanente por pistas opcionais.

#### Celular, terminal e continuidade

- [ ] Definir apresentação diegética pós-reset de cada função; ensinar retorno/tela inicial com ações curtas, mantendo conteúdo apagado inacessível e estados disponível/vazio/bloqueado/indisponível honestos.
- [ ] Reavaliar Notas antes de implementá-lo; definir Câmera separada e sua relação com Galeria/Save, gravações/pistas futuras e apresentação narrativa do Mapa já disponível.
- [ ] Definir Progresso provisório do Ato I, acesso pelo controle central e tela pós-final com mapa de descobertas sem soluções. Não antecipar cálculo completo de 100% ou ARG.
- [ ] Definir tutorial do Terminal: função narrativa, comandos mínimos, sintaxe, ajuda, erros, puzzle curto dedutível, registro de conclusão e consulta posterior sem recompensa duplicada; graduar desafios. Avaliar trava por presença somente após decisão narrativa/técnica.
- [ ] Separar futura metaprogressão do save da partida; decidir descobertas preservadas ao reiniciar e acesso a informações pré-reset. Save v1 e retomada de deadlines já existem; migrações entre versões incompatíveis deverão ser implementadas quando houver mudança real do formato.
- [ ] Validar todos os caminhos de mensagens no aparelho: reação por escolha, requisitos, bloqueio de duplicação, cooldown, entregas sequenciais, fechamento/reabertura, pronomes, rota individual/combinada e opções variáveis por viewport. Testes atuais já exercitam regras, mas não substituem QA real.
- [ ] Testar acesso ao mapa pelo celular da Lulith, foco de retorno, viagens, reset, toque e responsividade; tema não deve liberar mapa no aparelho da MJ.

#### Arte e apresentação

- [ ] Definir resolução-base (320×180 é proposta), paleta noturna/contraste, proporção e área corporal dos sprites, camadas editoráveis, foregrounds/efeitos, área segura e enquadramentos próprios para closes.
- [ ] Validar cenário-piloto a partir do dormitório existente: hora/clima/função narrativa, escala, enquadramento, camadas, objetos separados, máscaras/hotspots coerentes, leitura e rosto/gestos visíveis. Não tratar cenários básicos já existentes como ainda não criados.
- [ ] Completar/refinar arte provisória no fluxo casa → crime → delegacia/mesa → close da nota → PC/mapa → local indicado → área/close do cofre → interfaces de puzzles. Registrar caráter não canônico e preservar o pipeline de cópia existente.
- [ ] Criar poses narrativas adicionais: MJ pensando/analisando, surpresa, irritada, cansada; Lulith brincando, confiante, incomodada, com raiva; James explicando, preocupado, sério. Neutros dos três já estão cadastrados e dez expressões fotográficas não atendem essa lista.
- [ ] Validar silhueta, rosto, gestos e leitura em desktop/mobile, acima/abaixo de 700 px e retrato/paisagem; manter pivô inferior e transparência. Não introduzir lip sync, respiração ou animação interna no sprite estático sem escopo próprio.
- [ ] Confirmar permanência da abertura de Lulith na campanha; avaliar ritmo após aumento dos quadros 01–07, SFX sintetizados versus gravações, volumes/timing do encerramento e Skip em cada quadro no WebView. Trilha definitiva permanece aberta.
- [ ] Confirmar visualmente alinhamento da bolsa com o chão e tamanho/área da chave após os ajustes de 09/10.
- [ ] Fechar design canônico somente no Protótipo 3, incluindo personagens adicionais, cenários 2D/3D/híbridos e papel da influência estética ainda não resolvida.

#### Dívidas de design e qualidade

- [ ] Revisar famílias de tokens (`--espaco-*`, `--raio-*`, `--sombra-*`, `--camada-*`), cores sem token e duplicatas por subsistema, começando por palco/diálogo/celular. Avaliar remoção/justificativa de `--cor-moldura`, `--cor-painel`, `--cor-botao`, `--cor-botao-hover`, `--bolsa-bg`, `--bolsa-panel`, `--bolsa-border-focus`; confirmar uso antes de alterar.
- [ ] Recontar ocorrências antes de refatorar: o documento antigo registrava 166 hexes, 15 raios, duplicação de #7a5c9e, âmbar literal e RGBA da Bolsa; essas contagens e linhas não são medições atuais. Considerar tokens de opacidade ou color-mix conforme compatibilidade.
- [ ] Implementar/validar safe areas, cobrir decoração restante com reduced motion, revisar focos/alvos menores que 44 px, contraste formal, zoom/fontes ampliadas, leitor de tela/anúncios e trava de foco. Não repetir a afirmação antiga de que todo disabled carece de semântica: verificar cada controle.
- [ ] Declarar alvo real de WebView e revisar `:has()`, `dvh`, `cqw`, mistura vh/dvh, cascata/redefinições do app, medidas sobrescritas, raios percentuais, troca de fonte em paisagem e `transition: all`. Não inferir problema atual a partir de números de linha antigos.
- [ ] Conferir cores/fontes/espaços visualmente e automatizar contratos mensuráveis quando útil; contagens históricas de reduced motion não certificam cobertura atual.
- [ ] Formalizar registro de voz por personagem antes do Protótipo 3, inclusive pontuação, tamanho de linha, vocabulário e limites de revelação.
- [ ] Corrigir o teste instrumentado Android de exemplo: `ExampleInstrumentedTest.java` ainda espera `com.getcapacitor.app`, diferente de `com.sanmd.game`. Tratar/validar botão físico Voltar e suspensão/retomada. Build/instalações anteriores não resolvem esses itens.
- [ ] Avaliar CI e medir carregamento frio/quente, requests/bytes, tarefas longas e retenção no mesmo dispositivo antes de alegar ganho arquitetural. As três cenas sob demanda não tornam toda a aplicação lazy.

#### Critérios de conclusão do ato

- [ ] Percorrer campanha canônica completa com conteúdo original, MJ consistente, tutorial claro, caso dedutível, nota com dois caminhos, final de descarte, coordenadas e puzzle do cofre justo/diferente.
- [ ] Confirmar primeiro contato/pistas/reset e apresentação compreensível dos apps previstos, com ao menos um tutorial de terminal e sem restaurar conteúdo apagado indevidamente.
- [ ] Restaurar saves em cada fase, testar fechamento durante diálogos/puzzles/mensagens, deadlines, inventário, evidências e reset; impedir progressão impossível e testar reinício após descarte.
- [ ] Executar QA desktop/mobile/Android com teclado, mouse e toque, menu Ir para com um/dois destinos dentro da viewport, overlays, Save/Load, falha/cancelamento/reentrância, reduced motion, áudio e retomada. Testar pistas/dicas com pessoas que não conhecem as respostas.
- [ ] Registrar feedback da primeira experiência, classificar correções versus atos posteriores e só então declarar Ato I completo. O título cinematográfico atual não certifica a campanha planejada.

<a id="producao-fotografica"></a>
### Produção fotográfica e histórico preservado

Registro da integração de **06/09/2026**, migrado do documento técnico removido. Não é uma nova geração nem validação visual nesta limpeza. Os contratos ativos e tabela completa de IDs/expressões ficam no [README de sprites](assets/sprites/README.md).

A folha `assets/interfaces/save-aleatorio.png` (1536×1024, PNG RGBA, cinco colunas × duas linhas) é fonte de produção, nunca atlas/sprite sheet de runtime. Dez retratos foram separados sem moldura/rótulo; recortes de aproximadamente 261×295 a 262×298. Caixas utilizadas:

```text
01 (47,136,308,434)     02 (343,136,604,434)
03 (638,136,900,434)    04 (935,136,1196,434)
05 (1230,136,1491,434)  06 (47,525,308,820)
07 (343,525,604,820)    08 (638,525,900,820)
09 (935,525,1196,820)   10 (1230,525,1491,820)
```

Tentativas anteriores: quantização removeu partes da personagem; GrabCut com retângulo reteve fundo e com máscara deixou partes incompletas; isnet-anime reteve cenário; u2net_human_seg perdeu rosto/cabelo em 02/08/09 e reteve blocos em outras. Pré-limpeza OpenCV por HSV 164–179, dilatação/inpainting, tentou remover símbolos rosa em 05/06/10. O modelo birefnet-portrait (~973 MB) foi testado só na primeira pose; a saída encontrada na retomada tinha **0 bytes**, não resultado final válido. Nenhum desses candidatos foi promovido a asset final.

Pillow, OpenCV e rembg CPU/CLI, venv/modelos e pranchas eram ferramentas temporárias, sem dependência adicionada ao projeto. Diretórios históricos sob `/tmp/opencode/`: `mj-photo-crops`, `rembg-venv`, `mj-photo-cutouts`, `mj-photo-human-cutouts`, `mj-photo-preclean-human`, `mj-photo-preclean-anime`, `mj-photo-birefnet`, `mj-photo-cleaned`, `mj-photo-final`, `mj-photo-mixed`, `mj-photo-production`. Pranchas `mj-photo-validation.png`, `mj-photo-cleaned-validation.png`, `mj-photo-human-validation.png`, `mj-photo-production-validation.png` eram comparação, não assets aprovados. Sua existência atual não é garantida; não copiar candidatos automaticamente.

O lote final usou uma edição por retrato na ferramenta integrada `image_gen`, seguida de normalização de canvas por Pillow preservando alpha. São derivações geradas com IA, não extrações pixel a pixel. Os dez PNGs RGBA 512×576, centralizados na base, sem cenário/moldura/labels/números/símbolos, têm alpha interior predominantemente 250–254. Mapa de sprites integrado, IDs mantidos, interpolação fotográfica auto e fallback neutro preservado. Save/sorteio/autosave/datas/limite/pose narrativa não mudaram.

Prompts originais de produção (registro histórico, não instrução para executar ferramenta):

```text
Use case: background-extraction. Edit target: attached MJ portrait. Produce one individual PNG character sprite with genuine transparent alpha background. Remove only the alley/background, preserve MJ's exact anime appearance, smiling eyes-closed expression, peace-sign hand, dark hoodie, brown hair, original colors and linework. No scenery pixels, no frame, no labels, no decorative symbols, no checkerboard drawn into image. Portrait canvas, character centered bottom aligned, full existing head and hand visible, preserve original bust framing. This is sprite mj__photo__01 (Sorriso) for a game.
```

Template das expressões 02–10:

```text
Use case: background-extraction. Edit target: attached MJ portrait. Produce ONE individual PNG character sprite with genuine transparent alpha background. Remove only alley/background and any pink decorative graphics (heart, anger icon, surprise rays); preserve MJ's exact anime identity, {expressao} expression, original pose and hands, dark hoodie, brown hair, colors and linework. No scenery pixels, frame, labels, symbols, or drawn checkerboard. Portrait canvas, character centered bottom aligned, preserve entire existing head, hands and bust framing. Sprite mj__photo__{id}.
```

| id | expressao usada |
|---|---|
| 02 | Olhar suave, gentle gaze |
| 03 | Séria, serious |
| 04 | Pensativa, thoughtful hand at chin |
| 05 | Surpresa, surprised open mouth |
| 06 | Irritada, irritated cheek resting in hand |
| 07 | Alegre, joyful laughing eyes closed |
| 08 | Triste, sad downcast gaze |
| 09 | Tímida, shy hands covering mouth |
| 10 | Piscadinha, winking |

QA histórico dessa integração: seis arquivos de teste aprovados, copy:web concluído, dez PNGs decodificados no Chromium/Playwright e composição inspecionada sobre quadriculado/cenário, com captura registrada na Galeria. Pranchas finais em `/tmp/mj-photo-validation-final.png` e `/tmp/mj-photo-gallery-final.png`; Node 22.14.0 temporário em /tmp. Testes de mapa/caminhos/alpha/fallback já foram adicionados, portanto as antigas tarefas de preencher mapa vazio e criar a pasta foram concluídas.

Outros registros históricos úteis: a primeira MJ substituiu silhueta SVG por PNG estático, sem respiração interna; James teve fundo preto externo convertido em alpha em 06/10/2026. A restrição temporária de Skip somente à abertura foi substituída por Skip em todas as cutscenes; o compositor livre de Mensagens foi removido, preservando teclado compartilhado. Relatos antigos de seis/oito arquivos e 83 testes, builds/ADB com MD5 e verificações de Chromium descrevem suas revisões, não o estado atual. O registro mais recente do conjunto de mudanças usa SHA-256 e as limitações de QA descritas em [validação](#validacao).
