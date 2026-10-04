# PC e mapa global — protótipo funcional

A mesa da MJ usa `mj_computer` (`interact`) para persistir `computerOn`
no `sceneState` e abrir a estação de trabalho. Não depende do bilhete.
MAPA é o único aplicativo habilitado. O bilhete (`examine`) pode ser relido;
`noteRead` passa pelo mesmo pipeline de alterações e autosave dos hotspots.

## Responsabilidades

- `js/workstation.js`: abre/fecha a estação e devolve o foco ao PC.
- `js/world-map.js`: apresenta os locais, recebe coordenadas, desbloqueia
  o Beco e encaminha a seleção. `abrirMapaGlobal({ source })` aceita outras
  interfaces; `source` não modifica as regras de disponibilidade.
- `js/world-travel.js`: `travelToWorldLocation(localId)` revalida o destino,
  impede viagens concorrentes, fecha as interfaces e chama `irParaLocal`.
- `js/scene.js`: `irParaLocal` resolve exclusivamente `DATA.locais[localId].cenaInicial`
  e usa o controlador de transições existente. O menu Ir para mantém suas conexões.

## Dados e persistência

`DATA.worldMapLocations` contém apenas os locais e sua apresentação.
`state.worldMap.availableLocations` é a fonte única de disponibilidade.
`DATA.prototypeAlleyCoordinates` alimenta o bilhete e o validador.
Espaços, caixa das letras, símbolos de grau e aspas equivalentes são tolerados.
A resposta correta mantém o mapa aberto; viajar exige selecionar o destino.
Repetir a resposta não grava outro autosave de desbloqueio.

Snapshots incluem o mapa e os estados da mesa, mas não formulários,
foco, teclado aberto ou painéis. Saves sem mapa recebem disponibilidade
compatível com sua progressão; Beco começa bloqueado. Visitas autorizadas à
cena do crime e Delegacia atualizam a disponibilidade desses locais.

## Interface provisória

O teclado virtual existente edita os campos tanto por toque quanto por Enter
ou Espaço. Escape cancela a edição, depois volta à estação e depois fecha o PC.
Locais disponíveis são verdes; bloqueados são cinza e desabilitados; o local
atual tem estilo próprio e não aceita viagem. Rótulos acessíveis indicam cada estado.

## Integração futura

Inserir a apresentação de fast travel em `travelToWorldLocation`, depois de
validar e fechar as interfaces, antes de chamar `irParaLocal`. Manter o bloqueio
contra concorrência durante toda a apresentação. O mapa não precisa conhecer
cenas internas nem implementar outra transição. Nesta fase não há GIF, boot
complexo, arte final ou aplicativos secundários.
