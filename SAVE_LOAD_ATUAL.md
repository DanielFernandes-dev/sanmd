# Estrutura Atual do Sistema de Save/Load

Este documento registra a implementação atual do sistema de persistência e o design visual usado pela Galeria do celular.

## Visão Geral

O sistema usa fotografias como apresentação dos saves manuais, mas mantém o snapshot do estado do jogo como fonte real de verdade.

```text
SAVE STATE
  Estado narrativo necessário para restaurar a campanha

PHOTO METADATA
  ID, nome, data, expressão fotográfica e cena

PHOTO PRESENTATION
  Cenário + sprite fotográfico da MJ

GALLERY
  Interface de criação, visualização, load e exclusão

AUTOSAVE
  Checkpoint único e automático, separado da Galeria
```

Existem duas categorias independentes:

| Categoria | Quantidade | Aparece na Galeria | Nome | Expressão fotográfica |
|---|---:|---|---|---|
| Save manual | Até 9 | Sim | Informado pelo jogador | Sim |
| Autosave | 1 | Não | Não | Não |

## Arquivos Responsáveis

| Arquivo | Responsabilidade |
|---|---|
| `js/save-system.js` | Repositório, leitura e escrita no `localStorage`, limite de saves e separação do autosave |
| `js/game.js` | Captura, validação e restauração do snapshot; regras e renderização da Galeria; gatilhos de autosave |
| `js/data.js` | Contrato lógico das dez expressões fotográficas da MJ |
| `index.html` | Estrutura das telas de grade, preview e detalhe |
| `styles.css` | Design visual, composição das fotografias, flash e layout 3×3 |
| `test/save-system.test.js` | Testes de persistência, slots, expressões, load, corrupção e autosave |
| `docs/SAVE_SYSTEM.md` | Contrato arquitetural resumido da persistência |

O projeto não usa framework, store externo ou roteador. O sistema foi integrado ao objeto `state`, às funções de renderização e ao roteamento manual do celular já existentes.

## Camadas

### Save Storage

`criarSaveRepository(storage)` em `js/save-system.js` isola a tecnologia física de armazenamento.

A implementação usa:

```text
localStorage key: sanmd:saves
storageVersion: 1
```

Quando `localStorage` não está disponível, o repositório usa memória temporária. Esse fallback atende testes e ambientes sem armazenamento, mas não sobrevive ao encerramento da aplicação.

API atual do repositório:

```js
listarManuais()
obterAutosave()
criarManual(save)
excluirManual(id)
salvarAutosave(autosave)
```

A interface não acessa `localStorage` diretamente.

### Save State

`capturarEstadoJogo()` cria um DTO serializável. `validarSnapshot()` verifica o DTO antes do load. `restaurarEstadoJogo()` aplica o snapshot validado e recompõe a interface de gameplay.

### Photo Save

O save manual combina metadados da fotografia e o snapshot:

```js
{
  id: "foto-...",
  name: "Antes do cofre",
  createdAt: 1788583680000,
  photoExpression: "mj__photo__04",
  sceneId: "beco_interior",
  saveState: { /* snapshot versionado */ }
}
```

### Gallery UI

A Galeria mantém apenas estado transitório em `state.galeria`:

```js
{
  saves: [],
  visualizacao: "grade",
  capturaPendente: null,
  selecionadoId: null,
  flashTimer: null
}
```

Esse estado controla a interface e nunca integra o snapshot narrativo.

### Autosave

`registrarAutosave()` captura o mesmo formato de snapshot, mas salva um registro próprio:

```js
{
  id: "autosave",
  createdAt: 1788583680000,
  saveState: { /* snapshot versionado */ }
}
```

O registro não contém nome, cena fotográfica ou expressão da MJ.

## Estrutura Persistida

A coleção completa no `localStorage` segue este formato:

```js
{
  storageVersion: 1,
  manualSaves: [/* zero a nove PhotoSave */],
  autosave: null // ou o checkpoint automático mais recente
}
```

`storageVersion` versiona o recipiente. `saveVersion` versiona cada snapshot.

## Snapshot Versão 1

