# TODO — Ato I — A Curiosidade

> Roadmap exclusivo do primeiro ato de **Sim, Acredite nas Mentiras Dele kk**.
>
> Fontes: [`GDD.md`](GDD.md), [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) e [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md).
>
> Objetivo do Ato I: apresentar MJ, James, investigação point-and-click, nota, coordenadas, cofre, celular, Lulith e os principais sistemas de gameplay.

> Atualização de implementação: **05/10/2026**. Ver [estado consolidado](docs/STATUS_PROJETO.md).

## Limites do escopo

- [x] Tratar o Ato I como tutorial e início da trama principal.
- [x] Manter MJ como protagonista feminina cujo nome real é escolhido pelo jogador.
- [x] Manter Lulith como dona do celular, sem romance entre ela e MJ.
- [x] Manter William James como amigo, antigo professor e colega de MJ.
- [x] Ambientar o ato em São Paulo.
- [x] Usar pixel art, personagens 2D e assets provisórios nos Protótipos 1 e 2.
- [ ] Não transformar conceitos provisórios em decisões definitivas durante a implementação.
- [ ] Não incluir no escopo a estrutura completa do Ato II ou dos atos posteriores.
- [ ] Não incluir no escopo o final verdadeiro, o ARG completo ou o sistema completo de 100%.
- [ ] Não definir designs canônicos antes do Protótipo 3.

## Fase 0 — Consolidar a fundação existente

### Sistemas disponíveis

- [x] Criar cena base de Visual Novel.
- [x] Criar caixa de diálogo com efeito de digitação.
- [x] Permitir avanço por clique, `Enter` e espaço.
- [x] Implementar os modos livre, diálogo, celular e bolsa.
- [x] Implementar o botão Conversar para diálogos presenciais ou monólogos.
- [x] Implementar celular com tela inicial e navegação contextual.
- [x] Implementar o aplicativo Mensagens.
- [x] Implementar respostas selecionáveis e ramificações curtas.
- [x] Implementar cooldown, indicador `digitando...` e entrega sequencial.
- [x] Preservar o histórico de mensagens durante a sessão.
- [x] Implementar retorno contextual pelo botão Voltar e pela tecla `Escape`.
- [x] Criar três cenas provisórias conectadas: entrada, interior e fundo do beco.
- [x] Implementar o comando Ir para com destinos válidos por cena.
- [x] Substituir a sidebar visual por quatro controles com ícones pixelados.
- [x] Implementar o menu Ir para pequeno, contextual e específico, sem alterar as respostas do celular.
- [x] Criar estrutura Capacitor para Android.
- [x] Implementar investigação point-and-click com hotspots acessíveis.
- [x] Implementar Bolsa da MJ com inventário narrativo e ação direta USAR.
- [x] Implementar cofre interativo com abertura e coleta do Celular de Lulith.
- [x] Implementar ativação do aparelho pela Bolsa com reação narrativa.
- [x] Implementar layout mobile paisagem e otimizações de toque.

### Tela inicial e Carregar

Implementada em `js/title-menu.js`, sobre as artes aprovadas `assets/interfaces/menu.png` e `save-menu.png`.

- [x] Preparar o menu sob a Cutscene 01 e liberar a capa somente após o Skip.
- [x] Compor mesa escura, cidade noturna, lâmpada e caderno fechado no centro.
- [x] Usar o título `Sanmd` e os rótulos `Novo jogo` e `Carregar` gravados na arte, com áreas de toque sobrepostas.
- [x] `Novo jogo`: animação de abertura perceptível, fade, reinício do estado e só então a cutscene.
- [x] `Carregar`: a própria página aberta do caderno é a tela de Load, sem menu externo.
- [x] Reutilizar os saves reais do sistema atual; nenhum formato novo.
- [x] Mostrar thumbnail, nome, data e horário de cada registro.
- [x] Clicar na fotografia restaura o snapshot pela mesma função da Galeria.
- [x] Exibir áreas vazias discretas e `Nenhum registro disponível.` sem bloquear o Carregar.
- [x] `Voltar` fecha o caderno e devolve à capa.
- [x] Uma única animação de abertura/fechamento, compartilhada por `Novo jogo` e `Carregar`.
- [x] Estados `menu`, `opening`, `load`, `closing` e `startingGame`, fora do snapshot.
- [x] Reutilizar `animarFade` no caderno e na passagem ao gameplay; a navegação usa o controlador global de cena.
- [x] Reaproveitar o autosave existente na saída, sem tocar nas fotografias manuais.
- [x] Manter o caderno centralizado e os alvos confortáveis em paisagem, sem resolução fixa.
- [x] Validar contra a geometria medida nas artes e contra o DOM publicado (`test/tela-inicial.test.js`).
- [x] Validar o fluxo de Novo jogo e Carregar no APK Android landscape.
- [x] Integrar `lulith_codigo` entre o reset de Novo jogo e o gameplay do beco.
- [ ] Integrar o conteúdo futuro de James, dormitório e caso introdutório após a Cutscene 02.

### Preparação para o conteúdo canônico

- [ ] Identificar e remover da experiência jogável a premissa antiga do celular encontrado em casa.
- [x] Preservar os motores reutilizáveis de diálogo, monólogo, mensagens e navegação.
- [ ] Separar dados narrativos do Ato I das regras do motor.
- [ ] Definir estados e marcos de progresso para todas as fases do ato.
- [ ] Garantir que cenas e diálogos possam ser trocados sem alterar o motor principal.
- [ ] Substituir placeholders clicáveis por funções reais ou estados visuais não interativos.

## Fase 1 — Fechar o roteiro jogável do Ato I

### Estrutura geral

- [ ] Escrever o fluxo completo da cutscene até o reset remoto do celular.
- [ ] Definir quais informações obrigatórias e opcionais aparecem em cada cena.
- [ ] Definir como cenários, objetos, expressões e interfaces contam a história sem depender apenas de diálogos.
- [ ] Marcar os pontos em que o jogador aprende cada mecânica.
- [ ] Definir as condições de avanço e falha de cada sequência.
- [x] Implementar o encerramento do protótipo ao sair do beco após coletar o celular.
- [ ] Definir o encerramento canônico do Ato I após a apresentação de todos os sistemas planejados.

### Personagens

- [ ] Escrever MJ como curiosa, analítica, cansada e experiente em enigmas.
- [ ] Apresentar o medo de MJ estar errada apenas como traço de personalidade.
- [ ] Mostrar a competência de MJ sem invalidá-la por causa do cansaço.
- [ ] Apresentar naturalmente a experiência de MJ com ARGs, enigmas e escape rooms.
- [ ] Escrever James como amigo, antigo professor e colega preocupado com MJ.
- [ ] Escrever Lulith com tom leve, persuasivo e brincalhão.
- [ ] Mostrar irritação de Lulith somente quando ela perde o controle da situação.
- [ ] Garantir que a relação entre MJ e Lulith não tenha leitura romântica.
- [ ] Decidir se algum personagem além de MJ, Lulith e James é necessário no Ato I.

