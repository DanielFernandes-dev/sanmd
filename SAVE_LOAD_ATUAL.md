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

A tela inicial e a Galeria têm uma identidade pessoal da MJ, com tons rosa/lilás, painéis escuros translúcidos e fotografias de moldura clara. A interface é composta por HTML/CSS, não por uma imagem de mockup aplicada sobre os controles.

| Elemento | Aparência atual |
|---|---|
| Fundo de `#phone-screen` | `wallpaper.png` centralizado, `cover`, sem repetição, sob gradiente escuro com opacidades de 0,3 a 0,5 |
| Fundo da Galeria | Gradiente translúcido de `rgba(17, 18, 36, 0.85)` nas extremidades e `rgba(32, 23, 48, 0.55)` em 55% |
| Cabeçalho da Galeria | `rgba(20, 20, 40, 0.65)`, divisor `rgba(218, 180, 197, 0.25)` e título `#f3dbe9` |
| Textos secundários | Subtítulo `#d0c7de`, contador `#f1d9e7`, status `#ffe0ba` e data do detalhe `#e0d0e7` |
| Destaque e ações | Gradiente rosa `#ad416b` a `#813551`, borda `#efa4c1` e texto `#fff4f8` |
| Fotografias | Moldura `#efe3da`, nome `#292333` na grade e metadados `#514254` |
| Exclusão | Borda `#ff667d`, fundo vinho `#35151d` e texto `#ffb0bd` |
| Tipografia técnica | `Courier New`, monoespaçada |
| Tipografia geral | `Trebuchet MS`, `Segoe UI`, Verdana |
| Assinaturas decorativas | MJ com coração, em cursiva itálica rosa e `aria-hidden="true"` |

O frame tem borda de `3px` em `#655367`, raio de `34px`, fundo em gradiente `#423c53`, `#161622` e `#392e49`, além de sombras externa e interna. A tela tem raio de `24px`. O overlay escurece o gameplay com `rgba(4, 6, 12, 0.88)` e desfoque de `3px`.

Na tela inicial, a assinatura fica no alto à direita; data e apps ficam na parte inferior. A grade de apps ocupa toda a largura disponível em duas colunas, com intervalo de `10px`. Os botões têm fundo roxo translúcido no modelo de ícone do mockup (ícone em cima, rótulo embaixo), e Galeria recebe destaque rosa. Apenas Mensagens, Galeria e Arquivos existem; a Notas foi removida. O botão **Voltar** na barra inferior usa a mesma modelagem de ícone do celular: tile quadrado arredondado, translúcido, com seta rosa e rótulo "Voltar". A data aparece em um painel escuro translúcido arredondado.

### Assets e Referências

Os arquivos permanecem na pasta real `assets/interfaces/`, no plural:

| Arquivo PNG | Dimensões e modo | Uso |
|---|---|---|
| `wallpaper.png` | 940×1672, RGB | Único PNG desta pasta usado em runtime pelo redesign; fundo de `#phone-screen` com `center / cover no-repeat` |
| `celular.png` | 1225×1284, RGBA | Exclusivamente mockup de referência do celular |
| `save.png` | 1161×1355, RGB | Exclusivamente mockup de referência da Galeria/save |

`celular.png` e `save.png` nunca são usados como UI nem como sprites da MJ. O wallpaper é declarado somente em `#phone-screen`; os painéis translúcidos da Galeria deixam esse fundo aparecer sem repetir o asset. Cenários e sprites fotográficos continuam sendo assets separados.

`copy:web` já copia recursivamente toda a pasta `assets` para `www/`, incluindo `assets/interfaces/` e os mockups. Estar no pacote não significa ser utilizado em runtime; não é necessário alterar o script nem renomear a pasta.

### Tela da Galeria

A tela é uma coluna flexível formada por:

```text
┌───────────────────────────┐
│ GALERIA              MJ   │
│ Seus momentos salvos.     │
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

O cabeçalho da Galeria é alinhado à esquerda, com subtítulo e assinatura decorativa à direita; seu acabamento translúcido é específico, diferente dos cabeçalhos de Mensagens e Arquivos. A toolbar separa o contador da ação principal. A barra de status do celular fica acima da Galeria, e a navegação geral fica abaixo, fora da seção `#phone-gallery`.

