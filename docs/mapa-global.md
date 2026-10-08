# Home do PC e mapa global

A mesa da MJ usa `mj_computer` (`interact`) para persistir `computerOn`
no `sceneState` e abrir a estação de trabalho. Não depende do bilhete.
MAPA é o único aplicativo habilitado. O bilhete (`examine`) pode ser relido;
`noteRead` passa pelo mesmo pipeline de alterações e autosave dos hotspots.

## Responsabilidades

- `js/workstation.js`: abre/fecha a estação, apresenta atividade da Bolsa e devolve o foco ao PC.
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

## Interface visual

A Home usa `assets/interfaces/layout-pc-mj.png` na moldura proporcional 1672×941.
O card MAPA inteiro chama `abrirMapaGlobal({ source: "delegacia_computer" })`.
Voltar ou Escape no mapa retorna à Home, mantém a cena bloqueada e consulta
novamente a atividade da Bolsa. Fechar usa `fecharEstacaoTrabalho()`.

Arquivos, Pessoas, Evidências e Relatórios são botões `disabled`, sem handlers,
com rótulo INDISPONÍVEL cobrindo as chamadas da arte. Anotações é uma seção
estática sem editor. Atividade recente cobre integralmente os dados ilustrativos
da imagem e consulta `obterAtividadeInventario()`; não possui ações nem links.
Exibe quatro registros; excedentes deslizam verticalmente segundo `CONFIG.atividadePc`.
A rotação para ao abrir o mapa, fechar o PC, carregar um save, ocultar a aba ou
ativar reduced motion. A posição visual e os timers ficam fora do snapshot.

O teclado virtual existente edita os campos tanto por toque quanto por Enter
ou Espaço. Escape cancela a edição, depois volta à estação e depois fecha o PC.
`assets/sprites/mapa-sem-beco.png` é a camada visual do mapa (1672×941), uma cópia
editada da arte original `mapa.png` sem o ícone fixo do Beco. Os inputs,
o botão Localizar, os quatro marcadores e o feedback permanecem elementos HTML
na mesma moldura proporcional. `mapPosition` em `DATA.worldMapLocations` guarda
apenas a posição visual dos marcadores, em porcentagem; não altera as coordenadas
do bilhete. A imagem é pré-carregada pelo navegador e uma falha de carregamento
mostra os mesmos controles sobre um fundo simples.

Locais disponíveis são verdes; bloqueados são cinza e desabilitados; o local
atual é azul e não aceita viagem. O Beco é a exceção visual: seu botão inteiro,
incluindo ícone e rótulo, permanece oculto até a confirmação das coordenadas
corretas em Localizar. A visibilidade usa `worldMap.availableLocations.beco`,
incluindo o desbloqueio restaurado por Save/Load. Rótulos acessíveis indicam cada estado.

## Atualização da interface

Os marcadores e seus listeners são criados uma única vez na inicialização.
Abrir o mapa, localizar o Beco e bloquear uma viagem atualizam os mesmos botões,
lendo a localização e a disponibilidade atuais do estado, inclusive após Load.
A consulta de destinos usa o registro de marcadores, sem percorrer o catálogo
em cada seleção. A edição e a normalização de coordenadas são funções internas
do módulo de mapa.

## Verificação da Home

`npm test` cobre inventário/histórico, saves legados e inválidos, retorno do mapa,
uso consumível/reutilizável e ciclo de vida dos timers. Com o jogo servido em
`localhost:8000` e um Chromium de teste com depuração remota em `localhost:9222`,
`node scripts/check-workstation.cjs` verifica toque, Tab/Enter/Escape, foco,
coordenadas e quatro viewports (1440×900, 915×412, 640×360 e 390×844).
O script usa uma nova aba e grava screenshots em `/tmp/sanmd-pc-LARGURAxALTURA.png`.
`SANMD_URL` e `CDP_URL` permitem outros endereços. A validação em dispositivo
Android continua sendo necessária para confirmar o comportamento no APK.

## Integração futura

Inserir a apresentação de fast travel em `travelToWorldLocation`, depois de
validar e fechar as interfaces, antes de chamar `irParaLocal`. Manter o bloqueio
contra concorrência durante toda a apresentação. O mapa não precisa conhecer
cenas internas nem implementar outra transição. Nesta fase não há GIF, boot
complexo ou aplicativos secundários funcionais.