### Pendências narrativas necessárias ao ato

- [ ] Definir em cenas futuras o que Lulith quer recuperar; a Cutscene 02 atual não contém falas.
- [ ] Definir quanto da aparente vingança precisa ser compreendido no Ato I.
- [ ] Definir por que Lulith escolheu MJ para este teste.
- [ ] Definir como Lulith garante que MJ encontre o cofre.
- [ ] Definir o risco de outra pessoa encontrar o cofre ou o celular.
- [ ] Definir quais pistas sobre outros candidatos aparecem no Ato I.
- [ ] Definir o objetivo aparente do celular neste ato sem revelar sua função verdadeira.

## Fase 2 — Definir locais, puzzles e conteúdo

### São Paulo e cenários

- [ ] Escolher o bairro ou região do dormitório de MJ.
- [ ] Definir se a delegacia será real, fictícia ou inspirada em um local real.
- [ ] Escolher o local da cena do crime introdutória.
- [ ] Escolher o local revelado pelas coordenadas.
- [ ] Definir a importância narrativa desse local para Lulith.
- [ ] Definir quanto de São Paulo será reconhecível nos cenários.
- [ ] Listar todos os cenários, variações e closes necessários ao ato.

### Caso policial introdutório

- [ ] Criar um caso original e curto que funcione como tutorial.
- [ ] Definir vítima, incidente, envolvidos e solução do caso.
- [ ] Definir a cronologia real dos acontecimentos.
- [ ] Criar pistas suficientes para uma dedução lógica e justa.
- [ ] Criar pistas ambientais opcionais que aprofundem a cena.
- [ ] Definir objetos examináveis e respostas de MJ para cada um.
- [ ] Definir a participação de James durante a investigação.
- [ ] Definir como o jogador apresenta ou relaciona evidências.
- [ ] Substituir qualquer conteúdo copiado de *Ace Attorney* por material original.

### Nota e coordenadas

- [ ] Escrever o conteúdo visual e textual da nota.
- [ ] Definir o método de criptografia do primeiro puzzle.
- [ ] Garantir que a solução possa ser deduzida com pistas presentes no jogo.
- [ ] Definir dicas graduais para evitar bloqueio permanente.
- [ ] Definir as coordenadas e validar se correspondem ao local escolhido.
- [ ] Decidir entre mapa real, mapa estilizado ou interface fictícia.
- [ ] Definir a apresentação visual do fast travel.

### Cofre

- [ ] Definir o design provisório e o esconderijo do cofre.
- [ ] Criar um segundo puzzle diferente do puzzle da nota.
- [ ] Definir pistas, solução e dicas graduais do puzzle.
- [ ] Justificar narrativamente a presença do cofre naquele local.
- [ ] Definir o estado do celular quando o cofre é aberto.

### Nota descartada

- [ ] Definir o nome do final da nota descartada.
- [ ] Definir o percentual mínimo exibido.
- [ ] Escrever o texto da tela final.
- [ ] Decidir se haverá uma pista discreta incentivando replay.
- [ ] Decidir se esse resultado aparece na lista de finais do Ato I.

## Fase 3 — Construir a progressão técnica do ato

### Estado e cenas

- [ ] Criar um identificador para cada cena do Ato I.
- [x] Implementar carregamento e troca de cenários no recorte provisório do beco.
- [ ] Implementar entrada, saída e troca de personagens em cena.
- [ ] Implementar poses e expressões por fala ou evento.
- [ ] Criar eventos de entrada, interação, conclusão e transição de cena.
- [ ] Bloquear ações incompatíveis durante diálogos, puzzles e transições.
- [ ] Manter o foco e os controles corretos após cada mudança de estado.

### Nome e progresso

- [ ] Criar a tela inicial de escolha do nome real de MJ.
- [ ] Validar nome vazio, tamanho máximo e caracteres aceitos.
- [ ] Usar o nome escolhido em diálogos, mensagens e telas de resultado.
- [ ] Criar marcos de progresso do Ato I.
- [ ] Persistir nome, cena atual, pistas, escolhas e estado dos puzzles.
- [ ] Restaurar a partida após recarregar ou fechar o jogo.
- [ ] Permitir reiniciar o Ato I após o final da nota descartada.

### Investigação point-and-click

- [ ] Criar hotspots acessíveis para objetos investigáveis.
- [ ] Exibir feedback visual e por teclado ao focar um hotspot.
- [ ] Implementar inspeção de objetos e pistas ambientais.
- [ ] Criar inventário ou registro mínimo de evidências do caso.
- [ ] Marcar evidências obrigatórias e opcionais separadamente.
- [ ] Implementar relação ou apresentação de evidências, se exigida pelo caso.
- [ ] Impedir conclusão antes das descobertas obrigatórias.
- [ ] Permitir revisitar pistas sem quebrar o progresso.

### Puzzles e escolhas

- [ ] Criar uma interface reutilizável para puzzles.
- [ ] Implementar tentativas, erros, acertos e dicas.
- [ ] Implementar a escolha explícita entre descartar e resolver a nota.
- [ ] Solicitar confirmação antes de encerrar pelo descarte da nota.
- [ ] Implementar o puzzle da nota.
- [ ] Implementar a consulta das coordenadas no computador.
- [ ] Implementar o puzzle do cofre.
- [ ] Registrar puzzles concluídos para evitar repetição indevida.

## Fase 4 — Implementar a abertura

### Cutscene de Lulith

- [x] Apresentar Lulith sem diálogo: quarto, trabalho, dois erros, irritação, reação, chute e plano final.
- [x] Mapear os dez PNGs de `quarto-lulith` por IDs lógicos, sem reprocessar as artes.
- [x] Reutilizar o controlador global para ordem, preload, input e Skip nos dez quadros.
- [x] Centralizar tempos em CONFIG; ampliar os quadros 01–07 em cerca de 25%, preservando 08–10.
- [x] Suavizar os cortes calmos em 100 ms; manter corte seco nos erros e no chute.
- [x] Aplicar câmera discreta, sons sintetizados, flash localizado e shake curto.
- [x] Respeitar reduced motion e cancelar áudio, efeitos e callbacks ao sair.
- [x] Registrar autosave somente após a conclusão e entrada no gameplay; Skip também conclui.
- [x] Validar no Android a sequência natural, Skip nos dez quadros e Carregar sem Cutscene 02.
- [ ] Avaliar auditivamente os SFX sintetizados e decidir se serão substituídos por gravações.
- [ ] Validar subjetivamente o ritmo após o último aumento dos quadros 01–07.
- [ ] Confirmar a integração dessa apresentação à versão final do Ato I.

