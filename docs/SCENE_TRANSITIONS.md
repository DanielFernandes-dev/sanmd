# Transições globais de cena

> Referência geral: [AGENTS.md](../AGENTS.md). Este documento aprofunda somente o contrato deste sistema.

`scene-transition.js` cria um controlador por instância de jogo. O overlay único
em `#vn-area` cobre background, objetos, personagens, hotspots e contexto.
Os controles laterais persistem visualmente, mas ficam desabilitados. A cor
`--scene-transition-color` reutiliza `--cor-fundo`; a camada 7 sucede diálogo (5)
e menu (6). Celular, Bolsa, Galeria, teclado e fotografia não acionam esse fade.

A navegação continua em `scene.js`: `irPara` valida as conexões atuais;
`irParaLocal` resolve a entrada de um local (API existente para mapa). Destinos
comuns chamam `transitionToScene(localId, cenaId)`. Na entrada do beco, a opção
narrativa **Sair do beco** inicia `act1_ending` quando o cofre está aberto,
o celular foi coletado e `act1Complete` é falso. A localização não muda durante
o encerramento. `lulith_codigo` é a apresentação de Novo jogo; o estado inicial
da casa já foi criado antes dela. Caderno e cutscenes reutilizam `animarFade`, com overlays próprios, sem invocar uma segunda
transição de navegação. Ver [Cutscenes](cutscenes.md).

Para uma nova navegação, valide primeiro as regras narrativas e então use:

```js
await game.services.transitionToScene("delegacia", "delegacia_mesa_mj");
```

O destino precisa existir no catálogo. A API verifica existência e ignora a
localização atual, mas não decide permissões narrativas. Cutscenes devem encerrar
seus diálogos/interfaces antes de chamar essa API. Para um carregador customizado:

```js
const ok = await game.services.runSceneTransition(async () => {
  // Executado com a tela opaca. Aguarde assets e renderização aqui.
  await carregarCenaAutorizada();
});
```

Esse callback deve manter seu estado recuperável em caso de erro. O carregador
padrão preserva a localização anterior se falhar. O controlador retorna `false`
em falha ou concorrência, registra erros e sempre libera overlay/input.
Não chame uma transição dentro de outra: pedidos concorrentes são descartados.

Tempos centralizados em `CONFIG.sceneTransition`: saída 320 ms, composição 100 ms,
entrada 400 ms. Com `prefers-reduced-motion: reduce`, cada fade leva 10 ms, sem
espera de composição. Apenas opacity é animada; não há blur ou transform.
A implementação usa somente fade. Novos efeitos poderão ser internos ao controlador.

O carregador prepara e decodifica background, todas as variantes dos objetos e frames de hotspots,
reutilizando um cache de imagens por controlador. Falhas/timeout de 10 s impedem
a revelação de uma cena sem assets. Objetos e hotspots são reconstruídos pelo
Scene State existente. O personagem anterior é removido ainda sob o overlay.

O bloqueio é síncrono, anterior ao primeiro await. Captura de eventos protege
mouse, touch, teclado e formulários; serviços de navegação, hotspots, conversa,
celular e load também recusam chamadas durante a transição. Menus e feedback
antigos são fechados antes do fade. O estado transitório fica na closure do
controlador, fora de saves/autosaves. Inicialização e Load preparam o módulo local antes de aplicar a cena; não usam o fade de navegação. O controlador de transição não altera snapshots; a Cutscene 03 acrescenta somente `act1Complete` ao progresso persistente.

Checklist para integrar navegação:

- Validar destino e permissões no sistema responsável.
- Encerrar UI/cutscene anterior quando aplicável.
- Aguardar `transitionToScene`: bloquear input → fade-out → preparar assets →
  aplicar localização/Scene State/objetos/hotspots/personagens/contexto → fade-in.
- Continuar o fluxo somente após o resultado; input já estará liberado.
- Não usar `aplicarCena`/`trocarCenario` diretamente para navegação; são loaders
  internos usados também por inicialização e restauração.

Validação manual desktop e APK: Entrada → Interior → Fundo → Interior → Entrada;
abrir cofre/coletar celular e repetir o percurso; clicar repetidamente em destinos
e tentar Bolsa/Celular/Conversar/hotspots durante fade; testar reduced motion,
cache frio e erro de asset, Save/Load. Conferir ausência de flash, resize,
orientação alterada e touch atravessando. Testes automatizados não substituem
inspeção visual em WebView Android real.

## Validação histórica desta implementação

- Na implantação original, `npm test`: 12 arquivos/suítes aprovados. A revisão atual está no [relatório do projeto](STATUS_PROJETO.md). Os testes antigos aguardam a API
  real; o harness simula imagens e relógio visual. O teste dedicado controla
  as fases e verifica concorrência, bloqueio, estados, reduced motion e erros.
- Chromium em localhost: percurso completo, bloqueio de Bolsa, pedido duplicado,
  imagens prontas ao revelar e overlay liberado. Reduced motion também executado.
  Cache frio pode ampliar a duração total enquanto as imagens são preparadas;
  os tempos configurados referem-se ao efeito, não ao download/decodificação.
- `./gradlew assembleDebug`: build final aprovado.
- APK em aparelho físico (SM-A055M via ADB WiFi): instalação, inicialização e
  percurso Entrada → Interior → Fundo validados. O fade suave (saída 320 ms,
  composição 100 ms, entrada 400 ms) cobre e descobre a cena sem flash,
  resize ou touch atravessando; a fluidez foi confirmada no aparelho.

## Carregamento local e cache

A transição prepara o script de eventos via `scene-modules.js`, ativa callbacks locais e desativa os anteriores. O cache de imagens retém referências da cena atual após sucesso e é limpo no menu/restore. Isso não descarrega scripts nem força limpeza do cache do navegador. O timeout de assets não cobre o loader de scripts, que ainda não tem timeout próprio.

## Organização do código

A execução visual do fade e a consulta de movimento reduzido são delegadas a
`animation.js`. O controlador de cena mantém exclusividade, carregamento de
assets, bloqueio de input e recuperação de erros. O timer de proteção do fade é
limpo ao concluir ou falhar. Veja [Padrão das mecânicas](MECHANICS_PATTERN.md).
