# Sistema de Save

## Responsabilidades

O snapshot do jogo é a fonte de verdade. A fotografia é somente a identidade visual de um save manual.

- `js/persistence.js` captura, valida e restaura o estado narrativo real; `js/game.js` compõe os sistemas.
- `js/save-system.js` isola a persistência física e mantém a coleção versionada no `localStorage`.
- A Galeria apresenta e administra somente saves manuais.
- A Galeria é a única exceção à limpeza do celular: o reset remoto preserva suas fotografias e saves manuais, enquanto limpa Mensagens e o conteúdo visível de Arquivos.
- O autosave mantém um único checkpoint separado.
- A composição da foto resolve cenário e sprite a partir de IDs lógicos; imagens não são incorporadas ao save.

## Armazenamento

A chave `sanmd:saves` contém uma coleção com `storageVersion`, `manualSaves` e `autosave`. O repositório é a única camada que acessa `localStorage`.

```text
storageVersion: 1
manualSaves: PhotoSave[0..9]
autosave: Autosave | null
```

`storageVersion` identifica o formato da coleção. `saveVersion` identifica o formato de cada snapshot. Versões incompatíveis são rejeitadas sem alterar a sessão atual. Campos opcionais legados de snapshots v1 recebem normalização, incluindo inventário, estado de cena e aparelho, descrita abaixo.

## Save Manual

Cada fotografia manual contém:

```text
id
name                 máximo de 28 caracteres
createdAt            timestamp do dispositivo
photoExpression      ID lógico mj__photo__01..mj__photo__10
sceneId              ID lógico da cena fotografada
saveState            snapshot completo
```

A Galeria possui exatamente nove posições. O décimo save é recusado e nenhum registro é sobrescrito. Excluir uma fotografia remove somente seu ID e não altera a campanha ou o autosave.

A captura é temporária até a confirmação do nome. Cancelar descarta ID, expressão, timestamp e snapshot pendentes sem consumir uma posição.

## Snapshot Atual

O formato versão 1 persiste somente estruturas existentes no jogo:

- `act1Complete`: conclusão narrativa do protótipo (`false` em snapshots v1 antigos sem esse campo);
- `aparelho`: `originalPhoneStatus`, `activePhone` e `phoneTheme`;
- `inventory`: IDs únicos de itens coletados;
- `sceneState`: flags persistentes por cena, como `safeOpened` e `lulithPhoneCollected`;
- `localizacao`: IDs de local e cena;
- `dialogo`: fase do monólogo e rota narrativa escolhida;
- `celular`: estado semântico e prazo absoluto do reset remoto;
- `arquivos`: IDs vistos, snapshot pré-reset e flags do enigma de identidade;
- `mensagens`: etapa, histórico, fila, próxima etapa, flags de entrega, cooldown absoluto e histórico pré-reset.

Saves anteriores a essas extensões recebem valores iniciais, incluindo `act1Complete: false`: `inventory` vazio e `sceneState` derivado de `initialState`. A restauração substitui esses dados por cópias independentes.

Não são serializados objetos ou estados transitórios:

- handles de `setTimeout` e `setInterval`;
- `AudioContext`;
- tela/app atualmente aberto no celular;
- Galeria, detalhe, modal de nome, captura pendente e flash;
- foco, scroll, classes CSS e texto parcialmente digitado;
- arrays de falas derivados de `DATA`;
- sprite fotográfico como estado narrativo.

Saves manuais só podem ser criados pelo celular, que por contrato abre no modo livre. O load sempre fecha o celular, volta ao gameplay e recompõe cenário e controles. Deadlines de reset são reprogramados; um deadline já expirado é normalizado sem gerar autosave durante o load.

## Autosave

O autosave não possui nome, expressão fotográfica nem posição na grade. Cada gravação substitui o checkpoint anterior.

Os pontos lógicos atuais são:

- `encerrarConversa()`, depois do fim do diálogo e antes de devolver os controles;
- `concluirResetRemoto()`, depois de aplicar a limpeza e as flags finais do reset;
- conclusão bem-sucedida de hotspots, após flags e eventos narrativos;
- Novo jogo, depois de concluir ou pular `lulith_codigo`, revelar o gameplay e iniciar a conversa inicial;
- conclusão ou Skip de `act1_ending`, depois de marcar `act1Complete: true` e antes de `act1_title`/menu;
- `saveOnExit`, em `visibilitychange`/`pagehide`, somente durante a partida, sem cutscene ativa ou transição de cena.

Trocar de cena, abrir o celular, abrir a Galeria e carregar uma fotografia não acionam autosave. Em especial, carregar um save manual antigo preserva o autosave existente. Ele será substituído pelo próximo gatilho elegível da lista acima. A Cutscene 01 não grava autosave. A coleta registra o autosave normal do hotspot, mas não inicia a Cutscene 03. Frames, timers, áudio, câmera, título e estado de Skip nunca entram no snapshot. O retorno ao menu não apaga saves; carregar o autosave final conserva `act1Complete` e impede repetir a saída.

## Expressões Fotográficas

`DATA.personagens.mj.fotografia.expressoes` define os dez IDs lógicos disponíveis. A expressão é sorteada uma vez na captura, evita a expressão do save manual imediatamente anterior quando há alternativas e é persistida nos metadados.

Os dez sprites exclusivos já estão cadastrados em `assets/sprites/mj/photo/`.
`MJ.png` é fallback para IDs sem arte válida. Exemplo do mapeamento atual, sem mudar o formato dos saves:

```js
DATA.personagens.mj.fotografia.sprites.mj__photo__01 = "assets/sprites/mj/photo/mj__photo__01.png";
```

Ao substituir as artes, manter os IDs existentes. Não substituir os IDs em saves persistidos e não adicionar essas poses a `dialogo` ou `personagens.mj.sprites`: elas são cosméticas e exclusivas da Galeria.

## Validação E Erros

Antes de qualquer mutação, o load valida versão, IDs de local/cena, fases, rotas, arquivos, etapas, mensagens, flags e timestamps. Um snapshot inválido mantém a sessão intacta e exibe erro no detalhe da fotografia. Outros saves continuam disponíveis e o registro inválido ainda pode ser excluído.

Falhas de escrita também não devem derrubar o jogo. O autosave registra aviso no console; ações manuais apresentam erro na própria Galeria.

## Objetos e Bolsa

O snapshot v1 também aceita `inventory` (IDs únicos) e `sceneState` (flags por cena). Saves anteriores recebem inventário vazio e estados iniciais. A restauração substitui esses dados por cópias independentes. Veja [POINT_AND_CLICK.md](POINT_AND_CLICK.md).

## Aquisição funcional do celular

O snapshot v1 inclui `aparelho: { originalPhoneStatus, activePhone, phoneTheme }`.
O original permanece `broken`; o aparelho ativo é `null` ou `lulith`, e o tema é
`lulith` ou `mj`. A coleta já é registrada em `sceneState.beco_fundo`; a ativação
é derivada de `activePhone`, sem flags redundantes de disponibilidade.

Os estados restauráveis são: aparelho no cofre, aparelho coletado na Bolsa e
aparelho ativo fora da Bolsa. O load restaura aparelho e inventário antes de
renderizar a interface, cancela a reação pendente e não gera autosave.
Snapshots com aparelho ativo simultaneamente na Bolsa ou sem coleta/cofre aberto
são rejeitados antes de alterar a sessão.

Migração de saves sem `aparelho`: sem histórico de mensagens, arquivos vistos ou
reset iniciado, o aparelho permanece inativo e o inventário é preservado. Havendo
esse progresso anterior no celular, a migração conserva o acesso com aparelho
Lulith ativo e o antigo tema MJ; normaliza a coleta e retira eventual cópia da
Bolsa. A migração usa somente o snapshot, nunca o estado da sessão atual. Saves
novos começam com tema Lulith e não antecipam a personalização.

A coleta mantém o autosave existente dos hotspots. A ativação salva ao concluir
a reação, depois da mudança de estado. Os saves manuais continuam na Galeria,
acessível após ativar o aparelho; nenhuma interface nova de Save/Load foi criada.