### Cutscene 03 — saída do beco

- [x] Usar os oito PNGs existentes em `custcene-beco` com IDs lógicos e preload.
- [x] Oferecer **Sair do beco** em `Ir para` somente na entrada após abrir o cofre e coletar o celular; não repetir após `act1Complete`.
- [x] Usar cortes secos, câmera sutil, ambiente e SFX no controlador e pool de áudio existentes.
- [x] Criar Frame 09 preto por CSS, sem PNG, e entregar à sequência independente **ATO 1 COMPLETO**.
- [x] Unificar fim natural e Skip: conclusão, autosave e retorno ao menu sem repetir SANMD.
- [x] Cobrir Skip em cada ponto, falha de asset, save legado e reentrada por testes automatizados; validar fluxo no Chromium em paisagem.
- [x] Compilar e instalar o APK de debug no SM-A055M; confirmar abertura em paisagem.
- [x] Validar a sequência natural completa no Android físico: oito quadros, autosave, menu, escala 1 e Load sem repetição; restaurar os saves originais.
- [ ] Avaliar auditivamente a sequência no Android físico, ajustar volumes/timing e exercitar Skip em cada quadro no WebView.

### Cutscene 01 — título e luz

- [x] Expandir as próprias iniciais de SANMD no significado e acrescentar `kk`.
- [x] Sincronizar clique/estalo da lâmpada com a revelação do menu.
- [x] Manter a luz acesa até o Skip global, sem salvar estado da abertura.

### Dormitório e James

- [ ] Criar o cenário provisório do dormitório.
- [ ] Mostrar que MJ já estava cansada e dormindo mal antes dos eventos.
- [ ] Implementar James acordando MJ.
- [ ] Apresentar a relação entre os dois por ações e diálogo natural.
- [ ] Implementar a conversa que leva MJ à cena do crime.
- [ ] Implementar a transição do dormitório para a investigação.

## Fase 5 — Implementar o caso introdutório

- [ ] Criar o cenário provisório da cena do crime.
- [ ] Posicionar personagens, objetos e hotspots.
- [ ] Introduzir os controles point-and-click de forma contextual.
- [ ] Implementar exame de todos os objetos planejados.
- [ ] Implementar coleta e consulta das evidências.
- [ ] Implementar diálogos presenciais com James.
- [ ] Implementar dicas contextuais sem entregar diretamente a solução.
- [ ] Implementar a dedução ou conclusão do caso.
- [ ] Exibir reação adequada para respostas erradas.
- [ ] Confirmar que todas as conclusões dependem de pistas visíveis anteriormente.
- [ ] Implementar a resolução original do caso.
- [ ] Implementar o retorno à mesa de MJ na delegacia.

## Fase 6 — Implementar a nota e o primeiro final

- [ ] Criar os cenários provisórios da delegacia e da mesa de MJ.
- [ ] Implementar a descoberta e inspeção da nota.
- [ ] Apresentar claramente as opções de descartar ou resolver.
- [ ] Implementar a animação ou descrição de amassar e jogar fora.
- [ ] Encerrar imediatamente a investigação principal após o descarte.
- [ ] Exibir nome, texto e percentual do final definido.
- [ ] Oferecer reinício ou retorno ao menu após o final.
- [ ] Implementar o fluxo de resolução da nota.
- [ ] Revelar as coordenadas somente após a solução correta.

## Fase 7 — Implementar coordenadas, deslocamento e cofre

- [ ] Criar a interface do computador da delegacia.
- [ ] Permitir inserir ou consultar as coordenadas descobertas.
- [ ] Apresentar o destino no mapa escolhido.
- [ ] Introduzir o funcionamento futuro do Mapa por essa interação.
- [ ] Implementar a sequência curta de deslocamento.
- [ ] Criar o cenário do local indicado pelas coordenadas.
- [ ] Criar a área e o close provisório do cofre.
- [ ] Implementar descoberta, inspeção e abertura do cofre.
- [ ] Implementar o segundo puzzle com feedback e dicas.
- [ ] Revelar o celular de Lulith ao concluir o puzzle.
- [ ] Registrar a obtenção do celular no progresso do ato.

## Fase 8 — Implementar o celular e o primeiro contato

### Estado anterior ao reset

- [x] Definir quais informações antecipam conteúdos posteriores sem exigir o Ato II.
- [x] Criar arquivos, imagens, mensagens ou registros anteriores ao reset.
- [x] Permitir que o jogador examine esse conteúdo antes do primeiro contato.
- [x] Registrar quais pistas opcionais foram vistas.
- [x] Garantir que as pistas continuem interpretáveis em um replay futuro.
- [x] Criar o primeiro enigma interno do celular para MJ deduzir que a dona do aparelho é uma mulher.
- [x] Liberar `REMETENTE.enc` somente depois da conclusão do primeiro contato.
- [x] Manter Mensagens acessível antes da liberação de `REMETENTE.enc`.

### Primeiro contato com Lulith

- [x] Substituir o chat não canônico pela conversa do Ato I.
- [x] Manter o contato como `???` e impedir que revele nome, gênero ou dados pessoais.
- [x] Fazer MJ se referir ao contato no masculino antes de resolver o enigma.
- [x] Atualizar a percepção de MJ para o feminino somente após a dedução.
- [x] Criar respostas básicas e opções adicionais condicionadas aos arquivos examinados.
- [x] Fazer escolhas produzirem reações locais diferentes de Lulith.
- [x] Manter ramificações curtas compatíveis com o restante do ato.
- [x] Condicionar opções e rotas adicionais aos arquivos examinados pelo jogador.
- [x] Usar as rotas condicionais para revelar informações diferentes.
- [x] Fixar o monólogo individual pela primeira resposta condicional escolhida.
- [x] Criar monólogos individuais para candidatos, rota e recuperação.
- [x] Criar um quarto monólogo para quem examinou e resolveu os quatro arquivos.
- [x] Dar prioridade ao monólogo dos quatro arquivos sobre a rota individual.
- [x] Preservar a rota de monólogo escolhida durante o reset.
- [x] Manter a rota individual e trocar seus pronomes para o feminino depois de resolver `ELA`.
- [x] Revalidar no domínio os requisitos de opções condicionais antes de aceitar uma escolha.
- [x] Aplicar corretamente o tom persuasivo e brincalhão de Lulith.
- [x] Atualizar monólogos de MJ antes, durante e depois da conversa.

### Reset remoto

- [x] Definir o gatilho do reset após a conclusão da primeira conversa.
- [x] Criar aviso, animação ou interrupção visual do reset.
- [x] Exibir um cronômetro vermelho durante o minuto anterior ao reset.
- [x] Remover do acesso normal o conteúdo anterior.
- [x] Manter o aplicativo Arquivos acessível, mas vazio, após o reset.
- [x] Restaurar o celular com aparência comum e funções específicas do jogo.
- [x] Preservar internamente o registro das pistas vistas antes do reset.
- [x] Impedir acesso acidental ao conteúdo apagado na primeira partida.
- [x] Consolidar o reset nos estados `inativo`, `agendado`, `executando` e `concluido`.

