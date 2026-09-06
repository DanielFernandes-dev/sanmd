# Registro de decisões

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
