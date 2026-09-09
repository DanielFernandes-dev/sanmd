# REFATORAÇÃO — SanMD

> Documento de gaps técnicos identificados no código-fonte e plano de ação para refatoração.
>
> Arquivos analisados: `js/game.js` (1854 linhas), `js/data.js` (392 linhas), `js/save-system.js` (71 linhas).

---

## Gaps identificados

### 1. Monólogos com lógica de negócio misturada

**Arquivo:** `js/data.js:46-102`
**Problema:** As funções `monologoBecoEntrada`, `monologoBecoInterior` e `monologoBecoFundo` verificam o estado global `state` diretamente dentro de um arquivo de dados.

```js
// Trecho problemático
function monologoBecoEntrada() {
  const phoneCollected = typeof state !== "undefined"
    && (state.inventory?.includes("lulith_phone") || Boolean(state.sceneState?.beco_fundo?.lulithPhoneCollected));
  // ...
}
```

**Solução:** Extrair a verificação para uma função utilitária em `game.js` ou mover a lógica para um módulo separado.

---

### 2. Código duplicado — verificação de coleta

**Arquivo:** `js/data.js:47-48, 63-64, 79-82`
**Problema:** A expressão `phoneCollected` é copiada idêntica em três funções:

```js
const phoneCollected = typeof state !== "undefined"
  && (state.inventory?.includes("lulith_phone") || Boolean(state.sceneState?.beco_fundo?.lulithPhoneCollected));
```

**Solução:** Criar helper `foiCelularColetado(sceneState, inventory)` e reutilizar.

---

### 3. Arquivo `game.js` monolítico

**Arquivo:** `js/game.js` (1854 linhas)
**Problema:** Toda a lógica de UI, estado, diálogos, celular, galeria, bolsa e cenas está em um único arquivo.

**Solução:** Separar em módulos:

| Módulo | Responsabilidade |
|--------|------------------|
| `js/dialogue.js` | Sistema de diálogos e monólogos |
| `js/phone.js` | Sistema do celular (telas, reset, mensagens) |
| `js/bag.js` | Sistema da bolsa/inventário |
| `js/gallery.js` | Sistema de galeria/fotos |
| `js/scene.js` | Sistema de cenas, objetos e hotspots |
| `js/events.js` | Event listeners e inicialização |
| `js/game.js` | Orquestrador principal (state, config, bootstrap) |

---

### 4. Estado global (`state`) muito grande

**Arquivo:** `js/game.js:24-82`
**Problema:** Objeto `state` com 10+ propriedades aninhadas e mutável globalmente.

```js
const state = {
  aparelho: { ... },
  inventoryActionPending: null,
  inventory: [],
  bolsa: { ... },
  sceneState: {},
  modo: "livre",
  localizacao: { ... },
  dialogo: { ... },
  celular: { ... },
  arquivos: { ... },
  mensagens: { ... },
  galeria: { ... }
};
```

**Solução:** Separar em sub-objetos com funções dedicadas ou adotar um pattern de state machine.

---

### 5. Funções muito longas

**Arquivo:** `js/game.js`
**Problema:** Funções com mais de 50 linhas que deveriam ser decompostas.

| Função | Linhas | Problema |
|--------|--------|----------|
| `restaurarEstadoJogo` | 70+ | Restaura todo o estado de uma vez |
| `renderizarBolsa` | 100+ | Renderiza grid, paginação e detalhes |
| `validarSnapshot` | 50+ | Valida many campos em sequência |
| `renderizarDetalhesBolsa` | 65+ | Cria DOM inline extenso |

**Solução:** Extrair sub-funções menores e nomeadas.

---

### 6. `DATA` contém lógica misturada com dados

**Arquivo:** `js/data.js:158-372`
**Problema:** O objeto `DATA` contém dados estáticos, mas as funções de monólogo (`monologosDeBeco`) são chamadas na inicialização e misturadas com os dados.

```js
monologos: {
  beco_entrada: monologosDeBeco(monologoBecoEntrada),  // ← lógica
  beco_interior: monologosDeBeco(monologoBecoInterior),
  beco_fundo: monologosDeBeco(monologoBecoFundo)
}
```

