const assert = require('node:assert/strict');

async function main() {
  const endpoint = process.env.CDP_URL || 'http://localhost:9222';
  const target = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { pending.get(message.id)(message); pending.delete(message.id); }
  });
  const call = (method, params = {}) => new Promise(resolve => {
    pending.set(++id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
  const run = async expression => {
    const response = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.error || response.result.exceptionDetails) throw Error(JSON.stringify(response));
    return response.result.result.value;
  };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const until = async expression => {
    for (let i = 0; i < 250; i++) { if (await run(expression)) return; await wait(100); }
    throw Error(`Tempo excedido: ${expression}; ${await run("JSON.stringify({phase:document.getElementById('cutscene-stage').dataset.phase,current:game.services.getCurrent(),step:CUTSCENES.intro_abertura.steps.at(-1)})")}`);
  };
  const touch = async (x, y) => {
    await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const tap = async selector => {
    const rect = await run(`document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().toJSON()`);
    assert.ok(rect.width && rect.height, `${selector} deve estar visível`);
    await touch(rect.x + rect.width / 2, rect.y + rect.height / 2);
  };
  const transparent = async selector => {
    const result = await run(`(() => { const el = document.querySelector(${JSON.stringify(selector)}), s = getComputedStyle(el);
      return { tap: s.webkitTapHighlightColor, background: s.backgroundColor, outline: s.outlineStyle }; })()`);
    assert.equal(result.tap, 'rgba(0, 0, 0, 0)', selector);
    assert.equal(result.background, 'rgba(0, 0, 0, 0)', selector);
    assert.equal(result.outline, 'none', selector);
  };
  const navigate = async () => {
    await call('Page.navigate', { url: process.env.SANMD_URL || 'http://localhost:8000' });
    await until('typeof game !== "undefined"');
  };
  try {
    await call('Page.bringToFront');
    await call('Network.enable');
    await call('Network.setCacheDisabled', { cacheDisabled: true });
    await call('Emulation.setDeviceMetricsOverride', { width: 915, height: 412, deviceScaleFactor: 1, mobile: true });
    await call('Emulation.setTouchEmulationEnabled', { enabled: true });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await navigate();
    await until('!game.services.isCutsceneActive()');
    assert.equal(await run("document.getElementById('title-menu').inert"), false);
    await tap('#notebook-load');
    await until("titleMenu.getMode() === 'load'");
    await tap('#notebook-back');
    await until("titleMenu.getMode() === 'menu'");
    await tap('#notebook-new');
    await until("game.services.getCurrent() === 'lulith_codigo'");
    await touch(200, 200); await wait(100); await touch(200, 200);
    await until("game.state.modo === 'dialogo' && document.getElementById('title-menu').hidden");
    await run('game.services.encerrarConversa()');
    await transparent('#btn-ir-para');
    await tap('#btn-ir-para');
    await transparent('#ir-para-menu button');
    await tap('#ir-para-menu button');
    await until("game.state.localizacao.cena === 'casa_sala' && !game.services.isSceneTransitioning()");
    const before = await run("document.getElementById('vn-area').getBoundingClientRect().toJSON()");
    await tap('#btn-ir-para');
    await transparent('#ir-para-menu button');
    await run("game.services.irPara('casa_cozinha')");
    await run('game.services.encerrarConversa()');
    await run("game.services.irPara('casa_sala')");
    assert.deepEqual(await run("document.getElementById('vn-area').getBoundingClientRect().toJSON()"), before);
    await tap('#btn-ir-para');
    await transparent('#ir-para-menu button');
    await run("game.services.irPara('casa_quarto_mj')");
    await transparent('[data-hotspot="mj_bag"]');
    await tap('[data-hotspot="mj_bag"]');
    await transparent('#btn-bolsa');
    await tap('#btn-bolsa');
    assert.equal(await run('game.el.bag.bagDialog.open'), true);
    await tap('#bag-close');
    await run("game.services.irPara('casa_sala')");
    await transparent('[data-hotspot="mj_phone"]');
    await tap('[data-hotspot="mj_phone"]');
    await transparent('#btn-celular');
    await tap('#btn-celular');
    assert.equal(await run('game.state.modo'), 'celular');
    await run('game.services.fecharCelular()');
    await run(`game.state.localizacao={local:'delegacia',cena:'delegacia_mesa_mj'};
      game.services.aplicarCena(game.services.obterCenaAtual());
      game.services.abrirEstacaoTrabalho();game.services.abrirMapaGlobal({source:'delegacia_computer'})`);
    assert.equal(await run("document.getElementById('world-map-art').naturalWidth"), 1672);
    await transparent('#map-search');
    await tap('#map-search');
    await transparent('#map-search');
    await run(`game.el.worldMap.mapLatitude.value=DATA.prototypeAlleyCoordinates.latitude;
      game.el.worldMap.mapLongitude.value=DATA.prototypeAlleyCoordinates.longitude`);
    await tap('#map-search');
    assert.equal(await run('game.state.worldMap.availableLocations.beco'), true);
    await tap('#map-close');
    assert.equal(await run('game.el.workstation.overlay.inert'), false);
    await tap('#workstation-close');
    await run(`game.state.aparelho={originalPhoneStatus:'broken',activePhone:null,phoneTheme:'mj'};
      game.state.localizacao={local:'beco',cena:'beco_fundo'};game.services.aplicarCena(game.services.obterCenaAtual())`);
    assert.equal(await run('game.el.phone.btnCelular.hidden'), true);
    await tap('[data-hotspot="safe"]');
    await until("!!document.querySelector('[data-hotspot=\"lulith_phone\"]')");
    await transparent('[data-hotspot="lulith_phone"]');
    await tap('[data-hotspot="lulith_phone"]');
    assert.equal(await run("document.querySelector('[data-hotspot=\"lulith_phone\"]') === null"), true);
    assert.equal(await run("document.querySelector('[data-object-id=\"lulith_phone\"]') === null"), true);
    assert.equal(await run('game.el.phone.btnCelular.hidden'), true);
    await tap('#btn-bolsa');
    await run("game.services.executarAcaoInventario('lulith_phone');game.services.encerrarConversa()");
    assert.equal(await run('game.state.aparelho.activePhone'), 'lulith');
    await run('game.services.restaurarEstadoJogo(game.services.capturarEstadoJogo())');
    await transparent('#btn-celular');
    await tap('#btn-celular');
    assert.equal(await run('game.state.modo'), 'celular');
    await run('game.services.fecharCelular()');
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await run('game.el.scene.btnIrPara.focus()');
    assert.equal(await run("getComputedStyle(game.el.scene.btnIrPara).outlineStyle"), 'solid');
    await call('Emulation.setDeviceMetricsOverride', { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
    await tap('#btn-ir-para');
    await transparent('#ir-para-menu button');
    await navigate();
    await until("game.services.getCurrent() === 'intro_abertura'");
    await touch(200, 200); await wait(100); await touch(200, 200);
    await until('!game.services.isCutsceneActive()');
    await tap('#notebook-load');
    await until("titleMenu.getMode() === 'load'");
    console.log('OK: menu natural/Skip, toque único, Ir para antes/depois de James, Bolsa, MJ/Lulith, cofre, mapa, Save/Load, teclado e retrato/paisagem.');
  } finally {
    socket.close();
    await fetch(`${endpoint}/json/close/${target.id}`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