```js
{
  saveVersion: 1,
  capturedAt: 1788583680000,

  localizacao: {
    local: "beco",
    cena: "beco_interior"
  },

  dialogo: {
    faseMonologo: "aposPrimeiroEnvio",
    rotaMonologoArquivo: null
  },

  celular: {
    resetAte: null,
    resetStatus: "inativo"
  },

  arquivos: {
    vistos: ["rota"],
    vistosAntesReset: [],
    enigmaIdentidadeResolvido: false,
    enigmaIdentidadeResolvidoAntesReset: false
  },

  mensagens: {
    etapa: "explicar-escolha",
    historico: [],
    donoRespondendo: false,
    donoDigitando: false,
    fila: [],
    proximaEtapa: null,
    cooldownAte: null,
    historicoAntesReset: []
  }
}
```

### Estado Não Persistido

Os seguintes dados são transitórios ou derivados e não entram no snapshot:

- handles de `setTimeout` e `setInterval`;
- `AudioContext`;
- app/tela atualmente aberta no celular;
- grade, detalhe, preview e formulário da Galeria;
- flash e captura ainda não confirmada;
- foco e posição de scroll;
- classes CSS e animações em andamento;
- texto parcialmente digitado;
- arrays de falas derivados de `DATA`;
- expressão fotográfica como pose narrativa;
- referências de elementos do DOM.

## Fluxo do Save Manual

```text
Gameplay livre
  -> Celular
  -> Galeria
  -> TIRAR FOTO
  -> criar captura temporária
  -> sortear expressão fotográfica
  -> capturar snapshot
  -> flash de 140 ms
  -> preview
  -> informar nome
  -> CONFIRMAR
  -> persistir fotografia e snapshot
  -> retornar à grade
```

Ao selecionar `CANCELAR`, a captura temporária é descartada. Nenhum slot é consumido.

### Limite de Slots

A grade sempre possui nove posições:

```text
[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
[ 7 ] [ 8 ] [ 9 ]
```

Com nove saves:

- o contador mostra `9/9`;
- `TIRAR FOTO` fica desabilitado;
- uma mensagem informa que a Galeria está cheia;
- nenhuma fotografia é sobrescrita;
- excluir um registro libera exatamente uma posição.

Cada fotografia possui ID próprio. Sua identidade não depende da posição visual ocupada na grade.

## Expressões Fotográficas

Os IDs lógicos ficam em `DATA.personagens.mj.fotografia.expressoes`:

```text
mj__photo__01
mj__photo__02
...
mj__photo__10
```

Regras atuais:

- uma expressão é sorteada na criação da captura temporária;
- o ID é persistido nos metadados;
- a mesma fotografia sempre reutiliza o ID armazenado;
- a expressão anterior é removida do próximo sorteio quando existem alternativas;
- abrir a Galeria, reiniciar ou carregar não executa novo sorteio;
- a expressão nunca altera `state.dialogo` ou a pose narrativa da MJ.

Os dez sprites exclusivos ainda não existem. O renderer consulta `DATA.personagens.mj.fotografia.sprites` e usa `assets/sprites/MJ.png` como fallback.

Para adicionar uma arte futuramente:

```js
DATA.personagens.mj.fotografia.sprites.mj__photo__01 = "assets/sprites/mj/photo-01.png";
```

Os IDs atuais devem permanecer estáveis para não invalidar saves existentes.

## Fluxo de Load

```text
Galeria
  -> selecionar fotografia
  -> detalhe
  -> CARREGAR
  -> confirmação "Voltar para este momento?"
  -> validar snapshot completo
  -> cancelar timers ativos
  -> restaurar estado narrativo
  -> reconstruir Set de arquivos vistos
  -> normalizar ou reagendar reset remoto
  -> resolver cenário pelos IDs de local/cena
  -> fechar Galeria e celular
  -> retornar ao gameplay livre
```

A validação acontece antes da primeira mutação. Um save inválido:

- não altera a sessão atual;
- apresenta uma mensagem segura na Galeria;
- não remove nem bloqueia os outros saves;
- continua podendo ser excluído deliberadamente.

O cenário é restaurado por ID lógico. O sistema não tenta deduzir estado a partir da imagem.

