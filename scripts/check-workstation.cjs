const assert = require('node:assert/strict');
const fs = require('node:fs');

async function main() {
  const endpoint = process.env.CDP_URL || 'http://localhost:9222';
  const target = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { pending.get(message.id)(message); pending.delete(message.id); }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params);
  });
  const call = (method, params = {}) => new Promise(resolve => {
    pending.set(++id, resolve); socket.send(JSON.stringify({ id, method, params }));
  });
  const run = async expression => {
    const response = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.error || response.result.exceptionDetails) throw Error(JSON.stringify(response));
    return response.result.result.value;
  };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const until = async expression => {
    for (let i = 0; i < 300; i++) { if (await run(expression)) return; await wait(100); }
    throw Error(`Tempo excedido: ${expression}`);
  };
  const tap = async (selector, fraction = .5) => {
    await run(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest',inline:'nearest'})`);
    const rect = await run(`document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().toJSON()`);
    await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rect.x + rect.width * fraction, y: rect.y + rect.height * fraction }] });
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const key = async (key, code) => {
    const windowsVirtualKeyCode = { Tab: 9, Enter: 13, Escape: 27 }[key];
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode,
      ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
  };
  try {
    await call('Runtime.enable');
    await call('Page.bringToFront');
    await call('Emulation.setTouchEmulationEnabled', { enabled: true });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await call('Page.navigate', { url: process.env.SANMD_URL || 'http://localhost:8000' });
    await until('typeof game !== "undefined"');
    await run('game.services.pularCutscene()');
    await until('!game.services.isCutsceneActive()');
    await run('void titleMenu.newGame()');
    await until("game.services.getCurrent() === 'lulith_codigo'");
    await run('game.services.pularCutscene()');
    await until("document.getElementById('title-menu').hidden");
    await run(`game.services.encerrarConversa();
      game.state.localizacao = {local:'delegacia',cena:'delegacia_mesa_mj'};
      game.services.aplicarCena(game.services.obterCenaAtual());
      game.services.adicionarItem('crime_small_key'); game.services.adicionarItem('lulith_phone');
      game.services.removerItem('crime_small_key'); game.services.abrirEstacaoTrabalho();`);
    await until("document.querySelector('.workstation-art').naturalWidth > 0");
    assert.equal(await run("document.querySelector('.workstation-art').naturalWidth"), 1672);
    for (const [width, height] of [[1440, 900], [915, 412], [640, 360], [390, 844]]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
      await wait(150);
      const data = await run(`(() => {
        const controls = [...game.el.workstation.overlay.querySelectorAll('button:not(:disabled),input,textarea,[contenteditable="true"]')];
        const rows = [...game.el.workstation.recentList.children];
        const r = game.el.workstation.map.getBoundingClientRect();
        return {controls: controls.map(x => x.id), disabled: document.querySelectorAll('.workstation-future:disabled').length,
          labels: rows.map(x => x.textContent), mapWidth: r.width, mapHeight: r.height,
          appInert: document.getElementById('app').inert};
      })()`);
      assert.deepEqual(data.controls, ['workstation-map', 'workstation-close']);
      assert.equal(data.disabled, 4);
      assert.equal(data.appInert, true);
      assert.ok(data.mapWidth >= 44 && data.mapHeight >= 44);
      assert.deepEqual(data.labels, ['Chave pequenaDESCARTADO', 'Celular de LulithNA BOLSA']);
      await tap('.workstation-files');
      assert.equal(await run('game.el.worldMap.mapOverlay.hidden'), true);
      const screenshot = await call('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`/tmp/sanmd-pc-${width}x${height}.png`, Buffer.from(screenshot.result.data, 'base64'));
      // Toca dentro da ilustração, longe da chamada "Ver mapa".
      await tap('#workstation-map', .7);
      assert.equal(await run('game.el.worldMap.mapOverlay.hidden'), false);
      await tap('#map-close');
      assert.equal(await run('game.state.modo'), 'interface');
      assert.equal(await run('game.el.workstation.overlay.inert'), false);
      console.log(`Home / mapa / retorno / touch: ${width}×${height} OK`);
    }
    await call('Emulation.setDeviceMetricsOverride', { width: 915, height: 412, deviceScaleFactor: 1, mobile: true });
    await run('game.el.workstation.map.focus()');
    await key('Tab', 'Tab');
    assert.equal(await run('document.activeElement.id'), 'workstation-close');
    await key('Tab', 'Tab');
    assert.equal(await run('document.activeElement.id'), 'workstation-map');
    await key('Enter', 'Enter');
    assert.equal(await run('game.el.worldMap.mapOverlay.hidden'), false);
    await run(`game.el.worldMap.mapLatitude.value = DATA.prototypeAlleyCoordinates.latitude;
      game.el.worldMap.mapLongitude.value = DATA.prototypeAlleyCoordinates.longitude;`);
    await tap('#map-search');
    assert.equal(await run('game.state.worldMap.availableLocations.beco'), true);
    await key('Escape', 'Escape');
    assert.equal(await run('game.el.workstation.overlay.hidden'), false);
    assert.equal(await run('document.activeElement.id'), 'workstation-map');
    await key('Escape', 'Escape');
    assert.equal(await run('game.el.workstation.overlay.hidden'), true);
    assert.equal(await run('game.state.modo'), 'livre');
    assert.equal(await run("document.activeElement.dataset.hotspot"), 'mj_computer');
    assert.deepEqual(errors, []);
    console.log('Tab, Enter, Escape, coordenadas/Beco, foco e ausência de erros: OK');
  } finally {
    await call('Page.close'); socket.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
