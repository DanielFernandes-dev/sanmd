# Registro de decisões

## 2026-09-06 — Ícone do jogo no launcher Android

Status: aceito.

Decisão: usar a arte oficial do jogo em `assets/interfaces/game-icon.png` como
ícone normal e redondo do launcher, nas densidades legadas e no adaptive icon do
Android. O fundo do adaptive icon acompanha a paleta escura da arte.

Consequências: o ícone exibido na tela inicial do Android fica consistente com o
ícone do jogo, sem alterar o sistema de Save/Load ou a identidade visual interna.

Validação: APK debug recompilado com sucesso e instalado no dispositivo Android
conectado via ADB.

## 2026-09-06 — Fundos atuais e visuais após a cutscene

Status: aceito.

Decisão: alinhar a Galeria à paleta de Mensagens e Arquivos apenas no tema
`lulith`. Preservar no tema `mj` a aparência anterior da tela inicial e de cada
app, destinada ao momento posterior à cutscene. A Galeria mantém integralmente
o sistema de Save/Load. A troca narrativa de tema não é antecipada neste ajuste.

Referência: [Visuais do celular](PHONE_THEMES.md).

Validação antes do commit: 61 testes passaram com `node --test`, incluindo
ativação pela Bolsa e regressões de Save/Load. `git diff --check` sem erros.

## 2026-09-06 — Objetos interativos e Bolsa da MJ

Status: aceito.

Contexto: a investigação no beco precisa permitir abrir o cofre, coletar o celular e preservar o progresso ao salvar e carregar.

Decisão: manter o fundo da cena separado dos sprites e hotspots dos objetos. Representar o inventário por IDs e as mudanças dos objetos por flags de cena. A Bolsa usa pesquisa e páginas de nove itens, com detalhes do item selecionado. Os snapshots v1 aceitam `inventory` e `sceneState`; saves antigos recebem valores iniciais.

Consequências: objetos, áreas interativas e fundo compartilham as coordenadas da cena. A coleta e a abertura do cofre podem ser restauradas sem trocar o fundo. As definições dos itens permanecem fora dos saves.

Referências: [Point-and-click e Bolsa](POINT_AND_CLICK.md), [Save/Load](SAVE_SYSTEM.md).

## 2026-09-06 — Aparência e posição do botão Voltar

Status: aceito.

Contexto: a moldura arredondada do botão incomodava visualmente, e sua posição deve distinguir a tela inicial dos aplicativos.

Decisão: remover borda, arredondamento, fundo e sombra do botão. Na tela inicial do celular, posicioná-lo no canto inferior esquerdo e reservar espaço abaixo dos apps. Nas telas dos aplicativos, manter o canto superior esquerdo. A posição acompanha a visibilidade de `phone-home` por CSS.

Consequências: a seta rosa e a navegação contextual existente são preservadas; o botão não ocupa o espaço da grade de apps.

Validação do conjunto: 56 testes passaram usando Node.js v26.7.0 (`node --test`); `git diff --check` sem erros. O teste existente de aparência foi atualizado para o botão sem moldura. Essa execução não inclui inspeção visual em navegador.

## 2026-09-06 — Da Bolsa ao aparelho ativo

Status: aceito.

Contexto: coletar o celular não deve desbloquear automaticamente sua função. MJ
está com o aparelho original quebrado e precisa decidir usar o aparelho encontrado.

Decisão: separar `aparelho.activePhone` do inventário e de `phoneTheme`, mantendo
`originalPhoneStatus: "broken"`. A coleta existente permanece intermediária. Uma
`inventoryAction` declarada pelo item aciona um handler após uma reação curta;
a conclusão remove o item, ativa Lulith e usa o autosave do diálogo. O botão
CELULAR reflete exclusivamente a presença de aparelho ativo e o layout se compacta
quando está oculto. O tema inicial Lulith não exibe a personalização MJ.

Consequências: a Bolsa passa a suportar ações diretas opcionais sem misturá-las aos
hotspots. Dados do celular e Galeria são preservados. Load cancela ações pendentes;
a migração de saves anteriores preserva progresso já realizado no celular, conforme
[contrato de persistência](SAVE_SYSTEM.md). Nenhuma nova função de aparelho ou
personalização foi adicionada.

Validação: testes automatizados cobrem A/B/C entre sessões, duplo clique, autosave,
preservação de conteúdo, migração, cancelamento por load e atualização da Bolsa.
O fluxo também foi exercitado em Chromium com mouse e toque em 1440×900, 390×844
e 844×390.
