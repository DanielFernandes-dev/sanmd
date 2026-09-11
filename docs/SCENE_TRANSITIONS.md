# Transições globais de cena

`scene-transition.js` cria um controlador por instância de jogo. O overlay único
em `#vn-area` cobre background, objetos, personagens, hotspots e contexto.
Os controles laterais persistem visualmente, mas ficam desabilitados. A cor
`--scene-transition-color` reutiliza `--cor-fundo`; a camada 7 sucede diálogo (5)
e menu (6). Celular, Bolsa, Galeria, teclado e fotografia não acionam esse fade.

A navegação continua em `scene.js`: `irPara` valida as conexões atuais;
`irParaLocal` resolve a entrada de um local (API existente para mapa). Ambos
chamam `transitionToScene(localId, cenaId)`. Não há regra específica do beco.
Não existe atualmente outro fluxo de cutscene que altere a localização.

Para uma nova navegação, valide primeiro as regras narrativas e então use:

```js
await game.services.transitionToScene("delegacia", "delegacia_arquivo");
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

O carregador prepara e decodifica background e variantes visíveis dos objetos,
reutilizando um cache de imagens por controlador. Falhas/timeout de 10 s impedem
a revelação de uma cena sem assets. Objetos e hotspots são reconstruídos pelo
Scene State existente. O personagem anterior é removido ainda sob o overlay.

O bloqueio é síncrono, anterior ao primeiro await. Captura de eventos protege
mouse, touch, teclado e formulários; serviços de navegação, hotspots, conversa,
celular e load também recusam chamadas durante a transição. Menus e feedback
antigos são fechados antes do fade. O estado transitório fica na closure do
controlador, fora de saves/autosaves. Inicialização e Load continuam usando o
carregador imediato existente. Não alteramos o formato dos snapshots.

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

## Validação desta implementação

- `npm test`: 12 arquivos/suítes aprovados. Os testes antigos aguardam a API
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