## Fluxo de Exclusão

```text
Detalhe
  -> EXCLUIR
  -> confirmação
  -> remover somente o ID selecionado
  -> atualizar contador e grade
```

A exclusão não modifica:

- o progresso atual da campanha;
- outras fotografias;
- o autosave.

## Fluxo de Autosave

Os gatilhos lógicos atuais são:

```text
encerrarConversa()
  -> limpar estado transitório do diálogo
  -> definir modo livre
  -> registrarAutosave()
  -> devolver controles
```

```text
concluirResetRemoto()
  -> aplicar limpeza e flags finais
  -> registrarAutosave()
  -> liberar navegação do celular
```

Não criam autosave:

- cada fala ou clique;
- troca comum de cenário;
- abertura do celular;
- abertura da Galeria;
- criação de fotografia manual;
- load de fotografia manual.

Carregar um save manual antigo preserva o autosave existente. O checkpoint só é substituído quando outra cutscene termina após o load.

## Design Atual

### Direção Visual

A Galeria reutiliza a linguagem do celular existente: interface escura, tecnológica e compacta, com contraste quente para ações relacionadas às fotografias.

| Elemento | Aparência atual |
|---|---|
| Fundo da tela | Azul-marinho escuro `#11182d` |
| Cabeçalho | Azul `#1c2747` com divisor `#38446d` |
| Texto principal | Bege claro herdado de `--cor-texto` |
| Texto secundário | Azul dessaturado `#9fb0e8` |
| Destaque e ações | Dourado `#e8b34b` |
| Exclusão | Vermelho `#ff667d` sobre fundo vinho `#35151d` |
| Tipografia técnica | `Courier New`, monoespaçada |
| Tipografia geral | `Trebuchet MS`, `Segoe UI`, Verdana |

### Tela da Galeria

A tela é uma coluna flexível formada por:

```text
┌───────────────────────────┐
│          GALERIA          │
├───────────────────────────┤
│ 0/9          TIRAR FOTO   │
├───────────────────────────┤
│ mensagem de status        │
│                           │
│ [foto] [foto] [vazio]     │
│ [foto] [vazio] [vazio]    │
│ [vazio][vazio] [vazio]    │
├───────────────────────────┤
│ ◀ VOLTAR                  │
└───────────────────────────┘
```

O cabeçalho segue exatamente o mesmo padrão visual de Mensagens e Arquivos. A toolbar separa o contador da ação principal.

### Grade 3×3

`#gallery-grid` usa três colunas e três linhas com espaçamento de `6px`.

Slots vazios:

- fundo escuro;
- borda tracejada;
- número central de 1 a 9;
- baixo contraste para não competir com as fotografias.

Slots ocupados:

- funcionam como botões;
- exibem thumbnail, nome, data e hora;
- truncam textos longos com reticências;
- recebem borda e outline dourados em hover ou foco;
- preservam dimensões uniformes independentemente do conteúdo.

### Composição da Fotografia

A composição usa proporção `4:3`:

```text
photo-composition
  photo-background   cenário com object-fit: cover
  photo-mj           MJ centralizada, em primeiro plano
```

MJ ocupa aproximadamente 92% da altura da composição, fica centralizada horizontalmente e recebe sombra para separação do cenário. O renderer usa `image-rendering: pixelated` para preservar a linguagem visual do sprite.

O cenário é resolvido por `sceneId` e pelo ID de local contido no snapshot. Caminhos físicos de imagens não são gravados como fonte de verdade no save.

### Preview e Detalhe

Preview e detalhe reutilizam a mesma composição da thumbnail em tamanho maior. A imagem recebe moldura clara semelhante a uma fotografia impressa:

- fundo `#eee9dc`;
- margem inferior maior;
- sombra escura;
- rotação de `-1deg`.

O preview mostra:

- fotografia capturada;
- campo de nome;
- `CONFIRMAR`;
- `CANCELAR`.

O detalhe mostra:

- fotografia persistida;
- nome;
- data e hora em linhas separadas;
- `CARREGAR`;
- `EXCLUIR`;
- `VOLTAR`.

### Flash

