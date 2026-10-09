# Game Architecture

> Revisão documental — 08/10/2026: LEGADO: visão arquitetural substituída por [AGENTS](../AGENTS.md#parte-ii). Este texto conserva decisões históricas, mas lista módulos/fluxos antigos (inclusive el.js inexistente, rsync e Skip de 350 ms). Não usar como descrição da implementação atual. Candidato a arquivamento, sem remoção autorizada.

## Overview

SANMD is a vanilla ES2024 JavaScript visual novel built with **no framework, no bundler, no transpiler**. The entire runtime is a single page (`index.html`) backed by 30 JS modules, a stylesheet (`styles.css`), and static assets.

## Entry point

```
bootstrap.js
  └── criarJogo({ document, storage, data, items, config, window })
        └── criaEstadoJogo()  → state.js
        └── criaElementos()   → dom.js
        └── criaSaveRepository() → save-system.js
        └── cria todos os sistemas → Object.freeze(services)
  └── criaTelaInicial({ game, document, window })
        └── title-menu.js
  └── game.services.iniciarCutscene('intro_abertura')
```

The only global is `game`, created in `bootstrap.js`. Tests create their own instances via `load-game.cjs`.

## Composition pattern

### Factory + Dependency Injection

`criarJogo()` creates a `context` object and passes it to each subsystem factory:

```js
const context = { state, el, services, document, window, data, items, config,
  saveRepository, eventosInteracao: Object.create(null) };
```

Each factory destructures what it needs from `context`. The `services` object is
populated by merging all subsystem return values after construction, then frozen.
This allows late binding: subsystems reference `services.*` inside callbacks
(registered during `inicializarEventos`) but **not** during construction.

### Subsystem registry

| Subsystem factory          | Source file          | Responsibility                          |
|---------------------------|----------------------|-----------------------------------------|
| `criarSistemaAnimacoes`   | `animation.js`       | Fade, durations, reduced-motion         |
| `criarSistemaPersistencia`| `persistence.js`     | Snapshot, validation, restore           |
| `criarSceneTransitionController` | `scene-transition.js` | Cross-fade, input block, image cache |
| `criarSistemaCenas`       | `scene.js`           | Scene rendering, hotspots, navigation   |
| `criarSistemaEstacaoTrabalho` | `workstation.js` | Computer interface opening/closing    |
| `criarSistemaViagemGlobal`| `world-travel.js`    | World map travel coordination           |
| `criarSistemaMapaGlobal`  | `world-map.js`       | Map UI, coordinates, note overlay       |
| `criarSistemaDialogos`    | `dialogue.js`        | Dialogue, monologue, typing             |
| `criarSistemaCelular`     | `phone.js`           | Phone apps, messages, reset             |
| `criarSistemaGaleria`     | `gallery.js`         | Photo save/load, preview, flash         |
| `criarSistemaBolsa`       | `bag.js`             | Inventory, search, pagination           |
| `criarSistemaTeclado`     | `keyboard.js`        | Virtual keyboard rendering              |
| `criarSistemaEntradaTexto`| `text-entry.js`      | Text buffer, cursor, layout             |
| `criarSistemaInterface`   | `interface.js`       | Button enable/disable                   |
| `criarSistemaEventos`     | `events.js`          | DOM event wiring (called once)          |
| `criarCutsceneController` | `cutscene.js`        | Cutscene session, skip, input capture   |
| `criarVisualCutscenes`    | `cutscene-renderers.js` | Renderer dispatch (title vs frames) |
| `criarVisualAbertura`     | `cutscene-view.js`   | Opening title animation                 |
| `criarVisualQuadros`      | `cutscene-frames.js` | Frame rendering, cameras, SFX         |
| `criarAudioCutscene`      | `cutscene-audio.js`  | Audio preload/fade/dispose              |
| `criarTelaInicial`        | `title-menu.js`      | Notebook menu, save slots               |
| `criarSaveRepository`     | `save-system.js`     | Manual saves + autosave storage         |
| `criarElementos`          | `dom.js`             | DOM references grouped by component     |
| `criarEstadoJogo`         | `state.js`           | All game, scene, and UI state           |

## Data flow

```
data.js (catálogo)      config.js (tempos)      save-system.js (repositório)
      │                      │                         │
      └────────── context ───┼─────────────────────────┘
                             │
     state.js ←─ criaJogo ── el.js (DOM refs)
          │                    │
    ┌─────▼────────────────────┴──────┐
    │         Subsystems (frozen)      │
    └──────────────────────────────────┘
              services.*
```

- `data.js` — narrative catalog (locations, scenes, characters, items, cutscenes, dialogue)
- `config.js` — all timing values (frozen object)
- `state.js` — mutable game state, created once per instance
- `save-system.js` — persistent storage layer (localStorage or in-memory)

## State management

### Persistent state (saved to localStorage)

| Segment       | Captured in          | Key fields                           |
|---------------|----------------------|--------------------------------------|
| `act1Complete`| `persistence.js`     | Boolean flag for Act I completion    |
| `aparelho`    | `persistence.js`     | Phone status, active phone, theme    |
| `inventory`   | `persistence.js`     | Array of item IDs                    |
| `sceneState`  | `persistence.js`     | Per-scene flags                      |
| `worldMap`    | `persistence.js`     | Available locations                  |
| `localizacao` | `persistence.js`     | Current location + scene             |
| `dialogo.*`   | `persistence.js`     | Monologue phase, route               |
| `celular.*`   | `persistence.js`     | Reset status, reset deadline         |
| `arquivos.*`  | `persistence.js`     | Seen files, identity puzzle          |
| `mensagens.*` | `persistence.js`     | Message queue, step, history         |

### Transient state (not persisted)

| Key         | Managed by         | Reason                              |
|-------------|--------------------|-------------------------------------|
| `bolsa.*`   | `bag.js`           | UI selection/search state            |
| `texto.*`   | `text-entry.js`    | Text input buffer/cursor            |
| `galeria.*` | `gallery.js`       | Photo selection/preview             |
| Timer handles | Various           | Restored during `cancelarTemporizadores()` |

## Cutscene system

### Architecture

```
criarCutsceneController (cutscene.js)
  └── One session per execution
  └── Input capture (capture phase, all events)
  └── Skip: double primary input within 350ms
  └── Steps: declarative, driven by CONFIG timing
      └── criarVisualCutscenes (cutscene-renderers.js)
          ├── criarVisualAbertura (cutscene-view.js)  — title/light
          └── criarVisualQuadros (cutscene-frames.js) — frame-based
              └── criarAudioCutscene (cutscene-audio.js) — SFX pool
```

### Cutscene definitions

| ID                | Trigger              | Renderer   | Frames | Timing key     |
|-------------------|----------------------|------------|--------|----------------|
| `intro_abertura`  | App load             | Title      | —      | (default)      |
| `lulith_codigo`   | New Game             | Frames     | 10     | `lulithCodigo` |
| `act1_ending`     | Exit alley            | Frames     | 8+1    | `act1Ending`   |
| `act1_title`      | After act1_ending      | Title      | —      | `act1Ending`   |

## Testing strategy

- **Framework**: Node.js built-in `node --test`
- **Harness**: `test/load-game.cjs` sets up DOM mocks and loads all JS modules
- **Isolation**: Each test file tests one subsystem or feature area
- **Mocking**: Minimal DOM (`index.html` content), `window`, `Audio`, `Image`, `matchMedia`

```
test/
├── load-game.cjs          # Harness: DOM + globals setup
├── animation.test.js
├── bolsa.test.js          # Inventory + activate_phone
├── cutscene.test.js
├── cutscene-frames.test.js
├── fase-navegacao.test.js  # Navigation between scenes
├── fase8.test.js          # Messaging/reset/monologue flow
├── fase10-mj.test.js       # MJ sprite presence
├── gallery-layout.test.js  # Photo gallery layout
├── interface-icons.test.js # Button/icon contract
├── monologues.test.js     # Monologue resolution
├── photo-assets.test.js   # Photo asset paths
├── save-system.test.js    # Persistence validation
├── scene-transition.test.js # Fade/lock/concurrency
├── tela-inicial.test.js   # Title menu against index.html
├── text-input.test.js     # Keyboard + text entry
└── title-menu.test.js      # Menu state/animation
```

## Android / Capacitor

```
npm run apk
  └── copy:web (rsync index.html, styles.css, js/, assets/ → www/)
  └── npx cap sync android
  └── cd android && ./gradlew assembleDebug
```

- `android/` is generated — do not edit manually
- `MainActivity.java` configures audio autoplay permissions
- `capacitor.config.json` maps `www` as the web asset directory

## Related documentation

- [Padrão das mecânicas](MECHANICS_PATTERN.md) — interaction/strategy contracts
- [Save System](SAVE_SYSTEM.md) — persistence contract
- [Scene Transitions](SCENE_TRANSITIONS.md) — cross-fade and navigation
- [Text Input](TEXT_INPUT.md) — virtual keyboard & text entry
- [Phone Themes](PHONE_THEMES.md) — phone UI theming
- [Point & Click](POINT_AND_CLICK.md) — hotspots and inventory guide
- [Cutscenes](cutscenes.md) — sequence definitions and timing