### Refatoração e limpeza

- [x] Remover o estado de arquivo atual que não era consultado.
- [x] Remover atualização imperativa redundante dos aplicativos.
- [x] Mover rótulos acessíveis fixos dos aplicativos para o HTML.
- [x] Manter Galeria e Notas visíveis, mas desabilitadas enquanto forem placeholders.
- [x] Remover metadado de entrada que apontava para `index.js` inexistente.
- [x] Marcar o pacote como privado.
- [x] Preservar metadados de personagem, cena e conversas presenciais planejadas.

## Fase 9 — Apresentar os sistemas do celular

### Objetivo e limites

- [ ] Apresentar, depois do reset remoto, as funções que formarão a interface narrativa do celular sem revelar conteúdo apagado.
- [ ] Usar cada aplicativo para uma ação curta, pista contextual ou estado claramente indisponível; não criar ícones decorativos que aparentem funcionar.
- [ ] Manter Mensagens e Arquivos acessíveis, porém vazios, após o reset, preservando a ausência como consequência narrativa da ação de Lulith.
- [ ] Ensinar a navegação básica entre tela inicial, aplicativos e botão Voltar sem tutorial textual longo.
- [ ] Não antecipar nesta fase o ARG, a exploração do APK, o cálculo completo de 100%, perspectivas posteriores ou regras definitivas de replay.
- [ ] Não transformar o salvamento por fotografia, a trava por presença ou os comandos finais do terminal em decisões canônicas.

### Aplicativos e sequência de apresentação

- [x] Apresentar Mensagens como canal principal com o contato ainda identificado como `???` antes do reset.
- [x] Implementar Arquivos para os quatro documentos e pistas pré-reset.
- [x] Implementar Galeria com save/load fotográfico, 10 expressões da MJ, preview, detalhe, flash e layout responsivo.
- [ ] Definir a ordem diegética em que MJ descobre Câmera, Notas, Terminal, Mapa, Progresso e salvamento/replay depois do reset.
- [ ] Implementar Notas como registro contextual consultável, sem converter automaticamente as interpretações provisórias de MJ em fatos da história.
- [ ] Integrar Mapa ao destino já visitado pelas coordenadas, permitindo consultar o local e deixando claro que deslocamentos futuros dependerão de locais descobertos.
- [ ] Criar uma tela de Progresso acessível pelo controle central do celular, com marcos do Ato I encontrados e percentual explicitamente provisório.
- [ ] Exibir, após finais futuros, o mesmo recorte de progresso como mapa conceitual do que foi encontrado, sem indicar como obter o conteúdo ausente.
- [ ] Implementar Câmera apenas como indisponível nesta fase ou com uma função narrativa mínima que não dependa de salvamento; manter save por fotografia como hipótese.
- [ ] Garantir que o estado visual e os rótulos de cada aplicativo comuniquem se ele está disponível, vazio, bloqueado ou ainda indisponível.

### Salvamento e replay mínimos

- [x] Definir os dados mínimos persistidos: nome de MJ, cena e marcos do Ato I, evidências, arquivos vistos, solução de `ELA`, rota de monólogo, histórico e estado do reset.
- [x] Implementar persistência local com snapshots versionados, saves manuais e autosave.
- [x] Restaurar a partida após recarregar ou fechar o jogo, preservando inventário, estado de cena e progresso.
- [ ] Definir o comportamento ao carregar uma partida durante cooldown, cronômetro ou animação de reset e restaurá-la por um estado estável e equivalente.
- [ ] Separar o save da partida atual do registro de descobertas para replay; não implementar ainda o acesso a perspectivas de atos posteriores.
- [ ] Definir reinício do Ato I preservando somente as descobertas que o sistema de replay realmente deve reutilizar.

### Tutorial do terminal

- [ ] Definir a função narrativa do primeiro terminal: ensinar que o aparelho permite investigar informações escondidas, sem revelar a função definitiva do celular.
- [ ] Escolher o conjunto mínimo de comandos do Ato I entre `decode`, `scan`, `decrypt`, `access` e `trace`, mantendo os demais como planejamento.
- [ ] Definir sintaxe consistente, mensagens de erro úteis e um comando de ajuda integrado.
- [ ] Criar um puzzle introdutório curto, dedutível com elementos já apresentados, que ensine ao menos um comando por uso em vez de explicação longa.
- [ ] Registrar a conclusão do tutorial e permitir consultar novamente a ajuda e o resultado sem repetir indevidamente a recompensa narrativa.
- [ ] Definir quantos puzzles de terminal pertencem ao Ato I e graduar sua dificuldade sem exigir conhecimento externo ou ARG.
- [ ] Avaliar a trava por presença somente depois de estabelecer sua justificativa narrativa, feedback ao jogador e viabilidade técnica.
- [ ] Não implementar a trava por presença enquanto ela permanecer um conceito provisório.

### Critérios da fase

- [ ] Jogar do primeiro contato ao reset e confirmar que o conteúdo pré-reset não reaparece pelos aplicativos novos.
- [ ] Confirmar que cada aplicativo apresentado possui uma finalidade compreensível, estado honesto e retorno funcional à tela inicial.
- [ ] Confirmar que Galeria, Notas, Mapa, Terminal e Progresso contribuem para a narrativa por pistas, ações ou consequências, e não apenas por texto explicativo.
- [ ] Confirmar que o tutorial do terminal pode ser concluído usando exclusivamente informações disponíveis no Ato I.
- [ ] Recarregar o jogo em estados relevantes e confirmar a restauração do progresso mínimo sem expor dados apagados ou desbloquear rotas indevidas.

## Fase 10 — Produzir arte e apresentação provisórias

