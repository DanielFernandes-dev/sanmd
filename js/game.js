(function () {
  'use strict';

  var PIN = '3141';
  var FRAG_HEX = '46 52 41 47 5F 31 3D 4B 58 38 41 2D 37 51 4C 32';
  var FRAG_TEXT = 'FRAG_1=KX8A-7QL2';

  var state = {
    ato: 1,
    pickedUp: false,
    unlocked: false,
    noteRead: false,
    scanned: false,
    tut: 0,
    fragments: 0,
    total: 3,
    keys: [],
    isolated: true,
    timeRemaining: 90,
    neighbor: 'none',
    chatLog: [],
    badge: 0
  };

  var el = {};
  var pinBuffer = '';
  var chatOpen = false;

  function $(s) { return document.querySelector(s); }

  function bind() {
    el.game = $('#game');
    el.hudAto = $('#hud-ato');
    el.hudFrag = $('#hud-frag');
    el.hudSolo = $('#hud-solo');
    el.hudTimer = $('#hud-timer');
    el.btnDev = $('#btn-dev');
    el.sceneName = $('#scene-name');
    el.dialog = $('#dialog');
    el.dialogName = $('#dialog-name');
    el.dialogText = $('#dialog-text');
    el.dialogNext = $('#dialog-next');
    el.phone = $('#phone');
    el.phoneClose = $('#phone-close');
    el.lockScreen = $('#lock-screen');
    el.homeScreen = $('#home-screen');
    el.appScreen = $('#app-screen');
    el.appTitle = $('#app-title');
    el.appBack = $('#app-back');
    el.appBody = $('#app-body');
    el.lockHint = $('#lock-hint');
    el.lockDots = el.lockScreen.querySelectorAll('.lock-dots span');
    el.chatBadge = $('#chat-badge');
    el.terminal = $('#terminal');
    el.termOut = $('#term-out');
    el.termIn = $('#term-in');
    el.termClose = $('#term-close');
    el.termLock = $('#term-lock');
    el.termLockClose = $('#term-lock-close');
    el.itemModal = $('#item-modal');
    el.itemTitle = $('#item-title');
    el.itemBody = $('#item-body');
    el.itemClose = $('#item-close');
    el.epilogue = $('#epilogue');
    el.epiText = $('#epi-text');
    el.epiRestart = $('#epi-restart');
    el.toasts = $('#toasts');
    el.dev = $('#dev');
    el.devState = $('#dev-state');
    el.devIsolate = $('#dev-isolate');
    el.devFrag = $('#dev-frag');
    el.devReset = $('#dev-reset');

    el.room = $('#room');
    var props = el.room.querySelectorAll('.prop');
    for (var i = 0; i < props.length; i++) {
      props[i].addEventListener('click', function () {
        onPropClick(this.getAttribute('data-prop'));
      });
    }

    el.dialog.addEventListener('click', dialogNext);
    el.phoneClose.addEventListener('click', hidePhone);
    el.keypad = $('#keypad');
    el.keypad.addEventListener('click', onKeypad);
    el.appBack.addEventListener('click', function () { chatOpen = false; showScreen('home'); });
    el.termClose.addEventListener('click', closeTerminal);
    el.termLockClose.addEventListener('click', closeTerminal);
    el.termIn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { runTermCommand(el.termIn.value); el.termIn.value = ''; }
    });
    el.itemClose.addEventListener('click', hideModal);
    el.itemModal.addEventListener('click', function (e) {
      if (e.target === el.itemModal) hideModal();
    });
    el.epiRestart.addEventListener('click', function () { location.reload(); });
    el.btnDev.addEventListener('click', toggleDev);
    el.devIsolate.addEventListener('click', function () {
      state.isolated = !state.isolated;
      updateHUD();
      toast('Isolamento: ' + (state.isolated ? 'SOLO' : 'PRESENÇA'));
    });
    el.devFrag.addEventListener('click', function () {
      if (state.fragments < state.total) {
        state.fragments++;
        state.keys.push('DBG-' + state.fragments);
        updateHUD();
        toast('DEBUG: fragmento +1');
      }
    });
    el.devReset.addEventListener('click', function () { location.reload(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeTerminal(); hideModal(); return; }
      if (e.key === 'd' || e.key === 'D') {
        var t = document.activeElement && document.activeElement.tagName;
        if (t !== 'INPUT') toggleDev();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (!el.dialog.classList.contains('hidden')) dialogNext();
      }
    });

    window.addEventListener('resize', fit);
  }

  function fit() {
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    el.game.style.transform = 'scale(' + s + ')';
    el.game.style.marginLeft = ((window.innerWidth - 1280 * s) / 2) + 'px';
    el.game.style.marginTop = ((window.innerHeight - 720 * s) / 2) + 'px';
  }

  function updateHUD() {
    el.hudAto.textContent = state.neighbor === 'done' ? 'ATO 1 — COMPLETO' : 'ATO 1 — A CURIOSIDADE';
    el.hudFrag.textContent = 'FRAGMENTOS: ' + state.fragments + '/' + state.total;
    el.hudTimer.textContent = 'TEMPO: ' + state.timeRemaining + 's';
    el.hudSolo.textContent = state.isolated ? 'SOLO — TERMINAL LIVRE' : 'PRESENÇA — BLOQUEADO';
    el.hudSolo.style.color = state.isolated ? '#3cff78' : '#ff5f5f';
  }

  function toast(msg, ms) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    el.toasts.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transition = 'opacity .4s';
      setTimeout(function () { t.remove(); }, 420);
    }, ms || 2600);
  }

  /* ---------------- dialog system ---------------- */

  var dialogQueue = [];
  var dialogIdx = 0;
  var dialogTyping = null;
  var dialogDone = null;

  function showDialog(name, lines, onDone) {
    dialogQueue = lines.slice();
    dialogIdx = 0;
    dialogDone = onDone || null;
    el.dialogName.textContent = name;
    el.dialog.classList.remove('hidden');
    typeLine();
  }

  function typeLine() {
    var text = dialogQueue[dialogIdx];
    el.dialogText.textContent = '';
    el.dialogNext.classList.add('dim');
    var i = 0;
    dialogTyping = setInterval(function () {
      i++;
      el.dialogText.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(dialogTyping);
        dialogTyping = null;
        el.dialogNext.classList.remove('dim');
      }
    }, 16);
  }

  function dialogNext() {
    if (dialogTyping) {
      clearInterval(dialogTyping);
      dialogTyping = null;
      el.dialogText.textContent = dialogQueue[dialogIdx];
      el.dialogNext.classList.remove('dim');
      return;
    }
    dialogIdx++;
    if (dialogIdx < dialogQueue.length) {
      typeLine();
    } else {
      el.dialog.classList.add('hidden');
      var cb = dialogDone;
      dialogDone = null;
      if (cb) cb();
    }
  }

  /* ---------------- modal ---------------- */

  function showModal(title, body) {
    el.itemTitle.textContent = title;
    el.itemBody.textContent = body;
    el.itemModal.classList.remove('hidden');
  }
  function hideModal() {
    el.itemModal.classList.add('hidden');
  }

  /* ---------------- scene props ---------------- */

  function onPropClick(prop) {
    if (prop === 'phone') {
      if (!state.pickedUp) pickUpPhone();
      else openPhone();
      return;
    }
    if (prop === 'shelf') {
      if (!state.noteRead) {
        state.noteRead = true;
        showModal(DATA.items.shelf.title, DATA.items.shelf.body);
        DATA.notes.push({ title: 'Bilhete da estante', body: 'wi-fi: pi sem o ponto (3141)\ncelular novo: mesmo PIN.' });
        toast('Nota adicionada ao bloco de notas');
      } else {
        showModal(DATA.items.shelf.title, DATA.items.shelf.body);
      }
      return;
    }
    if (prop === 'laptop') {
      showModal(DATA.items.laptop.title, DATA.items.laptop.body);
      return;
    }
    if (prop === 'window') {
      showModal(DATA.items.window.title, DATA.items.window.body);
      return;
    }
    if (prop === 'door') {
      if (state.neighbor === 'none') {
        showModal(DATA.items.door.title, DATA.items.door.body);
      } else if (state.neighbor === 'done') {
        showModal(DATA.items.doorDone.title, DATA.items.doorDone.body);
      }
      return;
    }
  }

  function pickUpPhone() {
    state.pickedUp = true;
    var dp = el.room.querySelector('.phone-prop');
    if (dp) dp.classList.add('taken');
    showDialog('CONSULTOR', DATA.pickup, function () {
      openPhone();
      toast('Celular bloqueado. O PIN pode estar no bilhete da estante.');
    });
  }

  /* ---------------- phone ---------------- */

  function openPhone() {
    el.phone.classList.remove('off');
    if (state.unlocked) showScreen('home');
    else showScreen('lock');
  }
  function hidePhone() {
    el.phone.classList.add('off');
  }

  function showScreen(name) {
    el.lockScreen.classList.add('hidden');
    el.homeScreen.classList.add('hidden');
    el.appScreen.classList.add('hidden');
    if (name === 'lock') el.lockScreen.classList.remove('hidden');
    else if (name === 'home') el.homeScreen.classList.remove('hidden');
    else if (name === 'app') el.appScreen.classList.remove('hidden');
  }

  function renderDots() {
    for (var i = 0; i < 4; i++) {
      el.lockDots[i].classList.toggle('filled', i < pinBuffer.length);
    }
  }

  function onKeypad(e) {
    var b = e.target;
    if (b.tagName !== 'BUTTON') return;
    var k = b.getAttribute('data-k');
    if (k === 'back') {
      pinBuffer = pinBuffer.slice(0, -1);
    } else if (k === 'ok') {
      checkPin();
      return;
    } else {
      if (pinBuffer.length < 4) pinBuffer += k;
    }
    renderDots();
    if (pinBuffer.length === 4) checkPin();
  }

  function checkPin() {
    if (pinBuffer === PIN) {
      pinBuffer = '';
      renderDots();
      unlockPhone();
    } else {
      pinBuffer = '';
      renderDots();
      el.lockHint.classList.add('error');
      el.lockHint.textContent = 'Código incorreto. Tente o bilhete da estante.';
      setTimeout(function () {
        el.lockHint.classList.remove('error');
        el.lockHint.textContent = 'Dica: o PIN está no bilhete da estante.';
      }, 2200);
    }
  }

  function unlockPhone() {
    state.unlocked = true;
    showScreen('home');
    toast('Nova mensagem de número desconhecido.');
    setTimeout(function () {
      playChatSequence(DATA.chat.init);
    }, 800);
  }

  /* ---------------- apps ---------------- */

  function bindApps() {
    var apps = el.homeScreen.querySelectorAll('.app');
    for (var i = 0; i < apps.length; i++) {
      apps[i].addEventListener('click', function () {
        appOpen(this.getAttribute('data-app'));
      });
    }
  }

  function appOpen(name) {
    if (name === 'chat') {
      chatOpen = true;
      state.badge = 0;
      el.chatBadge.classList.add('hidden');
      showApp('CHAT', buildChat);
      renderChat();
      focusChatInput();
    } else if (name === 'galeria') {
      chatOpen = false;
      showApp('GALERIA', buildGaleria);
    } else if (name === 'notas') {
      chatOpen = false;
      showApp('NOTAS', buildNotas);
    } else if (name === 'ajustes') {
      chatOpen = false;
      showApp('AJUSTES', buildAjustes);
    } else if (name === 'terminal') {
      chatOpen = false;
      openTerminal();
    }
  }

  function showApp(title, builder) {
    el.appTitle.textContent = title;
    el.appBody.innerHTML = '';
    el.appBody.className = 'app-body';
    builder();
    showScreen('app');
  }

  function buildChat() {
    el.appBody.classList.add('app-body');
    var msgs = document.createElement('div');
    msgs.className = 'chat-msgs';
    el.appBody.appendChild(msgs);
    var row = document.createElement('div');
    row.className = 'chat-input-row';
    var input = document.createElement('input');
    input.placeholder = 'Digite sua mensagem...';
    var send = document.createElement('button');
    send.textContent = '>';
    row.appendChild(input);
    row.appendChild(send);
    el.appBody.appendChild(row);
    el.chatMsgs = msgs;
    el.chatInput = input;
    el.chatSend = send;

    send.addEventListener('click', function () { sendChat(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendChat();
    });
  }

  function focusChatInput() {
    setTimeout(function () {
      if (el.chatInput) el.chatInput.focus();
    }, 60);
  }

  function sendChat() {
    var v = (el.chatInput && el.chatInput.value.trim()) || '';
    if (!v) return;
    pushChat('me', v);
    el.chatInput.value = '';
    setTimeout(function () {
      if (state.tut === 0) pushChat('them', 'Direto ao ponto: abra o Terminal e digite help.');
      else pushChat('them', 'Siga as instruções no terminal. O tempo não é nosso aliado.');
    }, 900);
  }

  function addTyping() {
    var b = document.createElement('div');
    b.className = 'bub them typing';
    b.innerHTML = '<span></span><span></span><span></span>';
    if (el.chatMsgs) {
      el.chatMsgs.appendChild(b);
      el.chatMsgs.scrollTop = el.chatMsgs.scrollHeight;
    }
    return b;
  }

  function pushChat(from, text, silent, replaceEl) {
    state.chatLog.push({ from: from, text: text });
    if (replaceEl && replaceEl.parentNode) {
      var rep = document.createElement('div');
      rep.className = 'bub ' + (from === 'them' ? 'them' : 'me');
      rep.textContent = text;
      replaceEl.parentNode.replaceChild(rep, replaceEl);
      if (el.chatMsgs) el.chatMsgs.scrollTop = el.chatMsgs.scrollHeight;
      return;
    }
    if (chatOpen && el.chatMsgs) {
      var b = document.createElement('div');
      b.className = 'bub ' + (from === 'them' ? 'them' : 'me');
      b.textContent = text;
      el.chatMsgs.appendChild(b);
      el.chatMsgs.scrollTop = el.chatMsgs.scrollHeight;
    }
    if (!chatOpen) {
      state.badge++;
      el.chatBadge.textContent = String(state.badge);
      el.chatBadge.classList.remove('hidden');
      if (!silent) toast('Nova mensagem.');
    }
  }

  function renderChat() {
    if (!el.chatMsgs) return;
    el.chatMsgs.innerHTML = '';
    for (var i = 0; i < state.chatLog.length; i++) {
      var m = state.chatLog[i];
      var b = document.createElement('div');
      b.className = 'bub ' + (m.from === 'them' ? 'them' : 'me');
      b.textContent = m.text;
      el.chatMsgs.appendChild(b);
    }
    el.chatMsgs.scrollTop = el.chatMsgs.scrollHeight;
  }

  function playChatSequence(list, done) {
    var i = 0;
    (function step() {
      if (i >= list.length) { if (done) done(); return; }
      var m = list[i++];
      var tb = null;
      if (m.from === 'them') tb = addTyping();
      setTimeout(function () {
        pushChat(m.from, m.text, true, tb);
        setTimeout(step, 750);
      }, 500);
    })();
  }

  function buildGaleria() {
    var grid = document.createElement('div');
    grid.className = 'gal-grid';
    for (var i = 0; i < DATA.gallery.length; i++) {
      var g = DATA.gallery[i];
      var tile = document.createElement('div');
      tile.className = 'gal-tile';
      var img = document.createElement('div');
      img.className = 'gal-img ' + g.cls;
      var cap = document.createElement('div');
      cap.className = 'gal-caption';
      var t = document.createElement('div');
      t.style.color = '#ffd76a';
      t.style.letterSpacing = '1px';
      t.style.marginBottom = '4px';
      t.textContent = g.title;
      cap.appendChild(t);
      cap.appendChild(document.createTextNode(g.caption));
      tile.appendChild(img);
      tile.appendChild(cap);
      grid.appendChild(tile);
    }
    el.appBody.appendChild(grid);
  }

  function buildNotas() {
    for (var i = 0; i < DATA.notes.length; i++) {
      var n = DATA.notes[i];
      var card = document.createElement('div');
      card.className = 'note-card';
      var t = document.createElement('div');
      t.className = 'note-title';
      t.textContent = n.title;
      var b = document.createElement('div');
      b.className = 'note-body';
      b.textContent = n.body;
      card.appendChild(t);
      card.appendChild(b);
      el.appBody.appendChild(card);
    }
  }

  function buildAjustes() {
    var rows = [
      ['Proprietário', 'Desconhecido'],
      ['IMEI', '000000000000000'],
      ['Rede', 'POL-INTERNA'],
      ['Última sincronização', '23:47'],
      ['Travas de segurança', '4 / 4 ativas'],
      ['Sensores', 'Térmico + radar (on)']
    ];
    for (var i = 0; i < rows.length; i++) {
      var r = document.createElement('div');
      r.className = 'set-row';
      var k = document.createElement('span');
      k.className = 'set-key';
      k.textContent = rows[i][0];
      var v = document.createElement('span');
      v.className = 'set-val';
      v.textContent = rows[i][1];
      r.appendChild(k);
      r.appendChild(v);
      el.appBody.appendChild(r);
    }
  }

  /* ---------------- terminal ---------------- */

  function openTerminal() {
    el.terminal.classList.remove('hidden');
    if (!state.isolated) {
      el.termLock.classList.remove('hidden');
      el.termIn.blur();
      return;
    }
    el.termLock.classList.add('hidden');
    if (!el.termOut.children.length) printBanner();
    el.termIn.value = '';
    el.termIn.focus();
  }

  function closeTerminal() {
    el.terminal.classList.add('hidden');
  }

  function printBanner() {
    termLine('FONTE OCULTA v0.1 — TERMINAL SEGURO', 'info');
    termLine('Conexão: POL-CORE/7 // enlace criptografado', 'info');
    termLine('Digite "help" para listar os comandos.', '');
    termLine('');
  }

  function termLine(text, cls) {
    var d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.textContent = text;
    el.termOut.appendChild(d);
    el.termOut.scrollTop = el.termOut.scrollHeight;
  }

  function runTermCommand(raw) {
    var cmd = raw.trim();
    var norm = cmd.toLowerCase();
    if (!norm) return;
    if (norm === 'clear') {
      el.termOut.innerHTML = '';
      return;
    }
    termLine('consultor@pc:~$ ' + cmd, 'inp');
    if (norm === 'sair' || norm === 'quit' || norm === 'exit' || norm === 'close') {
      closeTerminal();
      return;
    }
    var out = exec(cmd);
    for (var i = 0; i < out.length; i++) {
      termLine(out[i]);
    }
  }

  function hexToText(s) {
    var clean = s.replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2) return null;
    var out = '';
    for (var i = 0; i < clean.length; i += 2) {
      out += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
    }
    for (var j = 0; j < out.length; j++) {
      var c = out.charCodeAt(j);
      if (c < 32 || c > 126) return null;
    }
    return out;
  }

  function b64ToText(s) {
    var clean = s.replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/]+=*$/.test(clean)) return null;
    try {
      var bin = atob(clean);
      for (var j = 0; j < bin.length; j++) {
        var c = bin.charCodeAt(j);
        if (c < 32 || c > 126) return null;
      }
      return bin;
    } catch (e) { return null; }
  }

  function exec(cmd) {
    var parts = cmd.split(/\s+/);
    var op = (parts[0] || '').toLowerCase();
    var out = [];

    if (op === 'help') {
      out.push('Comandos disponíveis:');
      out.push('  help            Lista estes comandos');
      out.push('  status          Estado do sistema');
      out.push('  decode <arg>    Decodifica hex ou base64');
      out.push('  scan            Varre a rede por fragmentos');
      out.push('  keys            Lista chaves coletadas');
      out.push('  decrypt         Tenta descriptografar (exige chaves)');
      out.push('  ls              Lista arquivos locais');
      out.push('  whoami          Identidade da sessão');
      out.push('  checkin         Ping no servidor central');
      out.push('  clear           Limpa a tela');
      out.push('  sair            Fecha o terminal');
      if (state.tut === 0) {
        out.push('');
        out.push('O remetente pediu um primeiro passo. O que ele mandou?', 'warn');
      }
      return out;
    }

    if (op === 'status') {
      out.push('=== ESTADO DO SISTEMA ===');
      out.push(' Ato atual        : ' + state.ato);
      out.push(' Fragmentos       : ' + state.fragments + '/' + state.total);
      out.push(' Chaves           : ' + state.keys.length);
      out.push(' Tempo restante   : ' + state.timeRemaining + 's (relevante no Ato 3)');
      out.push(' Isolamento       : ' + (state.isolated ? 'SOLO — permitido' : 'PRESENÇA — bloqueado'));
      out.push(' Acesso terminal  : ' + (state.isolated ? 'LIBERADO' : 'BLOQUEADO'));
      return out;
    }

    if (op === 'decode') {
      var arg = parts.slice(1).join(' ');
      if (!arg) {
        out.push('Uso: decode <texto hex ou base64>');
        return out;
      }
      var dec = hexToText(arg);
      var mode = 'hex';
      if (dec === null) {
        dec = b64ToText(arg);
        mode = 'base64';
      }
      if (dec === null) {
        out.push('Formato não suportado. Aceito: hex (ex: 48 69) ou base64.', 'warn');
        return out;
      }
      out.push('decodificado [' + mode + ']: ' + dec, 'accent');
      handleDecoded(dec);
      return out;
    }

    if (op === 'scan') {
      if (state.tut === 0) {
        out.push('Nada a escanear ainda. Decodifique a mensagem do remetente primeiro.', 'warn');
        return out;
      }
      if (state.scanned) {
        out.push('Nenhum novo sinal. O pacote já foi retido.');
        return out;
      }
      state.scanned = true;
      state.tut = 2;
      playChatSequence(DATA.chat.afterScan);
      out.push('SCAN [2.4GHz]...');
      out.push('[OK] Rede POL-INTERNA detectada');
      out.push('[OK] Nó ativo: 192.168.0.7 (dispositivo anônimo)');
      out.push('[!] Pacote retido — conteúdo codificado em HEX:');
      out.push('');
      out.push('  ' + FRAG_HEX, 'accent');
      out.push('');
      out.push('> decode <pacote>');
      return out;
    }

    if (op === 'keys') {
      if (state.keys.length === 0) {
        out.push('Nenhuma chave coletada.');
      } else {
        out.push('Chaves registradas:');
        for (var k = 0; k < state.keys.length; k++) out.push('  ' + state.keys[k], 'accent');
      }
      return out;
    }

    if (op === 'decrypt') {
      var need = state.total - state.keys.length;
      if (need === 0) out.push('Tudo descriptografado. O código do vírus está ao alcance.');
      else out.push('Descriptografia requer ' + need + ' fragmento(s). Atual: ' + state.keys.length + '/' + state.total + '.', 'warn');
      return out;
    }

    if (op === 'ls') {
      out.push('areas/  boletins/  fragmentos.log  virus_notes.txt  quem_e_c.txt');
      return out;
    }

    if (op === 'whoami') {
      out.push('consultor.ced.sp.gov.br — Consultor Técnico (nível 2)');
      return out;
    }

    if (op === 'checkin') {
      out.push('POL-CORE/7 respondeu em 3ms.');
      out.push('Rastreio ativo: NÃO. Modo furtivo: ATIVO.');
      return out;
    }

    out.push('comando não reconhecido: ' + op + ' — digite help.');
    return out;
  }

  function handleDecoded(dec) {
    if (state.tut === 0 && dec === 'TESTE') {
      state.tut = 1;
      playChatSequence(DATA.chat.afterDecode);
      return;
    }
    if (state.tut === 2 && dec === FRAG_TEXT) {
      collectFragment();
    }
  }

  function collectFragment() {
    state.fragments = 1;
    state.keys.push('KX8A-7QL2');
    state.tut = 3;
    updateHUD();
    toast('FRAGMENTO 1/3 COLETADO');
    playChatSequence(DATA.chat.afterFragment, function () {
      setTimeout(startNeighbor, 1500);
    });
  }

  /* ---------------- neighbor / sensory lock demo ---------------- */

  function startNeighbor() {
    if (state.neighbor !== 'none') return;
    state.neighbor = 'in';
    showDialog('VIZINHA', DATA.neighbor.enter, function () {
      state.isolated = false;
      state.neighbor = 'in2';
      updateHUD();
      toast('PRESENÇA DETECTADA — TRAVA SENSORIAL ATIVADA');
      showDialog('VIZINHA', DATA.neighbor.smalltalk, function () {
        showDialog('VIZINHA', DATA.neighbor.leave, function () {
          state.isolated = true;
          state.neighbor = 'done';
          updateHUD();
          toast('A vizinha foi embora. Você está sozinho — terminal liberado.');
          setTimeout(finishAto1, 1400);
        });
      });
    });
  }

  function finishAto1() {
    el.epiText.innerHTML =
      '<b>Resumo do Ato 1</b><br/>' +
      '· Fragmentos coletados: ' + state.fragments + '/' + state.total + '<br/>' +
      '· Chave registrada: KX8A-7QL2<br/>' +
      '· Trava sensorial: TESTADA (terminal bloqueado durante presença)<br/>' +
      '· Terminal: DOMINADO<br/><br/>' +
      'O remetente disse que isto é só o começo. No Ato 2, você será isolado dos superiores; no Ato 3, o rastreio policial ativa o cronômetro e as decisões definem qual dos 3 finais você atinge.<br/><br/>' +
      '<b>Fim do protótipo — Ato 1 completo.</b>';
    el.epilogue.classList.remove('hidden');
    el.hudAto.textContent = 'ATO 1 — COMPLETO';
  }

  /* ---------------- dev ---------------- */

  function toggleDev() {
    el.dev.classList.toggle('hidden');
    if (!el.dev.classList.contains('hidden')) updateDev();
  }

  function updateDev() {
    el.devState.textContent = JSON.stringify(state, null, 2);
  }

  function tick() {
    if (!el.dev.classList.contains('hidden')) updateDev();
  }

  /* ---------------- boot ---------------- */

  function boot() {
    bind();
    bindApps();
    fit();
    updateHUD();
    showDialog('CONSULTOR', DATA.intro, function () {
      toast('Toque nos objetos da sala para investigar.');
    });
    setInterval(tick, 800);
  }

  boot();
})();