### Grade 3×3

`#gallery-grid` usa três colunas `minmax(0, 1fr)` e três linhas `minmax(112px, 1fr)`, com espaçamento de `6px`, padding `0 10px 10px` e rolagem vertical quando não há altura suficiente.

Slots vazios:

- fundo escuro translúcido `rgba(20, 20, 40, 0.55)`;
- borda tracejada `#bfaabb` e cantos de `4px`;
- sinal `+`, número de 1 a 9 e legenda `Espaço livre`, centralizados;
- baixo contraste para não competir com as fotografias.

Slots ocupados:

- funcionam como botões;
- exibem thumbnail, nome, data e hora;
- usam moldura clara, padding de `3px` e sombra discreta;
- truncam nomes longos com reticências, mas permitem quebra de linha nos metadados;
- recebem borda rosa `#ed9bbc` em hover ou foco, outline de `2px` na mesma cor em hover e outline `#f2b5cd` no foco visível pela regra geral dos botões do celular;
- preservam dimensões uniformes independentemente do conteúdo.

### Composição da Fotografia

A composição usa proporção `4:3`:

```text
photo-composition
  photo-background   cenário com object-fit: cover
  photo-mj           MJ centralizada, em primeiro plano
```

MJ ocupa 92% da altura da composição, fica centralizada horizontalmente com `left: 50%` e `translateX(-50%)`, e tem a base deslocada por `bottom: -10%`. Recebe sombra para separação do cenário. Cenário e sprite usam `image-rendering: pixelated`.

O cenário é resolvido por `sceneId` e pelo ID de local contido no snapshot. Caminhos físicos de imagens não são gravados como fonte de verdade no save.

### Preview e Detalhe

Preview e detalhe reutilizam a mesma composição da thumbnail em tamanho maior. A imagem recebe moldura clara semelhante a uma fotografia impressa:

- fundo `#efe3da`;
- padding de `7px` no topo e nas laterais, e `20px` embaixo;
- sombra `0 4px 12px rgba(0, 0, 0, 0.45)`;
- alinhamento reto, sem rotação (`transform: none`).

Os painéis têm intervalo de `10px`, padding `4px 16px 14px` e rolagem vertical. O campo de nome usa fundo escuro translúcido, borda `#b894b2`, cantos de `4px` e borda/outline rosa `#f2b5cd` ao receber foco.

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

As ações fotográficas usam o gradiente rosa, altura mínima de `44px`, padding `9px 12px` e cantos de `10px`. A ação destrutiva `EXCLUIR` usa o tratamento vinho/vermelho da tabela. `TIRAR FOTO` desabilitado fica com opacidade `0.4` e cursor `not-allowed`. Os grupos de ações permitem quebra de linha, com intervalo de `7px`, e usam `margin-top: auto`.

Os botões dentro de `#phone-screen` recebem outline rosa `#f2b5cd` de `2px`, com offset de `-2px`, no foco visível.

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

A Galeria está contida no frame responsivo do celular:

- largura normal: `min(360px, calc(100vw - 20px))`;
- altura: `min(720px, calc(100dvh - 20px))`, com `aspect-ratio: 9 / 18` declarado e padding de `10px`;
- em telas até `700px`: largura `min(360px, calc(100vw - 12px))`, padding de `6px` e `max-height: calc(100dvh - 12px)`; a regra de altura normal continua aplicada;
- grade e painéis usam `min-height: 0` para permitir encolhimento;
- a grade mantém três colunas e três linhas com mínimo de `112px`, recorrendo à rolagem vertical em vez de reduzir esse mínimo;
- tela inicial, preview e detalhe também possuem rolagem vertical quando necessário;
- cabeçalho, toolbar e navegação geral não encolhem (`flex: none`); as ações podem quebrar linha.

Com `prefers-reduced-motion: reduce`, a transição de abertura do overlay e a animação do flash são removidas.

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