**Solução:** Separar dados estáticos de lógica de monólogos em arquivos distintos.

---

### 7. Magic numbers hardcoded

**Arquivo:** `js/game.js` e `js/data.js`
**Problema:** Valores numéricos significativos espalhados sem nomes.

| Valor | Local | Uso |
|-------|-------|-----|
| `9` | `game.js:1742, 1746, 1747, 1755` | Itens por página da bolsa |
| `65` | `game.js:2` | Velocidade de digitação |
| `1200` | `game.js:3` | Intervalo entre mensagens |
| `700` | `data.js` (implicit) | Breakpoint mobile |

**Solução:** Centralizar em `CONFIG` ou criar constantes nomeadas.

---

### 8. Falta de documentação e tipos

**Arquivo:** Todos os arquivos `.js`
**Problema:** Código JavaScript puro sem JSDoc, sem tipos, sem documentação de parâmetros.

**Solução:** Adicionar tipos JSDoc para funções públicas e parâmetros importantes.

---

### 9. Função `validarSnapshot` muito complexa

**Arquivo:** `js/game.js:197-249`
**Problema:** Função com 50+ linhas que valida muitos campos em cascata com múltiplos returns null.

```js
function validarSnapshot(candidato) {
  if (!candidato || ...) return null;
  // ... 50+ linhas de validação
  return { ...copiarDados(candidato), ...exploration, aparelho };
}
```

**Solução:** Decompor em:
- `validarEstruturaBasica(candidato)`
- `validarLocalizacao(candidato)`
- `validarMensagens(candidato)`
- `validarCelular(candidato)`
- `validarArquivos(candidato)`

---

### 10. Event listeners no escopo global

**Arquivo:** `js/game.js:1338-1420`
**Problema:** Todos os event listeners são adicionados no topo do arquivo, misturados com lógica.

```js
el.btnBolsa.addEventListener("click", () => { ... });
el.btnConversar.addEventListener("click", iniciarConversa);
// ... 20+ listeners
```

**Solução:** Mover para função `inicializarEventos()` chamada no bootstrap.

---

### 11. Referência direta a `state` em módulos de dados

**Arquivo:** `js/data.js:47-48`
**Problema:** Funções em `data.js` acessam `state` diretamente, criando dependência circular implícita.

**Solução:** Passar estado como parâmetro ou usar injeção de dependência.

---

### 12. `el` como objeto global gigante

**Arquivo:** `js/game.js:84-154`
**Problema:** 70+ referências DOM em um único objeto global.

**Solução:** Agrupar por componente:
- `el.phone.*`
- `el.bag.*`
- `el.gallery.*`
- `el.dialogue.*`

---

## Plano de ação

### Execução iniciada — 09/09/2026

- [x] 1.1–1.2: helper de aquisição e resolução de monólogos em `js/monologues.js`, com estado recebido por parâmetro. `data.js` contém as variantes narrativas estáticas, sem getters dependentes do jogo.
- [x] 1.3: paginação da bolsa usa `CONFIG.itensPorPaginaBolsa`. Os tempos de digitação e mensagens já estavam em `CONFIG`; o breakpoint responsivo pertence ao CSS.
- [x] 1.4: JSDoc adicionado às factories dos sistemas, à captura/restauração e ao repositório de saves; expansão incremental continua quando novos sistemas forem tocados.
- [x] 2.1: separação de dados e comportamento dos monólogos.
- [x] 2.2: validação de snapshots decomposta por estrutura, localização, diálogo, arquivos, mensagens e celular.
- [x] 2.3: listeners extraídos para `js/events.js`, com `inicializarEventos()` idempotente chamada no bootstrap.
- [x] 3.1–3.5 nesta etapa: extraídos `dialogue.js`, `phone.js`, `bag.js`, `gallery.js`, `scene.js`, além de `events.js`, `interface.js`, `persistence.js`, `dom.js` e `state.js`. `game.js` virou a fábrica `criarJogo({ document, storage, data, items, config, window })` que monta `state`, `el`, `services`, `saveRepository` e `eventosInteracao` por instância e injeta essas dependências via `context`; o `el` é agrupado por componente; `bootstrap.js` cria e inicia a instância (e os testes criam as próprias).
- [x] 3.6 ainda: `state` continua com o mesmo tamanho, mas agora é um valor por instância (`criarEstadoJogo`), sem escopo global do jogo.
- [x] 4.1–4.2 nesta etapa: `npm test` verde (71 testes). Os testes de integração carregam os scripts na ordem do HTML; o harness (`test/load-game.cjs`) expõe a instância criada pelo bootstrap nos globals (`state`, `el` achatado por componente, `saveRepository`, `eventosInteracao` e cada serviço), preservando a API que os testes já usavam.
- [x] 4.3 nesta etapa: validação automatizada no Chromium headless de diálogo, navegação, abertura do cofre, coleta, bolsa, ativação do aparelho, mensagens, enigma, fotografia, restauração e reset. A fila de mensagens foi avançada programaticamente; não houve inspeção visual de layouts.

