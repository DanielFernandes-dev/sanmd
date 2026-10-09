# Realces de toque e foco

> Referência geral em [AGENTS](../AGENTS.md); este documento mantém somente o contrato especializado.

Os botões de Ir para, Bolsa, Celular, mapa/PC e os hotspots não usam o realce
nativo de toque do WebView. Os hotspots continuam clicáveis e transparentes,
inclusive o celular da Lulith antes da coleta. O pipeline existente remove
o objeto e o hotspot quando `lulithPhoneCollected` passa para `true`.

`events.js` registra a modalidade transitória de input em `#app.dataset.inputMode`.
Toque/mouse não desenham contornos sobre os controles da sidebar, destinos,
hotspots ou Localizar. Tab, setas, Enter e Espaço permitem os contornos de foco
existentes para navegação por teclado. Esse estado visual não entra nos saves.

A abertura libera o menu após a iluminação. Duplo toque continua pulando uma
cutscene em andamento; Novo jogo e Carregar aceitam um toque após a conclusão.

## Verificação em navegador

Além de `npm test`, `scripts/check-overlays.cjs` verifica estilos computados e
eventos de toque do Chromium, que os mocks de DOM não reproduzem.

1. Servir o projeto: `python3 -m http.server 8000`.
2. Abrir uma instância de Chromium para testes com `--remote-debugging-port=9222`
   e um perfil temporário separado (`--user-data-dir=...`).
3. Executar `node scripts/check-overlays.cjs` (Node com WebSocket nativo).

`CDP_URL` e `SANMD_URL` permitem trocar os endereços. O teste abre uma aba própria
e a fecha ao terminar; cria progresso apenas no perfil de teste. Cobre o menu
após conclusão/Skip, navegação antes/depois de James, Bolsa, MJ/Lulith, cofre,
mapa/Localizar, restauração, teclado e viewports retrato/paisagem.
