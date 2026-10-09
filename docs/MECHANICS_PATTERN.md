# Padrão das mecânicas e animações

> Referência geral em [AGENTS](../AGENTS.md); este documento mantém somente o contrato especializado.

A implementação mantém **Factory + injeção de dependências** para os sistemas,
**Strategy** para os tipos de interação e uma **Facade de animação** para a
apresentação. Não exige framework, classes base ou alteração dos snapshots v1.

`criarJogo` é o ponto de composição: cria estado, DOM, repositório e sistemas por
instância; liga os métodos em `services` antes de iniciar o jogo. Fábricas podem
referenciar serviços dentro de callbacks, mas não devem executá-los na construção.

| Responsabilidade | Implementação |
|---|---|
| Navegação e regras de destino | `scene.js` |
| Sequências, input e Skip global | `cutscene.js` |
| Seleção de apresentação | `cutscene-renderers.js` |
| Título/luz e renderer de quadros | `cutscene-view.js`, `cutscene-frames.js` |
| Pool de SFX, preload e limpeza | `cutscene-audio.js` |
| Sequência exclusiva: cobrir, carregar, revelar, liberar input | `scene-transition.js` |
| Execução do fade, fallback, tempos visuais e reduced motion | `animation.js` |
| Estratégias de hotspots e registro de tipos | `mechanics.js` |
| Inventário e estratégia `activate_phone` | `bag.js` |
| Diálogos, mensagens, reset e regras narrativas | `dialogue.js`, `phone.js` |
| Fotografias e persistência | `gallery.js`, `persistence.js`, `save-system.js` |
| Editor compartilhado e teclado | `text-entry.js`, `keyboard.js` |

## Pipeline das interações

Hotspot → validar modo, bloqueios, condições e item necessário → resolver
estratégia → executar efeito específico → aplicar flags/consumo → renderizar →
evento narrativo → autosave → foco.

As estratégias atuais são `examine`, `interact`, `collect`, `use_item` e `trigger`.
A coleta chama `adicionarItem` e pode recusar a operação. Os outros tipos usam os
campos declarativos existentes (`changes`, `requiresItem`, `consumeItem`,
`eventId`) no pipeline comum. Tipos desconhecidos ou herdados são recusados.

Para adicionar um tipo, declare sua função em `criarMecanicasHotspot`. Ela recebe
a definição do hotspot e retorna booleano síncrono: `false` impede a continuação.
Valide antes de alterar estado; não faça mutações parciais seguidas de recusa.
Efeitos assíncronos exigem um contrato próprio de bloqueio e cancelamento.

A Bolsa usa `criarRegistroMecanicas` com estratégias `{ validar, concluir }`.
A reação começa somente após validar; a conclusão revalida item e condições.
Load continua cancelando a ação pendente. Novas ações são declaradas no catálogo
por `inventoryAction.type` e implementadas nesse registro.

## Contrato visual

`CONFIG` alimenta as variáveis CSS por `configurarAnimacoes()` na inicialização.
Personagem, fechamento do celular e flash usam `duracaoVisual` também nos timers
JavaScript: reduced motion remove a espera decorativa. O fade global mantém os
10 ms e a composição sem espera definidos em `docs/SCENE_TRANSITIONS.md`.

`animarFade(element, from, to, duration)` aplica o estilo final e aguarda a Web
Animations API. Sem essa API, aguarda o tempo configurado. Um limite de tempo
protege WebViews que não resolvam `finished`; a conclusão ou falha limpa o timer
e cancela a animação. O controlador de cena continua responsável por liberar
input, overlay e foco em `finally`.

Timers narrativos (digitação, mensagens, contagem e reset) preservam seu tempo:
a preferência visual não pode adiantar eventos da história. O progresso visual
do reset acompanha `CONFIG.duracaoReset`. Animações não entram nos saves.

As cutscenes usam passos declarativos e um único timer de avanço. `hold` suspende
o avanço da abertura; as Cutscenes 02 e 03 concluem naturalmente. `encerrar()` opcional pode
aguardar fade/áudio antes de `finalizar()` e do callback, mantendo o input
bloqueado. Skip encerra a sessão ativa e cancela o timer; não cria outro caminho
narrativo. O renderer de quadros resolve tipos de passo por funções dedicadas
(`frame`, `fade-black`, `black`, `title`). Dados desconhecidos causam erro tratado
pelo controlador; a finalização limpa título e câmera. `sairDoBeco()` coordena a
conclusão narrativa na camada de cenas, com callbacks idempotentes. Ver
[Cutscenes](cutscenes.md).

Validação: `node --test`. Inspeção visual em navegador e WebView Android continua
necessária para avaliar fluidez, composição e orientação reais.
