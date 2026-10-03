# Point-and-click e Bolsa da MJ

O cenário é sempre interativo: não existe botão, modo ou cursor de investigação.
Na lateral direita, **Bolsa da MJ** abre um inventário narrativo sem limite, peso,
quantidades ou organização manual. O diálogo nativo permite fechar por botão ou
Escape, mantém o foco dentro da Bolsa e devolve o foco ao ícone.

## Estrutura existente e integração

- `js/data.js`: `DATA.locais[local].cenas` declara cenas e destinos comuns de **Ir para**.
  `beco_fundo` continua sendo uma única cena, com background permanente.
- `js/scene.js`: acrescenta **Sair do beco** na entrada quando cofre e coleta estão concluídos e `act1Complete` é falso; essa ação inicia a Cutscene 03.
- `js/game.js`: composição dos sistemas; `js/scene.js`: navegação, renderização e interações; `js/mechanics.js`: estratégias de hotspots; `js/persistence.js`: snapshot.
- `js/save-system.js`: repositório existente de saves manuais e autosave, sem novo sistema.
- `assets/cenario/`: arte fonte; `npm run copy:web` gera `www/`, inclusive os novos PNGs.

A composição do DOM é background → object-layer → personagem → hotspot-layer;
a interface fica fora da área lógica. As imagens de objetos não recebem eventos.
Cada hotspot é um `button` transparente com nome acessível, mouse, toque e teclado.
Não há caixas permanentes; o foco por teclado tem contorno para acessibilidade.
Durante diálogos e Celular, a camada fica `inert`, seguindo o bloqueio já existente
das funções da cena. Isso não é um modo de investigação.

## Coordenadas e arte

`rect: [x, y, width, height]` usa percentuais da mesma área lógica de **1672:941**.
O contêiner `#scene` preserva essa proporção e cabe inteiro na área disponível
(`contain` por dimensões do contêiner). Background, objetos e hotspots compartilham
exatamente essa área; barras externas não fazem parte das coordenadas. O alvo de
toque tem mínimo de 44×44 CSS px. A lateral direita permanece disponível em retrato.

`background.png` não contém cofre. `objects/safe_closed.png` e `safe_open.png`
são PNGs RGBA 1254×1254 com a mesma caixa lógica e âncora; somente a porta muda.
O sprite `lulith_phone.png` também possui alpha real e não faz parte do cofre aberto.
O fundo novo tem 1672×941, metade da resolução do original de 3344×1882, mantendo
sua proporção e enquadramento. `cofre.png` fica como referência histórica, sem uso
em cenas. Os arquivos finais vieram da ferramenta integrada `imagegen`.

Prompts utilizados, em resumo: remover apenas o cofre e reconstruir a parede,
preservando câmera/iluminação; desenhar cofre fechado isolado; abrir somente a
porta à direita mantendo caixa e âncora e exigir canal alpha real; desenhar somente
um celular em pixel art com tela discreta e transparência. Não foram usados recortes
do background ou backgrounds alternativos por estado.

## Dados efetivamente implementados

Uma cena pode declarar:

- `initialState`: valores iniciais de flags persistentes.
- `objects`: objetos `{id, rect, variants}`.
- `variants`: `{asset, conditions}`; a primeira variante cujas condições são satisfeitas aparece.
- `hotspots`: `{id, rect, ariaLabel, type, conditions, changes, message}`.

As condições são igualdades combinadas por AND, relativas à cena atual. `changes`
é um patch de seu estado. Campos opcionais do hotspot:

- `itemId`: item de uma ação `collect`.
- `requiresItem`: ID exigido, reconhecido automaticamente na Bolsa.
- `consumeItem`: sobrescreve a política `consumable` do item exigido.
- `missingItemMessage`: feedback quando falta o item.
- `eventId`: callback registrado em `eventosInteracao`, executado após a alteração lógica.
- `animation`: `{objectId, frames, frameDuration, finalHold}`; sequência visual antes
  de aplicar a mecânica e suas mudanças persistentes.

### Abertura do cofre

A sequência usa `safe_closed.png`, quatro `safe_opening_01..04.png` e
`safe_open.png`, todos RGBA 1254×1254 em `assets/cenario/beco/objects/`.
Os intermediários duram 80 ms cada; o aberto permanece 100 ms antes da revelação
do celular (420 ms no total). O mesmo elemento de imagem permanece na cena.
Todos os sprites e frames são pré-carregados e decodificados ao entrar na cena;
o clique também aguarda esse carregamento antes de começar a sequência.

O controlador transitório vive na closure de `criarSistemaCenas`, fora de `state`.
Enquanto ativo, bloqueia os hotspots; apenas ao terminar aplica `safeOpened: true`,
revela o celular e registra o autosave. Troca de cena ou Load invalida a animação
pendente; saves abertos mostram diretamente o sprite final. Falha no carregamento
preserva o fechado e permite tentar novamente. Fotografias usam somente as flags
persistentes. O inventário e o formato do save continuam iguais.

Arte intermediária produzida com a ferramenta integrada `imagegen`, usando os
sprites fechado/aberto como referências. Prompts: preservar canvas, corpo, âncora,
texturas e alpha; girar somente a porta pela dobradiça direita em quatro etapas;
interior vazio e sem celular. Os dois primeiros frames receberam instruções de
posição da borda livre para conservar uma abertura gradual.

