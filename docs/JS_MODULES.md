# JavaScript Modules Reference

> Revisão documental — 08/10/2026: LEGADO: o inventário atual dos 34 scripts está em [AGENTS](../AGENTS.md#modulos). As 30 entradas e responsabilidades abaixo antecedem scene-modules e a extração de eventos locais; APIs devem ser conferidas no código. Candidato a arquivamento após preservar detalhes úteis.

This document provides a reference for each of the 30 modules in `js/`. See
[ARCHITECTURE.md](ARCHITECTURE.md) for the overall architecture.

## bootstrap.js

Entry point loaded by `index.html` via `<script>`. Creates a single global
`game` instance and the title menu. Never imported by tests.

```js
const game = criarJogo({ document, storage: obterStorageDisponivel() });
const titleMenu = criarTelaInicial({ game, document, window });
game.services.iniciarCutscene('intro_abertura');
```

## config.js

Frozen configuration object with all timing values, limits, and constants.

| Key group             | Constants                                  | Used by                    |
|-----------------------|--------------------------------------------|----------------------------|
| `cutscene`            | `act1Ending`, `lulithCodigo`, defaults     | All cutscene systems       |
| `sceneTransition`     | `out: 320, hold: 100, in: 400`             | `scene-transition.js`      |
| Dialogue/gameplay     | `velocidadeDigitacao: 65`                  | `dialogue.js`              |
| Phone                 | `transicaoCelular: 280`, `esperaAntesReset`| `phone.js`                 |
| Gallery               | `duracaoFlashFoto: 140`, `tamanhoNomeFoto: 28` | `gallery.js`           |
| Bag                   | `itensPorPaginaBolsa: 9`, `limiteBotoesPaginacao: 7` | `bag.js`    |
| Global                | `MAX_MANUAL_SAVES: 9`                      | `save-system.js`, `gallery.js`|
| Constants             | `SAVE_VERSION: 1`, `DIAS`, `MESES`, `RESET_STATUS` | Multiple modules |

## data.js

Narrative catalog. Contains:

- `DATA.locais` — location definitions with scenes
- `DATA.personagens` — character sprites
- `DATA.celular` — phone files (pre-reset)
- `DATA.mensagens` — branching SMS conversation
- `DATA.monologos` — monologue phases per scene
- `DATA.conversas` — face-to-face conversations
- `DATA.worldMapLocations` — map locations
- `DATA.prototypeAlleyCoordinates` — note coordinates
- `CUTSCENES` — cutscene sequence definitions
- `ITEMS` — inventory item definitions
- `LULITH_FRAMES`, `ACT1_FRAMES` — frame mappings

## state.js

Factory functions for all state segments. All use `criar*` prefix.

| Factory              | Returns           | State segment managed              |
|----------------------|-------------------|------------------------------------|
| `criarEstadoBolsa`   | `{pagina, pesquisa, itemSelecionadoId, itemEmUsoId}` | Bag UI selection      |
| `criarEstadoDialogo` | `{linha, digitando, timer, falas, faseMonologo, ...}` | Dialogue/typing     |
| `criarEstadoCelular` | `{tela, relogio, transicao, resetTimer, ...}` | Phone screen/timers       |
| `criarEstadoArquivos`| `{vistos, vistosAntesReset, enigmaIdentidadeResolvido, ...}` | File tracking |
| `criarEstadoMensagens` | `{etapa, historico, fila, cooldownAte, ...}` | SMS conversation       |
| `criarEstadoGaleria` | `{saves, visualizacao, capturaPendente, ...}` | Photo gallery           |
| `criarEstadoTexto`   | `{aberto, layout, shift, buffer, cursor, ...}` | Text input              |
| `criarEstadoMapaGlobal` | `{availableLocations: {...}}`         | World map availability    |
| `criarEstadoJogo`    | Full game state object | All of the above combined       |

## dom.js

`criarElementos(document)` — resolves and validates all DOM references from
`index.html`, grouped by component:

- `el.scene` — background, object layer, hotspot layer, character, status, navigation
- `el.bag` — dialog, search, grid, pagination, details
- `el.dialogue` — box, name plate, text, continue arrow, button
- `el.phone` — overlay, home, messages, files, gallery, reset screens
- `el.gallery` — grid, toolbar, status, flash, detail, preview
- `el.workstation` — computer overlay, map, close button
- `el.worldMap` — note overlay, map overlay, coordinate inputs

Throws if any required element is missing.

## game.js

`criarJogo(options)` — the central factory that composes all subsystems.

**Parameters (injected):**
- `document` — DOM document
- `storage` — `localStorage` instance or `null` for in-memory
- `data` — narrative catalog (default: `DATA`)
- `items` — inventory definitions (default: `ITEMS`)
- `config` — timing config (default: `CONFIG`)
- `window` — globals with `Audio`, `Image`, `matchMedia`, etc.

**Returns:** `{ state, el, services, systems, saveRepository, eventosInteracao, iniciar }`

`services` is a frozen merge of all subsystem return values, giving every
subsystem access to every other through late binding.

## animation.js

`criarSistemaAnimacoes({ window, document, config })` — animation facade.

| Method              | Description                        |
|---------------------|------------------------------------|
| `movimentoReduzido()` | Returns `true` if `prefers-reduced-motion: reduce` matches |
| `duracaoVisual(duration, reduced=0)` | Returns reduced duration if needed |
| `esperarAnimacao(duration)` | Promise that resolves after timeout |
| `animarFade(element, from, to, duration)` | Fade animation with Web Animations API fallback |
| `configurarAnimacoes()` | Sets CSS `--duracao-*` variables from CONFIG |

## scene-transition.js

`criarSceneTransitionController({ el, services, document, window, config })`

| Method              | Description                        |
|---------------------|------------------------------------|
| `runSceneTransition(loadScene)` | Full fade-out/load/fade-in sequence |
| `prepareSceneImages(sources)` | Cache + preload images |
| `isSceneTransitioning()` | Boolean guard |

Input is blocked via capture-phase listeners during transition. Image cache is
per-controller instance.

## scene.js

`criarSistemaCenas(context)` — scene rendering and navigation.

Key functions:
- `aplicarCena(cena)` — swap background, objects, hotspots
- `executarHotspot(id)` — interaction pipeline (validate → strategy → mutate → save)
- `irPara(destinoId)` — navigate to connected scene
- `irParaLocal(localId)` — travel to a world location
- `obterDestinos()` — compute available exits based on state
- `podeSairDoBeco()` / `sairDoBeco()` — Act I completion trigger

## dialogue.js

`criarSistemaDialogos(context)` — dialogue and monologue system.

| Method              | Description                        |
|---------------------|------------------------------------|
| `iniciarFalas(falas)` | Start linear dialogue sequence     |
| `iniciarConversa()`   | Start face-to-face or monologue    |
| `avancarDialogo()`    | Advance line, skip typing, or end  |
| `encerrarConversa()`  | Cleanup, apply conversation flags   |
| `selecionarFaseMonologo()` | Resolve monologue phase from state |
| `digitarTexto(texto)` | Animated text typing with blips    |

`mostrarLinha()` selects one sprite per line using the character's registered
`nome` and the line's `autor`. An optional `personagemId` explicitly selects the
sprite for narration, including sequences that begin without a speaker. Lines
without an author keep the current sprite; named speakers without a registered
sprite hide the previous character. The name plate is visible for named speakers,
including MJ's monologues. Consecutive lines with the same sprite, pose and slot
do not restart its entrance animation.

`scene.restaurarPersonagemCena()` restores a visual character listed in
`personagensPresentes` when dialogue ends, scenes change or saves load; otherwise
the dialogue sprite exits. Phone messages keep their existing anonymous interface.

## phone.js

`criarSistemaCelular(context)` — phone apps and messaging.

Key systems:
- **Mensagens** — branching SMS conversation with typing indicators and cooldowns
- **Arquivos** — encrypted file viewer with identity puzzle
- **Galeria** — photo management (delegates to `criarSistemaGaleria`)
- **Reset remoto** — phone wipe with 1-minute countdown, preserving seen data

| Method                  | Description                       |
|-------------------------|-----------------------------------|
| `abrirCelular()`        | Open phone overlay                |
| `escolherResposta(id)`  | Select SMS reply option           |
| `resolverEnigmaIdentidade(resposta)` | Solve identity puzzle ("ela") |
| `iniciarResetRemoto()`  | Start remote wipe                 |
| `concluirResetRemoto()` | Finish wipe, clear sensitive data |

## bag.js

`criarSistemaBolsa(context)` — inventory system.

| Method                  | Description                       |
|-------------------------|-----------------------------------|
| `adicionarItem(id)`     | Add item to inventory             |
| `removerItem(id)`       | Remove item from inventory        |
| `renderizarBolsa()`     | Full re-render: search, grid, pages, details |
| `executarAcaoInventario(itemId)` | Trigger item-specific action (use_on_hotspot, activate_phone) |
| `concluirAcaoInventario()` | Validate + conclude pending action |

Uses `criarRegistroMecanicas` for inventory action handlers, same pattern as hotspot strategies.

## gallery.js

`criarSistemaGaleria(context)` — photo save/load system.

| Method                  | Description                       |
|-------------------------|-----------------------------------|
| `tirarFoto()`           | Capture current scene state + random expression |
| `confirmarFoto(nome)`   | Save to `saveRepository.criarManual` |
| `carregarFotoSelecionada()` | Restore snapshot from photo save |
| `excluirFotoSelecionada()` | Delete manual save               |
| `selecionarFoto(saveId)` | Show photo detail view            |
| `mostrarGradeGaleria()` | Return to grid view              |

Max 9 manual saves (see `MAX_MANUAL_SAVES`). Photos store a full game snapshot.

## text-entry.js

`criarSistemaEntradaTexto(context)` — shared text input controller.

| Method                  | Description                       |
|-------------------------|-----------------------------------|
| `abrirEntradaTexto(config)` | Open editor with config callbacks |
| `confirmarEntradaTexto()` | Validate + close + callback       |
| `cancelarEntradaTexto()` | Close + cancel callback           |
| `pressionarTecla(codigo)` | Handle virtual keyboard key       |
| `tratarTecladoFisico(event)` | Redirect physical keyboard input |

Config object: `{ confirmLabel, maxLength, allowEmpty, initialValue, layout, aoConfirmar, aoCancelar, aoAlterar }`

## keyboard.js

`criarSistemaTeclado(context)` — virtual keyboard renderer.

Renders three layouts: QWERTY, Números, Coordenadas. Supports shift, backspace,
space, OK, accent panel toggle. Consumed by `text-entry.js`.

## mechanics.js

Strategy pattern for hotspot interactions.

```js
criarMecanicasHotspot({ services })
```

Registers handlers for: `examine`, `interact`, `collect`, `use_item`, `trigger`.

The `collect` strategy delegates to `services.adicionarItem(itemId)` and can
return `false` to cancel. All other types return `true` (no-op; mutations
handled declaratively via `changes`, `requiresItem`, etc.).

Uses `criarRegistroMecanicas(estrategias)` — a frozen strategy registry with
`obter(type)` lookup.

## events.js

`criarSistemaEventos(context)` — DOM event wiring, attached once during
`inicializarEventos()`.

- Registers narrative interaction callbacks in `context.eventosInteracao`
  (house exit, bag/phone collection, crime evidence, note reading, computer use)
- Binds all UI button click handlers
- Attaches global `keydown` listener for Escape/space/Enter navigation

## persistence.js

`criarSistemaPersistencia(context)` — save validation and restoration.

| Method              | Description                        |
|---------------------|------------------------------------|
| `capturarEstadoJogo()` | Build serializable snapshot      |
| `validarSnapshot(candidato)` | Validate structure, location, dialogue, files, messages, phone, inventory |
| `restaurarEstadoJogo(candidato)` | Validate + restore + cleanup timers + UI |
| `registrarAutosave()` | Capture + save to repository      |
| `cancelarTemporizadores()` | Clear all pending timers       |

Validation covers: `saveVersion`, location/scene existence, dialogue phase
existence, file ID validity, message phase validity, phone status consistency,
inventory item IDs, scene state key/value types.

## save-system.js

`criarSaveRepository(storage)` — low-level storage abstraction.

| Method              | Description                        |
|---------------------|------------------------------------|
| `listarManuais()`   | List manual saves (max 9)          |
| `obterAutosave()`   | Get autosave snapshot              |
| `criarManual(save)` | Add manual save (throws if full)   |
| `excluirManual(id)` | Delete manual save (returns bool)  |
| `salvarAutosave(save)` | Overwrite single autosave slot   |

Storage: `localStorage` under key `sanmd:saves`, or in-memory when `storage` is null.

## title-menu.js

`criarTelaInicial({ game, document, window })` — notebook-style title screen.

States: `menu` → `opening` → `load` → `startingGame`

| Method              | Description                        |
|---------------------|------------------------------------|
| `iniciar({ bloqueado })` | Attach listeners, show menu   |
| `newGame()`         | Start new game with reset          |
| `load(saveId)`      | Load from snapshot                 |
| `openLoad()`        | Animate book open + show saves     |
| `close()`           | Animate book close                 |
| `retornarAoMenu()`  | Return to menu from gameplay       |

## cutscene.js

`criarCutsceneController({ document, window, config, services, sequences, visual })`

Single-session cutscene controller.

| Method              | Description                        |
|---------------------|------------------------------------|
| `iniciarCutscene(id, onComplete)` | Start sequence (returns false if already running) |
| `pularCutscene()`   | Skip: cancels timer, finalizes session |
| `isCutsceneActive()` | Boolean                              |
| `getCurrent()`      | Return current cutscene ID or null |
| `isSkipping()`      | Return whether skip was requested  |

Input handler captures all events in capture phase. Double primary input within
`CONFIG.cutscene.skipDoubleInputWindow` (600ms) triggers double-tap skip during every active cutscene.

## cutscene-renderers.js

`criarVisualCutscenes(context)` — renderer dispatch facade.

Routes to `criarVisualAbertura` (title-based sequences) or
`criarVisualQuadros` (frame-based sequences) based on `sequence.frames` presence.

## cutscene-view.js

`criarVisualAbertura({ document, window, config, services })` — opening title renderer.

Handles: word expansion animation, laugh reveal, lamp audio, reduced motion.
The `hold: true` step suspends auto-advance until `pularCutscene()`.

## cutscene-frames.js

`criarVisualQuadros({ document, window, config, services })` — frame-based renderer.

| Step type  | Handler                |
|------------|------------------------|
| (default)  | `frame` — display image, camera, SFX, effects |
| `fade-black` | Fade to black, stop music |
| `black`    | Black screen            |
| `title`    | Title card (reveal/hold/exit) |

Delegates audio to `criarAudioCutscene`.

## cutscene-audio.js

`criarAudioCutscene({ window, services }, timing, sounds, ambienceId)`

Audio pool for cutscenes. Preloads SFX, manages ambience loop, handles fade-out.

| Method              | Description                        |
|---------------------|------------------------------------|
| `preparar()`        | Preload all sounds (returns Promise) |
| `apresentar(id, weight, fadeTo, duration)` | Play SFX with optional fade |
| `encerrar()`        | Fade out ambience + dispose (idempotent) |
| `finalizar()`       | Immediate stop + dispose all       |

## monologues.js

Pure utility functions for monologue resolution (no dependencies).

| Function              | Description                        |
|-----------------------|------------------------------------|
| `foiCelularColetado(sceneState, inventory)` | Check if phone was collected |
| `resolverFalasMonologo(monologos, fase, contexto)` | Resolve monologue lines by phase/persistence state |

## world-map.js

`criarSistemaMapaGlobal({ state, el, document, data, services })` — world map UI.

| Method              | Description                        |
|---------------------|------------------------------------|
| `abrirMapaGlobal({ source, returnHotspotId })` | Open map overlay      |
| `fecharMapaGlobal({ restoreFocus })` | Close map overlay           |
| `abrirBilhete({ returnHotspotId })` | Open note overlay          |
| `fecharBilhete({ restoreFocus })` | Close note overlay           |
| `viajarPeloMapa(localId)` | Trigger world travel         |
| `localizarCoordenadas()` | Search coordinates to unlock Beco |
| `bloquearMapaGlobal()` | Disable inputs during travel       |
| `inicializarMapaGlobal()` | Attach listeners (once)        |

## world-travel.js

`criarSistemaViagemGlobal({ state, el, services })` — travel coordination.

| Method              | Description                        |
|---------------------|------------------------------------|
| `travelToWorldLocation(localId)` | Validate → block map → close interfaces → travel → save |
| `isWorldTraveling()` | Boolean                              |

## workstation.js

`criarSistemaEstacaoTrabalho({ state, el, document, services })` — computer UI.

| Method              | Description                        |
|---------------------|------------------------------------|
| `abrirEstacaoTrabalho()` | Open computer overlay (scene-gated) |
| `fecharEstacaoTrabalho({ restoreFocus })` | Close computer overlay |
| `estacaoAberta()`   | Boolean                              |
| `inicializarEstacaoTrabalho()` | Attach listeners (once)    |

## interface.js

`criarSistemaInterface(context)` — button enable/disable management.

| Method              | Description                        |
|---------------------|------------------------------------|
| `definirBotoes()`   | Enable/disable dialogue, navigation, phone, bag buttons based on mode |

## Event flow summary

```
User input → events.js listener → services.* → state mutation → registrarAutosave()
                                          → service.renderizar*() → DOM update

Navigation:
  Hotspot click → scene.executarHotspot() → mechanics strategy → state change
  → scene-render → autosave

Phone:
  Button click → events.js → phone.abrirMensagens()/abrirArquivos()/abrirGaleria()
  → phone.renderizarMensagens() → text-entry/persistence calls

Cutscene:
  bootstrap.js → cutscene.iniciar('intro_abertura', onComplete)
  → cutscene-avancar loop → visual.apresentar(step) → visual.finalizar()
  → onComplete callback
```