`#gallery-flash` cobre a tela da Galeria com branco e reduz a opacidade durante `140ms`.

```css
@keyframes gallery-flash {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

Com `prefers-reduced-motion: reduce`, a animação é removida. A captura ainda respeita o fluxo lógico e abre o preview normalmente.

### Botões e Estados

As ações fotográficas usam borda e texto dourados sobre fundo marrom escuro. A ação destrutiva `EXCLUIR` usa vermelho para se diferenciar.

Mensagens de sucesso, erro e Galeria cheia usam `role="status"` e `aria-live="polite"`.

As confirmações de load e exclusão usam atualmente `window.confirm`.

### Navegação

Estados visuais internos:

```text
grade
preview
detalhe
```

O botão físico/lógico `VOLTAR` segue esta regra:

- preview ou detalhe -> grade;
- grade -> tela inicial do celular;
- tela inicial -> fecha o celular.

Após um load bem-sucedido, o celular é fechado imediatamente e o foco retorna ao botão do celular no gameplay.

### Responsividade

A Galeria está contida no frame responsivo já usado pelo celular:

- largura normal: `min(320px, 78vw)`;
- em telas até `700px`: `min(300px, 76vw)`;
- altura limitada a `92vh` no layout móvel;
- grade e painéis usam `min-height: 0` para permitir encolhimento;
- preview e detalhe possuem rolagem vertical quando necessário.

## Tratamento de Tempo

Datas das fotografias usam `Date.now()` e são armazenadas como timestamp. A formatação acontece somente na apresentação:

- data: locale `pt-BR`;
- hora: duas casas para hora e minuto.

Deadlines narrativos também são timestamps absolutos:

- `cooldownAte` para mensagens;
- `resetAte` para o reset remoto.

No load, timers antigos não são reutilizados. O sistema calcula o tempo restante e cria novos timers. Um reset já expirado é normalizado sem criar autosave durante a restauração.

## Regras de Integridade

- A coleção aceita no máximo nove saves manuais.
- O autosave nunca integra `manualSaves`.
- A expressão fotográfica nunca altera diálogo ou pose narrativa.
- A remoção usa ID, não índice visual.
- Todo snapshot é validado antes do load.
- O estado atual não é destruído quando a validação falha.
- Load não chama `registrarAutosave()`.
- Imagens são resolvidas por IDs lógicos.
- Estado transitório da interface não é serializado.

## Cobertura Automatizada Atual

`test/save-system.test.js` valida:

- persistência entre duas inicializações;
- cenário, nome, timestamp e expressão;
- flash e preview;
- cancelamento sem consumo de slot;
- sorteio dentro dos IDs permitidos;
- ausência de repetição imediata;
- limite de nove saves;
- recusa do décimo save;
- exclusão e reutilização do espaço;
- restauração de cena, flags, mensagens e progresso;
- separação entre expressão fotográfica e estado narrativo;
- rejeição segura de snapshot corrompido;
- criação e substituição do autosave;
- preservação do autosave durante load manual.

## Limitações Atuais

- Os dez sprites fotográficos finais ainda não existem; todos usam o sprite neutro como fallback.
- Não existe interface dedicada para carregar o autosave.
- Não existem migrations entre versões; dados incompatíveis são recusados.
- As confirmações usam o diálogo nativo do navegador, sem modal visual próprio.
- O sistema persiste somente estruturas narrativas que existem no protótipo atual.
- Não há cloud save, compartilhamento, screenshot real, replay ou seleção de capítulos.

## Extensão Futura

Ao adicionar novos sistemas narrativos, o snapshot deve crescer explicitamente. O fluxo recomendado é:

1. Adicionar o novo estado persistente ao DTO de `capturarEstadoJogo()`.
2. Validar sua estrutura em `validarSnapshot()`.
3. Restaurá-lo em `restaurarEstadoJogo()`.
4. Incrementar `SAVE_VERSION` se o formato deixar de ser compatível.
5. Criar migration antes de aceitar versões antigas.
6. Adicionar testes de round-trip e corrupção para o novo campo.

Não adicionar estado de interface ao snapshot apenas para reproduzir visualmente a tela que estava aberta.