Tipos aceitos: `examine` (comentário), `interact` (alteração de objeto), `collect`
(coleta única), `use_item` (uso de item) e `trigger` (gancho narrativo). Comentários
usam `message`; narrativa mais complexa usa `eventId`. Um callback recebe
`{sceneId, itemId}` e pode iniciar diálogo/cutscene pelas funções existentes.

Exemplo para uma futura porta, sem adicionar uma porta ao jogo agora:

```js
{
  id: "door", rect: [60, 20, 20, 60], ariaLabel: "Abrir porta",
  type: "use_item", conditions: { doorOpened: false },
  requiresItem: "storage_key", consumeItem: true,
  changes: { doorOpened: true }, message: "A porta abriu."
}
```

`doorOpened: false` precisa estar em `initialState`. O item precisa existir em
`ITEMS`. `executarHotspot(id, selectedItem = null)` admite seleção explícita futura;
nenhuma interface de seleção de itens/puzzle foi implementada.

## Inventário e narrativa

`ITEMS[id]` contém somente `id`, `label`, `description`, `asset`, `consumable`.
`state.inventory` guarda apenas IDs únicos. `adicionarItem(id)` e `removerItem(id)`
retornam booleano e atualizam a Bolsa. Itens permanentes têm `consumable: false`;
isso impede consumo automático padrão, mas não remoção explícita pela narrativa.
Ações narrativas externas devem chamar `registrarAutosave()` depois de concluir
todas as suas alterações; o executor de hotspots já faz isso após o callback.

O celular coletado não se torna aparelho ativo automaticamente. Um evento futuro
pode remover `lulith_phone` e fazer a transição narrativa para o aparelho funcional.
A remoção não apaga `lulithPhoneCollected`, portanto não permite recoleta.

## Estados e Save/Load

`state.localizacao` informa onde MJ está. `state.sceneState[sceneId]` contém as
mudanças do ambiente. Estado inicial deriva de `initialState` quando ausente.

| safeOpened | lulithPhoneCollected | Visual / hotspot | Bolsa após coleta |
|---|---|---|---|
| false | false | cofre fechado / abrir | vazia |
| true | false | cofre aberto + celular / coletar | vazia |
| true | true | cofre aberto / nenhum | celular, até remoção narrativa |

Visibilidade é derivada, não persistida. Os snapshots existentes recebem
`inventory` e `sceneState` com cópia profunda. A versão permanece 1 por ser uma
extensão aditiva: saves antigos sem esses campos recebem `[]` e `{}`. IDs
inexistentes, formatos e tipos de flags inválidos são rejeitados; IDs repetidos
são normalizados. A restauração substitui o estado inteiro, sem mesclar o futuro
com o save anterior. A Galeria compõe os objetos usando o snapshot da foto.

## Checklist de expansão

1. Escolher a cena e criar IDs estáveis para objeto/hotspot/flags.
2. Criar sprites independentes com alpha e estados com a mesma âncora.
3. Definir `initialState`, `objects`, variantes e região percentual de clique.
4. Definir nome acessível, tipo, condições, mudanças e feedback.
5. Se coletável, cadastrar em `ITEMS` e definir `consumable`.
6. Se exigir item, definir `requiresItem` e política de consumo.
7. Se narrativo, registrar o callback em `eventosInteracao`.
8. Testar mouse, teclado, toque e resize; manter alvo confortável.
9. Testar saída/retorno à cena, coleta repetida e remoção narrativa.
10. Testar saves antes/depois de cada estado e carregar em sessão nova.
11. Executar `npm test` e `npm run copy:web`.

Os testes em `test/save-system.test.js` cobrem os três estados, snapshots isolados,
retorno à cena, restauração em ambiente novo, saves antigos, dados inválidos,
unicidade, item exigido, consumo e remoção sem respawn. A suíte existente cobre
Conversar, navegação, Celular, mensagens, arquivos, Galeria e saves.

## Ações diretas e aparelho ativo

`lulith_phone` é o **Celular de Lulith**. Coletar apenas grava
`sceneState.beco_fundo.lulithPhoneCollected` e adiciona o ID à Bolsa.
O celular original de MJ começa quebrado; `state.aparelho` mantém
`originalPhoneStatus: "broken"`, `activePhone: null` e `phoneTheme: "lulith"`.

A definição do item declara `inventoryAction` com tipo `activate_phone`, rótulo,
aparelho, tema e reação curta. O painel mostra **USAR** apenas para uma ação
válida. `executarAcaoInventario` valida posse, modo e handler, bloqueia repetição,
fecha a Bolsa e inicia o diálogo existente. Ao concluir, o handler transforma o
item em aparelho ativo, remove o ID e atualiza a Bolsa. O encerramento normal do
diálogo registra o autosave com o estado final. Abrir ou selecionar na Bolsa não
salva nem ativa o aparelho. Um load cancela qualquer ação pendente.

A interface deriva a visibilidade do botão CELULAR de `activePhone`, sem reservar
uma linha vazia quando ele está oculto. O mesmo sistema de celular abre o aparelho
ativo. O tema Lulith usa fundo sóbrio sem assinatura MJ; o tema MJ permanece
suportado para a personalização futura, sem evento novo de personalização.
Mensagens, arquivos, galeria e progresso não são alterados pela ativação.

Ações diretas possuem handlers próprios e não mudam o uso automático de chaves
nos hotspots. Itens sem `inventoryAction` continuam apenas com seus detalhes.