Dependências de escopo global permanecem apenas como catálogos imutáveis compartilhados (`CONFIG`, `DATA`, `ITEMS`, `RESET_STATUS`, `DIAS`, `MESES`, `MAX_MANUAL_SAVES`, `SAVE_STORAGE_*`); estado e DOM por instância não dependem mais de globals do jogo.

Gaps adicionais corrigidos nesta etapa:

- Identificadores como `toString`, `constructor` e `__proto__` podiam ser aceitos como cenas ou etapas de mensagem; agora a validação exige IDs textuais próprios dos catálogos.
- Reset agendado sem prazo era aceito e concluído imediatamente ao restaurar; esse snapshot agora é rejeitado.
- Fase e rota do monólogo são verificadas contra a cena salva.
- Versões dos scripts atualizadas no HTML para evitar combinar dados antigos em cache com o novo resolvedor.

O restante deste documento preserva o diagnóstico e o planejamento originais.

### Fase 1 — Correções imediatas (baixo risco)

| # | Ação | Arquivo |
|---|------|---------|
| 1.1 | Criar helper `foiCelularColetado()` | `data.js` |
| 1.2 | Remover código duplicado nos monólogos | `data.js` |
| 1.3 | Centralizar magic numbers em `CONFIG` | `game.js` |
| 1.4 | Adicionar JSDoc às funções públicas | todos |

### Fase 2 — Reorganização de dados (médio risco)

| # | Ação | Arquivo |
|---|------|---------|
| 2.1 | Separar funções de monólogo de `DATA` | `data.js` → `monologues.js` |
| 2.2 | Extrair `validarSnapshot` em sub-funções | `game.js` |
| 2.3 | Mover event listeners para `inicializarEventos()` | `game.js` |

### Fase 3 — Modularização (alto risco)

| # | Ação | Arquivo |
|---|------|---------|
| 3.1 | Extrair sistema de diálogos | `dialogue.js` |
| 3.2 | Extrair sistema do celular | `phone.js` |
| 3.3 | Extrair sistema da bolsa | `bag.js` |
| 3.4 | Extrair sistema de galeria | `gallery.js` |
| 3.5 | Extrair sistema de cenas | `scene.js` |
| 3.6 | Simplificar `state` global | `game.js` |

### Fase 4 — Qualidade (contínuo)

| # | Ação |
|---|------|
| 4.1 | Adicionar testes para cada módulo extraído |
| 4.2 | Validar que `npm test` continua passando |
| 4.3 | Testar fluxo completo no navegador |

---

## Priorização

1. **Crítico:** Código duplicado (item 2) — corrigir primeiro
2. **Alto:** Magic numbers (item 7) — baixo esforço, alto impacto
3. **Alto:** Monólogos com lógica (item 1) — separar dados de comportamento
4. **Médio:** Decompor `validarSnapshot` (item 9) — melhora manutenibilidade
5. **Médio:** Modularizar `game.js` (item 3) — maior esforço, maior benefício
6. **Baixo:** JSDoc e tipos (item 8) — pode ser feito incrementalmente