Atualização baseada nas seções [Sistema de Save e Load](ESTRUTURA_GAMING.md#sistema-de-save-e-load) e [Expressões fotográficas da MJ](ESTRUTURA_GAMING.md#expressões-fotográficas-da-mj) da estrutura técnica consolidada.

### Objetivo e limites do recorte atual

- [x] Usar a arte genérica somente para validar presença, escala, leitura e integração técnica.
- [x] Manter o cenário atual, seu enquadramento e seus elementos visuais intactos durante a criação da primeira MJ.
- [x] Usar somente uma pose neutra e estática de MJ nas cenas narrativas do protótipo atual; as expressões fotográficas pertencem exclusivamente à Galeria.
- [x] Não implementar animações internas, troca de frames, lip sync, piscadas ou respiração no sprite.
- [x] Permitir somente transições de interface para a entrada e a saída da personagem na cena (sem animações internas no sprite).
- [x] Não definir cabelo, roupa, proporções, acessórios ou identidade visual canônica de MJ.
- [x] Registrar explicitamente a origem assistida por IA e o caráter provisório do asset.

### Padrão visual

- [ ] Definir a resolução-base da pixel art.
- [x] Definir proporção, enquadramento e área visível dos sprites.
- [ ] Definir paleta e regras básicas de contraste do Ato I.
- [ ] Testar leitura de poses e expressões em desktop e celular.
- [x] Manter cenários e personagens inteiramente em 2D neste protótipo.
- [x] Tratar todos os assets como provisórios, não canônicos.

### Contrato técnico dos assets

- [ ] Preparar uma cena lógica futura de `320×180` em proporção 16:9 sem alterar o cenário atual neste recorte.
- [ ] Preparar uma área central segura para o futuro recorte de cenários em telas retrato.
- [ ] Definir as camadas futuras de background, personagens, foreground, efeitos e interface.
- [x] Criar uma pasta-fonte de assets separada de `www`.
- [ ] Separar personagens, cenários, foregrounds, closes, interfaces e máscaras de hotspots.
- [x] Usar nomes baseados na função narrativa, sem características visuais provisórias.
- [x] Atualizar `copy:web` para incluir os assets ao gerar `www`.
- [x] Manter `www` como artefato gerado e a pasta-fonte como origem dos arquivos.
- [x] Documentar separadamente os contratos de cenários, interfaces e sprites em seus READMEs.

### Primeiro recorte — MJ genérica

- [x] Criar MJ como uma personagem feminina adulta sem características visuais canônicas.
- [ ] Comunicar postura curiosa e analítica por meio de uma silhueta legível.
- [x] Criar um único sprite neutro provisório em canvas transparente (`1070×1470` no asset atual).
- [x] Fixar o pivô visual no centro inferior do canvas.
- [ ] Manter rosto e gesto principal acima da região ocupada pela caixa de diálogo.
- [x] Usar uma paleta pequena e provisória compatível com o cenário noturno atual.
- [x] Gerar o sprite em PNG externo (`assets/sprites/MJ.png`) com formas pixeladas e bordas rígidas.
- [x] Nomear o asset no runtime como `assets/sprites/MJ.png`, com o ID narrativo `mj` separado do caminho físico.
- [x] Substituir definitivamente o SVG anterior pelo PNG com o mesmo identificador.

### Integração da MJ

- [x] Substituir somente a silhueta SVG inline pelo asset externo, sem modificar os demais elementos do cenário.
- [x] Associar o asset ao identificador narrativo `mj` nos dados do jogo.
- [x] Separar o identificador da personagem do caminho físico da imagem.
- [x] Definir uma pose `neutral` e um slot `center` para a cena atual.
- [x] Preparar os slots semânticos `left`, `center` e `right` sem alterar o enquadramento atual.
- [x] Manter separadas a presença visual, a presença narrativa e a disponibilidade para conversa.
- [x] Remover a animação contínua de respiração da silhueta substituída.
- [x] Exibir MJ em cena somente durante os monólogos (sala sem personagens presenciais), oculta no restante.
- [x] Implementar transições de entrada (`mj-entrar`, 320 ms) e saída (`mj-sair`, 280 ms) sem escalar ou deformar o sprite.
- [x] Respeitar `prefers-reduced-motion` e exibir MJ imediatamente quando necessário.

### Caixa de diálogo estilo Ace Attorney

- [x] Adotar caixa de diálogo de cantos retos com fundo claro, texto escuro, borda marcada e sombra deslocada.
- [x] Criar placa de nome `#name-plate` em azul-escuro com ponta apontando para a caixa.
- [x] Manter a seta de continuação piscando quando a fala está pronta.

### Apresentação da V1

- [x] Aumentar `velocidadeDigitacao` para 65 ms e manter o avanço por clique, `Enter` e espaço.
- [x] Sintetizar o blip de digitação via Web Audio API para letras não-espaço, com fallback silencioso.
- [x] Remover a sidebar visível e manter Conversar, Ir para, Celular e Bolsa como botões reais com SVGs pixelados.
- [x] Criar estados normal, hover, foco visível, ativo e desabilitado para os quatro comandos principais.
- [x] Restringir o estilo minimalista de destinos a `#ir-para-menu .message-choice`, preservando `.message-choice` no celular.
- [x] Posicionar o menu Ir para à esquerda do ícone no desktop e acima dele no celular.
- [x] Documentar o menu Ir para como camada visual independente da lógica de destinos e da estrutura de cenas.
- [x] Preservar botões reais, handlers, foco inicial e fechamento por escolha ou `Escape` como contrato arquitetural.

### Validação da primeira MJ

- [x] Confirmar que o cenário atual permaneceu visual e estruturalmente inalterado fora da substituição da silhueta.
- [x] Confirmar que MJ aparece usando os dados de personagem, pose e slot.
- [x] Confirmar que o sprite permanece estático depois da entrada.
- [x] Confirmar que o sprite não é deformado em desktop ou celular.
- [ ] Confirmar que o rosto permanece visível durante diálogos.
- [x] Confirmar que a presença visual de MJ não cria uma conversa presencial inexistente.
- [x] Confirmar que o asset entra corretamente na cópia web usada pelo Capacitor.
- [x] Validar por teste que o sprite de runtime é o PNG `assets/sprites/MJ.png` e está incluído no pipeline web.
- [x] Confirmar que MJ aparece apenas durante monólogos e volta a ficar oculta ao encerrar a conversa.
- [x] Confirmar que os testes existentes da Fase 8 continuam passando.

### Sprites genéricos

As poses abaixo são narrativas. As dez expressões da Galeria foram concluídas separadamente e não substituem essas entregas.

- [x] Criar MJ neutra.
- [ ] Criar MJ pensando ou analisando.
- [ ] Criar MJ surpresa.
- [ ] Criar MJ irritada.
- [ ] Criar MJ cansada.
- [ ] Criar Lulith neutra.
- [ ] Criar Lulith brincando.
- [ ] Criar Lulith confiante.
- [ ] Criar Lulith incomodada.
- [ ] Criar Lulith com raiva.
- [ ] Criar James neutro.
- [ ] Criar James explicando.
- [ ] Criar James preocupado.
- [ ] Criar James sério.

### Poses adiadas de MJ

- [x] Não iniciar as poses pensando, surpresa, irritada e cansada antes de validar o sprite neutro.
- [x] Reutilizar a pose neutra nas cenas narrativas do protótipo atual; manter as expressões fotográficas independentes.

### Expressões fotográficas da MJ — concluídas

- [x] Produzir as dez expressões: sorriso, olhar suave, séria, pensativa, surpresa, irritada, alegre, triste, tímida e piscadinha.
- [x] Entregar dez PNGs RGBA individuais em `assets/sprites/mj/photo/`, com canvas de `512×576`, proporção preservada e alinhamento central inferior.
- [x] Remover cenário, molduras, labels, números e símbolos decorativos dos sprites, preservando transparência real.
- [x] Mapear `mj__photo__01` a `mj__photo__10` em `DATA.personagens.mj.fotografia.sprites`, sem alterar os IDs persistidos.
- [x] Preservar `assets/sprites/MJ.png` como fallback para expressão ausente ou inválida.
- [x] Compor cenário e MJ como imagens independentes, usando interpolação `auto` no sprite fotográfico.
- [x] Registrar a produção assistida por IA, os prompts e o contrato dos assets.
- [x] Inspecionar os dez sprites sobre quadriculado e cenário do jogo no Chromium e verificar uma foto registrada na Galeria.
- [x] Copiar os dez sprites para `www/` e confirmar a correspondência com os arquivos-fonte.

### Apresentação do celular e da Galeria

- [x] Implementar a identidade rosa/lilás da MJ em HTML/CSS, com wallpaper e painéis escuros translúcidos.
- [x] Usar `celular.png` e `save.png` somente como referências visuais, mantendo controles reais na interface.
- [x] Organizar a tela inicial com Mensagens, Galeria e Arquivos, removendo Notas.
- [x] Criar grade 3×3 com nove posições, contador, espaços livres e fotografias com nome, data e hora.
- [x] Implementar preview com nome, confirmação e cancelamento, além de detalhe com carregar, excluir e voltar.
- [x] Reutilizar a composição fotográfica 4:3 na miniatura, no preview e no detalhe.
- [x] Implementar flash de 140 ms, estados desabilitados, foco visível e mensagens de status acessíveis.
- [x] Implementar layout responsivo com rolagem interna e suporte a `prefers-reduced-motion` no overlay e no flash.

### Cenários genéricos — início da produção

- [x] Iniciar os cenários somente depois da validação da primeira MJ.
- [ ] Usar o dormitório como primeiro cenário-piloto.
- [ ] Não incorporar textos, caixa de diálogo ou informações variáveis aos backgrounds.
- [ ] Criar enquadramentos próprios para closes em vez de recortar o cenário amplo por CSS.

### Padrão técnico do cenário-piloto

- [ ] Definir a resolução-base (`320×180`) e a proporção 16:9 de cada cenário.
- [ ] Definir a área central segura para o recorte em telas retrato.
- [ ] Definir a paleta noturna e as regras de contraste do Ato I.
- [ ] Definir as camadas: background, foreground, objetos interativos e máscaras de hotspots.
- [ ] Acordar o pipeline de asset (pasta-fonte → `www`) para incluir cenários e seus cortes.
- [ ] Entregar um cenário-piloto jogável no recorte atual para validar escala, enquadramento e integração.

### Checklist de construção de cada cenário

Para cada cenário do Ato I, antes de considerar pronto:

- [ ] Definir narrativamente o que o cenário comunica (hora, clima, função na cena).
- [ ] Criar a arte-base do cenário no tamanho e proporção acordados.
- [ ] Separar a arte em camadas editoráveis (ambiente, detalhes, iluminação) sem mesclar com a interface.
- [ ] Definir a paleta do cenário e garantir contraste com os personagens.
- [ ] Identificar e desenhar os objetos interativos (hotspots) separadamente dos backgrounds.
- [ ] Criar a máscara/área clicável de cada hotspot coerente com o desenho.
- [ ] Garantir área central segura com o conteúdo essencial protegido no recorte retrato.
- [ ] Garantir que o enquadramento não esconda o rosto do personagem nos slots.
- [ ] Não embutir textos ou caixa de diálogo na imagem do cenário.
- [ ] Validar leitura em desktop acima de `700px` e no recorte do celular abaixo disso.
- [ ] Registrar o asset como provisório e não canônico.

### Roteiro de produção dos cenários do Ato I

Prioridade de criação (validação → fluxo canônico):

- [ ] **Dormitório de MJ** — primeiro cenário-piloto (tutorial de cenário).
- [ ] **Cena do crime** — caso introdutório point-and-click.
- [ ] **Delegacia (ambiente geral)** — liga o caso ao retorno de MJ.
- [ ] **Mesa de MJ (delegacia)** — nota, computador e escolha de descartar/resolver.
- [ ] **Close da nota** — apresentação visual do primeiro puzzle.
- [ ] **Interface do computador / consulta de coordenadas**.
- [ ] **Mapa/deslocamento** — apresentação do destino.
- [ ] **Local indicado pelas coordenadas** — cenário exterior/interior.
- [ ] **Área do cofre** — cenário com o cofre em destaque.
- [ ] **Close do cofre** — segundo puzzle.
- [ ] **Interfaces dos puzzles** (nota e cofre) como máscaras ou overlays reutilizáveis.

## Fase 11 — Estabilizar e testar

O recorte de Save/Load abaixo está implementado e testado no protótipo atual, conforme [Sistema de Save e Load](ESTRUTURA_GAMING.md#sistema-de-save-e-load) e [Expressões fotográficas da MJ](ESTRUTURA_GAMING.md#expressões-fotográficas-da-mj) em `ESTRUTURA_GAMING.md`. Isso não conclui a validação do fluxo canônico completo do Ato I, de acessibilidade ou de Android.

### Fluxo narrativo

- [ ] Jogar o Ato I canônico da escolha do nome até a cutscene final; o encerramento atual do protótipo já funciona após a coleta no beco.
- [ ] Confirmar a ordem correta de todas as cenas e transições.
- [ ] Confirmar que o caso ensina investigação antes da nota.
- [ ] Confirmar que descartar a nota encerra o jogo imediatamente.
- [ ] Confirmar que resolver a nota leva às coordenadas e ao cofre.
- [ ] Confirmar que o cofre entrega o celular de Lulith.
- [x] Confirmar que a conclusão do primeiro contato agenda o reset remoto.
- [ ] Confirmar que os principais sistemas do celular são apresentados.
- [ ] Confirmar que nenhum conteúdo antigo contradiz a premissa canônica.

### Puzzles e investigação

- [ ] Validar todos os hotspots com mouse, toque e teclado.
- [ ] Confirmar que pistas obrigatórias não podem ser perdidas definitivamente.
- [ ] Confirmar que pistas opcionais não bloqueiam o avanço.
- [ ] Testar soluções corretas, incorretas e tentativas repetidas.
- [ ] Confirmar que nota e cofre possuem soluções dedutíveis.
- [ ] Validar dicas com jogadores que não conhecem as respostas.
- [ ] Confirmar que o jogo nunca exige informação que não apresentou.

### Estado e persistência

- [x] Separar repositório de armazenamento, snapshot narrativo, metadados fotográficos, Galeria e autosave.
- [x] Persistir até nove saves manuais e um autosave separado em `localStorage`, com versões de armazenamento e snapshot.
- [x] Capturar, validar e restaurar o estado existente no protótipo, excluindo DOM, timers e estado transitório da interface.
- [x] Testar persistência entre inicializações de cena, nome da fotografia, data, expressão e snapshot.
- [x] Testar criação com flash e preview, cancelamento sem consumo de slot, recusa do décimo save e exclusão com liberação de espaço.
- [x] Sortear a expressão somente ao criar a captura, evitar repetição imediata e reutilizar o ID persistido ao reabrir ou carregar.
- [x] Testar restauração de cena, flags, mensagens e progresso sem aplicar a expressão fotográfica à pose narrativa.
- [x] Rejeitar snapshots corrompidos antes de alterar a sessão, preservando os demais saves.
- [x] Reconstruir os conjuntos de arquivos vistos e normalizar ou reagendar o reset remoto durante a restauração.
- [x] Criar/substituir autosave ao encerrar conversa ou concluir reset remoto, sem ocupar posições na Galeria.
- [x] Testar que carregar uma fotografia manual preserva o autosave existente.
- [x] Persistir inventário (`inventory`) e estado de cena (`sceneState`) nos snapshots.
- [x] Migrar saves antigos sem `aparelho` ou `inventory` para o formato atual.
- [x] Validar layout da Galeria com metadados estruturados e suporte a nomes longos.
- [ ] Criar interface dedicada para carregar o autosave.
- [ ] Implementar migrations quando houver evolução incompatível do formato dos saves.

Validação do Ato I completo ainda pendente (o nome da fotografia não equivale ao nome escolhido pelo jogador):

- [ ] Recarregar o jogo em cada fase e validar a restauração.
- [ ] Fechar e reabrir durante diálogos, investigação, puzzles e mensagens.
- [ ] Confirmar persistência do nome escolhido.
- [ ] Confirmar persistência de evidências, pistas e puzzles concluídos.
- [ ] Confirmar persistência do conteúdo visto antes do reset.
- [ ] Testar reinício após o final da nota descartada.
- [ ] Impedir estados impossíveis ou progressão fora de ordem.

### Interface e acessibilidade

- [x] Verificar no Chromium a decodificação dos dez PNGs, a composição sobre cenário e a captura/registro de uma foto na Galeria.
- [x] Implementar navegação interna da Galeria: preview/detalhe → grade → tela inicial → fechar celular.
- [x] Fechar Galeria e celular após Load e devolver o foco ao botão do celular no gameplay.
- [x] Disponibilizar confirmações nativas para carregar e excluir fotografias.

- [ ] Validar visualmente o menu Ir para com um destino em `beco_entrada` e `beco_fundo`.
- [ ] Validar visualmente o menu Ir para com dois destinos em `beco_interior`.
- [ ] Confirmar em navegador que o menu permanece associado ao ícone e dentro da viewport.
- [ ] Testar o fluxo completo acima e abaixo de `700px`.
- [ ] Testar orientação retrato e paisagem.
- [ ] Testar zoom e fontes ampliadas.
- [ ] Validar contraste formal.
- [ ] Validar navegação completa somente por teclado.
- [ ] Validar leitor de tela e anúncios de conteúdo dinâmico.
- [ ] Implementar e validar trava de foco em overlays.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Validar safe areas e recortes de tela.

### Mensagens

- [ ] Percorrer todas as opções do primeiro contato.
- [ ] Confirmar cada reação específica de Lulith.
- [ ] Confirmar bloqueio contra escolhas duplicadas.
- [ ] Confirmar cooldown e entrega individual das mensagens.
- [ ] Fechar e reabrir o celular durante o cooldown.
- [ ] Confirmar histórico e monólogos em todos os estados.
- [x] Confirmar que cada arquivo libera somente sua opção condicional correspondente.
- [x] Validar os três monólogos individuais e o monólogo dos quatro arquivos.
- [x] Confirmar que a primeira resposta condicional permanece como rota individual.
- [ ] Testar quantidades variáveis de opções em diferentes resoluções.

### Web e Android

- [x] Criar testes automatizados para estados e progressão crítica da Fase 8.
- [x] Substituir o `npm test` provisório por uma suíte funcional.
- [x] Cobrir por testes a navegação de ida e volta, bloqueio de saltos e destinos exibidos nas três cenas do beco.
- [x] Cobrir por testes a semântica e o contrato visual dos três ícones principais.
- [x] Cobrir Save/Load, limite de slots, sorteio, corrupção e autosave em `test/save-system.test.js`.
- [x] Cobrir os dez IDs e caminhos, arquivos distintos, dimensões e transparência dos PNGs em `test/photo-assets.test.js`.
- [x] Cobrir resolução de sprite, cenário independente e fallback para IDs ausentes ou inválidos.
- [x] Executar `npm test` após a integração fotográfica, com os seis arquivos de teste aprovados.
   - [x] Cobrir teclado virtual, entrada de texto, shift, layouts, acentos, teclado físico e snapshot em `test/text-input.test.js`.
   - [x] Executar `npm test` após a integração do teclado virtual, com os oito arquivos de teste aprovados (total de 83 testes).
- [x] Executar `npm run copy:web` e verificar sprites, scripts, CSS e README copiados para `www/`.
   - [x] Gerar o APK de debug.
   - [x] Instalar o APK via ADB no dispositivo conectado.
   - [x] Validar que o APK de debug é idêntico ao gerado localmente (checksum MD5).
   - [ ] Corrigir o pacote do teste instrumentado Android.
   - [ ] Executar `npm run sync` em ambiente Android configurado.
   - [ ] Tratar o botão físico Voltar no Android.
   - [ ] Validar retorno após o aplicativo ir para segundo plano.

   ### Teclado virtual e entrada de texto

   - [x] Implementar teclado virtual próprio (`js/keyboard.js`) com layouts QWERTY e Números.
   - [x] Implementar controlador compartilhado de entrada de texto (`js/text-entry.js`).
   - [x] Substituir campos `input` nativos por botões em `#gallery-photo-name` e `#messages-composer-field`.
   - [x] Desviar teclado físico (digitar, Backspace, setas, Enter, Esc) enquanto a edição está aberta.
   - [x] Implementar painel de acentos (ÁÇ) com á, à, â, ã, é, ê, í, ó, ô, õ, ú, ç.
   - [x] Implementar shift temporário e bloqueio de maxLength.
   - [x] Garantir que o estado de edição não é persistido (restaurar um save fecha a edição).
   - [x] Cobrir por testes Galeria, Mensagens, limites, shift, layouts, acentos, teclado físico e snapshot em `test/text-input.test.js`.

## Fase 12 — Critérios de conclusão do Ato I

- [ ] O jogador escolhe o nome de MJ e o nome aparece corretamente durante o ato.
- [ ] A abertura apresenta Lulith, MJ e James sem exposição excessiva.
- [ ] O caso policial original ensina investigação point-and-click.
- [ ] A cena do crime pode ser concluída apenas com pistas disponíveis no jogo.
- [ ] A nota oferece claramente os caminhos de descarte e resolução.
- [ ] O descarte produz um final imediato com progresso mínimo.
- [ ] A resolução revela coordenadas consultáveis na delegacia.
- [ ] O deslocamento conduz ao local correto em São Paulo.
- [ ] O puzzle do cofre é funcional, justo e diferente do puzzle da nota.
- [x] O celular contém pistas opcionais antes do reset.
- [ ] O primeiro contato representa corretamente a personalidade de Lulith.
- [x] O reset remoto altera o estado e o conteúdo do celular.
- [ ] Mensagens, Galeria, Câmera, Notas, Arquivos, Terminal, Mapa, Progresso e salvamento/replay são apresentados de forma clara.
- [ ] O terminal possui ao menos um tutorial jogável.
- [ ] O ato funciona do início ao fim em desktop, mobile e APK Android.
- [x] O progresso pode ser salvo e restaurado sem quebrar a sequência.
- [x] A investigação point-and-click com hotspots e Bolsa funciona no beco.
- [x] A ativação do celular pela Bolsa funciona com reação narrativa.
- [x] O layout mobile paisagem e as otimizações de toque estão implementadas.
- [ ] O conteúdo jogável não depende da premissa antiga.
- [ ] Feedback da primeira experiência foi registrado.
- [ ] Pendências encontradas foram classificadas para correção ou para atos posteriores.
- [ ] Ato I considerado funcional.

## Decisões provisórias a preservar

- [ ] Confirmar futuramente se a cutscene de Lulith permanecerá na versão final.
- [ ] Refinar futuramente o código dramático de MJ.
- [ ] Confirmar futuramente a função completa do terminal.
- [ ] Decidir futuramente se a trava por presença será usada.
- [ ] Decidir futuramente se a Câmera será um sistema de save por fotografias.
- [ ] Definir futuramente o cálculo completo do progresso e do 100%.
- [ ] Definir futuramente como replay recupera informações anteriores ao reset.
- [ ] Adiar design definitivo de personagens e cenários até o Protótipo 3.
- [ ] Adiar a decisão final entre cenários 2D, 3D tratado ou híbridos.

## Fora do Ato I

Os itens abaixo devem permanecer documentados no GDD, mas não entram neste roadmap:

- Estrutura completa do Ato II e dos atos posteriores.
- Motivação definitiva e história completa de Lulith.
- Origem completa dos testes e destino de todos os candidatos.
- Todas as perspectivas, finais e condições do final verdadeiro.
- Sistema completo de 100%, replay e investigação pós-final.
- Metalinguagem, exploração dos arquivos do APK e ARG completo.
- Design canônico dos personagens e cenários.
- Decisão definitiva sobre a influência hentai.

## Convenções de Código

### JavaScript

- **Linguagem**: Vanilla ES2024, sem transpiler, sem bundler.
- **Paradigma**: Funções fábrica com injeção de dependências (`criar*` pattern). Cada módulo exporta uma ou mais funções `criar*` que retornam um objeto congelado de operações.
- **Nomenclatura**:
  - Funções e propriedades usam `camelCase`.
  - Funções fábrica são nomeadas `criar*` (português para "create*").
  - Constantes em escopo de módulo usam `UPPER_SNAKE_CASE` (ex: `MAX_MANUAL_SAVES`).
  - Chaves de estado usam abreviações em português (ex: `bolsa`, `celular`, `localizacao`, `cene`).
- **Imutabilidade**: Objetos de serviço retornados são `Object.freeze`. Objetos de estado são substituídos, não mutados in-place, durante restauração.
- **Sem comentários no código** a menos que solicitado — documentação vive nas docstrings e na pasta `docs/`.
- **Tratamento de erros**: Erros são capturados e exibidos como feedback de UI ou avisos no console — o jogo nunca lança erros não tratados no navegador.
- **Sem mutações globais**: `game.js` cria instâncias isoladas. A única entrada global é `bootstrap.js`, que anexa uma única instância `game`.

### Padrões em uso

- **Factory + DI**: `criarJogo()` compõe todos os subsistemas, injetando um objeto `context` compartilhado.
- **Strategy**: `mechanics.js` registra handlers de interação (`examine`, `collect`, `use_item`, etc.) por tipo.
- **Facade**: `animation.js` abstrai detalhes de fade/animação e reduced-motion.
- **Composite/Renderer Selector**: `cutscene-renderers.js` despacha para o renderer de título (`cutscene-view.js`) ou de quadros (`cutscene-frames.js`) baseado na definição da sequência.

### Estado de Persistência

| Segmento         | Fonte             | Descrição                          |
|------------------|-------------------|------------------------------------|
| Game state       | `js/state.js`     | Todo estado persistente e transitório |
| Scene state      | `js/scene.js`     | Flags por cena, exibição de personagem |
| Dialogue state   | `js/dialogue.js`  | Índice de linha, digitação, fase de monólogo |
| Phone state      | `js/phone.js`     | Tela, timers persistentes, fila de mensagens |
| Gallery state    | `js/gallery.js`   | Seleção de foto, preview, flash    |
| Text input       | `js/text-entry.js` | Buffer, cursor, layout, shift      |
| Inventory        | `js/bag.js`       | Itens, pesquisa, paginação         |

### Persistência

- **Formato de save**: JSON com `saveVersion: 1`, armazenado em `localStorage` sob a chave `sanmd:saves` (ou em memória quando `storage` é null).
- **Saves manuais**: máximo 9, usados pelo sistema de fotos da Galeria.
- **Autosave**: slot único, sobrescrito a cada chamada de `registrarAutosave()`.
- **Validação de snapshot**: `persistence.js` valida estrutura, localização, fase de diálogo, visibilidade de arquivos, estado de mensagens, estado do celular e inventário antes de restaurar.

## Checklist de Revisão de Código

- Novas chaves de estado devem ser adicionadas a `capturarEstadoJogo()` em `persistence.js` se precisam sobreviver a saves.
- `state.texto`, `state.bolsa`, e `state.galeria` são transitórios — não persistir.
- Event listeners são anexados uma única vez durante `inicializarEventos()` (events.js). Não anexar listeners em construtores de fábrica.
- Evitar `setTimeout` com números mágicos — usar valores de `CONFIG`.
- Todos os métodos públicos de serviço devem retornar objetos `Object.freeze` quando apropriado.
- Novas tarefas de hotspot: registrar a estratégia em `mechanics.js` → `criarMecanicasHotspot`. Retornar `false` se a interação deve ser bloqueada.
- Novas cutscenes: definir a sequência em `js/data.js` como entrada em `CUTSCENES`. Usar `game.services.iniciarCutscene('id', onComplete)`.
