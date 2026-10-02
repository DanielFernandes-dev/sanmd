---
aliases:
  - Estado do Projeto
  - Implementação e Validação
tags:
  - sanmd
  - implementação
  - validação
status: atual
updated: 2026-10-02
---

# Estado do projeto

> [!summary] Objetivo
> Consolidar o que está implementado e a evidência disponível, sem confundir
> protótipo funcional com o roteiro completo. Código: `js/`, `index.html` e
> `styles.css`. Plano narrativo: [GDD](../GDD.md). Pendências: [TODO](../TODO.md).

## Fluxo jogável atual

```text
Abrir aplicativo
→ Cutscene 01: preto → SANMD → significado → kk → subida → luz
→ duplo clique/toque libera menu em caderno
  ├─ Novo jogo → abrir caderno → fade → limpar estado → Cutscene 02
  │              → fim natural ou Skip → fade → beco → monólogo inicial → autosave
  └─ Carregar → páginas de registros → restaurar snapshot → gameplay (sem Cutscene 02)
```

A partida nova começa em `beco_entrada`, com inventário vazio, celular original
quebrado e nenhum aparelho ativo. O jogador explora as três cenas do beco,
abre o cofre, coleta o Celular de Lulith e o ativa pela Bolsa. Mensagens,
Arquivos e Galeria ficam acessíveis pelo aparelho. O reset remoto preserva os
saves fotográficos e as pistas históricas previstas no snapshot.

## Entregas implementadas

| Área | Implementação atual | Contrato |
|---|---|---|
| Composição | Fábricas por instância, `services`, dados e CONFIG separados | [Mecânicas](MECHANICS_PATTERN.md) |
| Abertura | Um título que expande as próprias iniciais; luz e som da lâmpada; espera por Skip | [Cutscenes](cutscenes.md) |
| Novo jogo | Reset anterior à apresentação; dez quadros de Lulith sem falas | [Cutscenes](cutscenes.md) |
| Menu | Caderno com abertura, páginas, paginação, saves reais e autosave | [Arquitetura](../ESTRUTURA_GAMING.md#tela-inicial) |
| Navegação | Entrada, interior e fundo do beco; fade global e bloqueio de input | [Transições](SCENE_TRANSITIONS.md) |
| Investigação | Hotspots, objetos por estado, abertura do cofre, coleta e Bolsa | [Point-and-click](POINT_AND_CLICK.md) |
| Narrativa | Diálogos, monólogos condicionais, primeiro contato anônimo, enigma e reset | [Arquitetura](../ESTRUTURA_GAMING.md) |
| Celular | Temas, Mensagens, Arquivos, Galeria e relógio | [Temas](PHONE_THEMES.md) |
| Persistência | Snapshot v1 em localStorage, nove saves manuais e um autosave separado | [Save System](SAVE_SYSTEM.md) |
| Fotografias | Dez expressões da MJ, composição, preview, captura, load e exclusão | [Sprites](../assets/sprites/README.md) |
| Entrada de texto | Teclado virtual e físico, acentos e buffer transitório; sem IME | [Texto](TEXT_INPUT.md) |
| Distribuição | Fonte web estática, cópia para `www/`, Capacitor e APK debug Android | [README](../README.md#gerar-o-apk-android) |

## Cutscene 02 e revisões de ritmo

- Dez artes existentes preservadas; IDs lógicos independentes dos nomes físicos.
- Mesmo controlador, detector de Skip e carregador de imagens da infraestrutura.
- Palco fixo, imagem ativa e auxiliar para suavização; nenhum vídeo ou GIF.
- Câmera discreta, seis SFX sintetizados, flash de erro e shake curto.
- Pedido de suavização: transição de 100 ms nos quadros calmos; erros e chute continuam com corte seco.
- Pedido posterior de leitura: quadros 01–07 alongados em cerca de 25%; 08–10 mantidos.
- Timers, câmera, áudio e efeitos não entram no save. Fim natural e Skip convergem.
- Reduced motion mantém todos os quadros e desliga câmera, shake e suavização interna.

A tabela completa dos tempos está em [Cutscenes](cutscenes.md#timeline-atual).
A apresentação não ativa o celular, não personaliza seu tema e não implementa
uma cutscene de saída do beco.

## Validação e limites da evidência

| Rodada | Evidência registrada |
|---|---|
| Android, 26/09/2026 | APK instalado via ADB; sequência de dez quadros com cache desabilitado, sem imagens vazias ou mudança de dimensão do palco |
| Android, mesma rodada | Skip nos dez quadros pelo detector global, nenhum áudio/animação/shake residual; Carregar sem Cutscene 02 |
| Android, verificação complementar | Duplo toque nativo no quadro 01 sem zoom; reduced motion com dez quadros e zero animações de transform |
| Ajuste final dos quadros 01–07 | 48 casos de cutscene aprovados; APK recompilado e instalado. A execução Android completa anterior não é apresentada como nova avaliação subjetiva desse ritmo |
| Revisão documental, 02/10/2026 | Suíte Node atual aprovada: 17 entradas de arquivo, incluindo o helper `test/load-game.cjs`; esse número não é contagem de casos individuais |

Os saves existentes e o tempo de suspensão da tela foram restaurados após os
testes Android. SFX foram verificados por estado dos elementos de áudio; isso
não substitui avaliação auditiva. Nenhum teste Android novo foi executado nesta
revisão exclusivamente documental.

## Refatoração das cutscenes — 02/10/2026

Controlador com sessão isolada por execução e finalização comum, seletor de
renderizador em módulo próprio, câmera/transições separadas no renderer e pool
de áudio com descarte de preload e encerramento idempotentes. APIs, tempos,
artes e comportamento de Novo jogo/Carregar foram preservados. A suíte Node
passou com regressões adicionais para falhas e cancelamento. APK debug recompilado, instalado e revalidado em 02/10/2026 no Samsung SM-A055M:
abertura/hold, Lulith natural, Skip nativo e Carregar aprovados, com saves
originais restaurados. Detalhes em [Cutscenes](cutscenes.md).

## Ainda pendente

- Nome escolhido pelo jogador, James, dormitório e caso introdutório.
- Nota, coordenadas, puzzle canônico do cofre e ligação entre as cenas do Ato I.
- Saída do beco/personalização futura do telefone.
- Evidências, terminal, mapa, sistema geral de puzzles, atos completos e finais.
- Replay narrativo persistente, progresso de 100% e ARG.
- Arte/trilha definitivas, avaliação auditiva dos SFX e revisão subjetiva do último ritmo.
- Dívidas de acessibilidade e tokens visuais descritas em [Regras de design](../REGRAS_DE_DESIGN.md).

## Manutenção

`README.md` é a porta de entrada; `ESTRUTURA_GAMING.md` descreve arquitetura;
`docs/` mantém os contratos por sistema; os README de assets descrevem os
arquivos reais. O [ADR](ADR_LOG.md) conserva decisões históricas, inclusive as
substituídas. Tempos devem mudar primeiro em CONFIG; esta documentação registra
o comportamento resultante, sem criar outra fonte de configuração.
