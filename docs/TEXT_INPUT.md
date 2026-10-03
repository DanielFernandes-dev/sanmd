# Entrada de texto e teclado virtual

O jogo não usa campos `input` nativos nem o teclado IME do sistema: um teclado
virtual próprio, dentro do celular, digita qualquer texto do jogo. Isso mantém a
identidade visual, evita sobreposição do teclado do SO e elimina o último
diálogo/formulário nativo do fluxo.

## Arquitetura

Dois serviços compartilham o mesmo estado transitório:

- `js/keyboard.js` — `criarSistemaTeclado` (GameKeyboard): renderiza as teclas em
  `#game-keyboard` e o painel de acentos em `#text-entry-accents`. Expõe
  `renderizarTeclado()` e `renderizarAcentos()`.
- `js/text-entry.js` — `criarSistemaEntradaTexto` (TextEntryController): mantém o
  buffer, o cursor e o estado da edição em `state.texto`, renderiza o campo em
  `#text-entry-field` com o contador e o botão de confirmação, e decide o que
  acontece com cada tecla pressionada.

A interação flui por `game.js`: o teclado delega cliques (`dataset.key`) para
`services.pressionarTecla`; a entrada de texto pede o re-render ao teclado. Os
pontos de entrada no jogo chamam `services.abrirEntradaTexto({...})` e ignoram
como o buffer é preenchido.

## Estado

`state.texto` é transitório — nunca vai para o snapshot:

```text
aberto         se uma edição está em andamento
layout         qwerty | numeros
shift          acionado até a próxima letra
buffer         texto digitado
cursor         posição de edição no buffer
painelAcentos  teclado numérico alterna para o painel de acentos
config         confirmLabel, maxLength, allowEmpty e callbacks de confirmação
```

`capturarEstadoJogo()` não captura `state.texto`; ao restaurar qualquer save a
edição é fechada e o estado resetado.

## Abrir, confirmar e cancelar

```js
services.abrirEntradaTexto({
  confirmLabel: "Enviar",
  maxLength: 160,
  allowEmpty: false,
  aoConfirmar: (valor) => enviarMensagemJogador(valor),
  aoCancelar: () => { ... },
  aoAlterar: (valor) => { ... }
});
```

- `abrirEntradaTexto` recusa abrir sobre uma edição em andamento.
- Enquanto aberta, `#phone-screen` recebe `texto-aberto` e as seções do
  aplicativo ficam com `pointer-events: none`; o botão Voltar continua ativo.
- `confirmarEntradaTexto` valida `allowEmpty`, entrega o valor com espaços das
  pontas removidos e fecha a edição antes de chamar `aoConfirmar`.
- `cancelarEntradaTexto` descarta o draft e chama `aoCancelar`.
- Botão Voltar (`voltarCelular`), fechar o celular e `ocultarTelasCelular`
  sempre encerram a edição primeiro.

## Teclado

Layouts:

```text
QWERTY   q w e r t y u i o p
         a s d f g h j k l
         ⇧ z x c v b n m ⌫
         123  ÁÇ  ESPAÇO  OK

Números  1 2 3 4 5 6 7 8 9 0
         - _ . , ! ? @ # : ;
         abc  ⌫  ESPAÇO  OK
```

- `⇧` mantém a maiúscula até a próxima letra, depois volta para minúsculas.
- `ÁÇ` abre/ fecha o painel de acentos com `á à â ã é ê í ó ô õ ú ç`
  (maiúsculas quando shift ativo). Escolher um acento insere e fecha o painel.
- Espaço e símbolos não resetam o shift.
- `OK` recebe o rótulo de `confirmLabel` e fica desabilitado enquanto o buffer
  estiver vazio (quando `allowEmpty` é falso).
- `maxLength` bloqueia novas inserções; o contador `x/max` fica vermelho no
  limite.

## Teclado físico

Enquanto a edição está aberta, o listener global de `keydown` em `events.js`
desvia as teclas para `services.tratarTecladoFisico`: Enter confirma, Esc
cancela, Backspace apaga, setas movem o cursor e letras/símbolos digitam. Como
não existe `input` focado, o IME do sistema nunca abre.

## Contextos integrados

### Galeria

`#gallery-photo-name` é um botão ("Toque para nomear") e `#gallery-photo-form`
não é mais formulário. `abrirEditorNomeFoto` abre a edição com
`maxLength: CONFIG.tamanhoNomeFoto` (28) e confirmação "OK"; confirmar chama
`confirmarFoto`, cancelar volta ao preview sem descartar a captura e CANCELAR
do preview descarta a captura.

### Mensagens

`#messages-composer` fica irmão de `#messages-choices`, visível quando o reset
remoto não terminou. `abrirEditorMensagem` usa `maxLength: CONFIG.tamanhoMensagem`
(160) e "Enviar"; confirmar adiciona `{ autor: "protagonista", texto }` ao
histórico através do sistema de celular — o teclado não mexe no histórico.

### Enigma de identidade

`#identity-answer` é um botão que abre `abrirEditorIdentidade` enquanto o reset
está agendado. O editor limita a resposta a 12 caracteres e envia o texto para
`resolverEnigmaIdentidade` ao confirmar. Uma tentativa inválida permite abrir o
teclado novamente; após `ELA`, o botão fica desabilitado.

## Persistência e acessibilidade

- O estado do teclado não é persistido e o dock é fechado ao restaurar, voltar,
  fechar o celular ou trocar de tela.
- O cursor pisca com animação desativada em `prefers-reduced-motion`.
- A test suite `test/text-input.test.js` cobre galeria, mensagens, limites,
  shift, layouts, acentos, teclado físico e snapshot.
