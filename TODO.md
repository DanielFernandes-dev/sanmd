# TODO — Ato I — A Curiosidade

> Roadmap exclusivo do primeiro ato de **Sim, Acredite nas Mentiras Dele kk**.
>
> Fontes: [`GDD.md`](GDD.md), [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) e [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md).
>
> Objetivo do Ato I: apresentar MJ, James, investigação point-and-click, nota, coordenadas, cofre, celular, Lulith e os principais sistemas de gameplay.

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
- [x] Implementar os modos livre, diálogo e celular.
- [x] Implementar o botão Conversar para diálogos presenciais ou monólogos.
- [x] Implementar celular com tela inicial e navegação contextual.
- [x] Implementar o aplicativo Mensagens.
- [x] Implementar respostas selecionáveis e ramificações curtas.
- [x] Implementar cooldown, indicador `digitando...` e entrega sequencial.
- [x] Preservar o histórico de mensagens durante a sessão.
- [x] Implementar retorno contextual pelo botão Voltar e pela tecla `Escape`.
- [x] Criar estrutura Capacitor para Android.

### Preparação para o conteúdo canônico

- [ ] Identificar e remover da experiência jogável a premissa antiga do celular encontrado em casa.
- [ ] Preservar os motores reutilizáveis de diálogo, monólogo, mensagens e navegação.
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
- [ ] Definir o encerramento do Ato I após a apresentação dos sistemas do celular.

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

- [ ] Definir provisoriamente o que Lulith diz querer recuperar na cutscene.
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
- [ ] Implementar carregamento e troca de cenários.
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

- [ ] Escrever um texto provisório sobre recuperar o que foi tirado dela.
- [ ] Evitar confirmar a interpretação de vingança como verdade completa.
- [ ] Criar enquadramentos, expressões e ritmo da cutscene.
- [ ] Implementar avanço e opção de pular a cutscene.
- [ ] Garantir que a cena continue marcada como provisória.

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

- [ ] Definir quais informações antecipam conteúdos posteriores sem exigir o Ato II.
- [ ] Criar arquivos, imagens, mensagens ou registros anteriores ao reset.
- [ ] Permitir que o jogador examine esse conteúdo antes do primeiro contato.
- [ ] Registrar quais pistas opcionais foram vistas.
- [ ] Garantir que as pistas continuem interpretáveis em um replay futuro.

### Primeiro contato com Lulith

- [ ] Substituir o chat não canônico pela conversa do Ato I.
- [ ] Definir quando o contato deixa de aparecer como `???`.
- [ ] Criar de uma a três respostas coerentes em cada etapa.
- [ ] Fazer escolhas produzirem reações locais diferentes de Lulith.
- [ ] Manter ramificações curtas compatíveis com o restante do ato.
- [ ] Aplicar corretamente o tom persuasivo e brincalhão de Lulith.
- [ ] Atualizar monólogos de MJ antes, durante e depois da conversa.

### Reset remoto

- [ ] Definir o gatilho exato do reset após a primeira troca de mensagens.
- [ ] Criar aviso, animação ou interrupção visual do reset.
- [ ] Remover do acesso normal o conteúdo anterior.
- [ ] Restaurar o celular com aparência comum e funções específicas do jogo.
- [ ] Preservar internamente o registro das pistas vistas antes do reset.
- [ ] Impedir acesso acidental ao conteúdo apagado na primeira partida.

## Fase 9 — Apresentar os sistemas do celular

### Aplicativos do Ato I

- [ ] Apresentar Mensagens como canal principal com Lulith.
- [ ] Implementar uma função mínima de Galeria para pistas visuais.
- [ ] Implementar uma função mínima de Câmera ou marcá-la claramente como indisponível.
- [ ] Implementar uma função mínima de Notas para informações contextuais.
- [ ] Implementar uma função mínima de Arquivos para documentos.
- [ ] Integrar Mapa ao local visitado no ato.
- [ ] Implementar o indicador diegético de progresso do Ato I.
- [ ] Definir e implementar o salvamento mínimo necessário.
- [ ] Evitar que aplicativos sem função pareçam interativos.

### Tutorial do terminal

- [ ] Definir os comandos disponíveis no Ato I.
- [ ] Escolher comandos iniciais entre `decode`, `scan`, `decrypt`, `access` e `trace`.
- [ ] Definir sintaxe, mensagens de erro e ajuda integrada.
- [ ] Criar um puzzle introdutório curto para ensinar o terminal.
- [ ] Introduzir comandos por uso, sem depender de explicação longa.
- [ ] Definir a quantidade e a dificuldade dos puzzles de terminal neste ato.
- [ ] Avaliar a trava por presença como conceito provisório.
- [ ] Não implementar a trava por presença sem justificativa narrativa clara.

## Fase 10 — Produzir arte e apresentação provisórias

### Padrão visual

- [ ] Definir a resolução-base da pixel art.
- [ ] Definir proporção, enquadramento e área visível dos sprites.
- [ ] Definir paleta e regras básicas de contraste do Ato I.
- [ ] Testar leitura de poses e expressões em desktop e celular.
- [ ] Manter cenários e personagens inteiramente em 2D neste protótipo.
- [ ] Tratar todos os assets como provisórios, não canônicos.

### Sprites genéricos

- [ ] Criar MJ neutra.
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

### Cenários genéricos

- [ ] Criar dormitório.
- [ ] Criar cena do crime.
- [ ] Criar delegacia.
- [ ] Criar mesa de MJ.
- [ ] Criar local indicado pelas coordenadas.
- [ ] Criar área do cofre.
- [ ] Criar close do cofre.
- [ ] Criar interfaces da nota, computador, mapa e puzzles.

## Fase 11 — Estabilizar e testar

### Fluxo narrativo

- [ ] Jogar da escolha do nome até a cutscene final do Ato I.
- [ ] Confirmar a ordem correta de todas as cenas e transições.
- [ ] Confirmar que o caso ensina investigação antes da nota.
- [ ] Confirmar que descartar a nota encerra o jogo imediatamente.
- [ ] Confirmar que resolver a nota leva às coordenadas e ao cofre.
- [ ] Confirmar que o cofre entrega o celular de Lulith.
- [ ] Confirmar que o primeiro contato aciona o reset remoto.
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

- [ ] Recarregar o jogo em cada fase e validar a restauração.
- [ ] Fechar e reabrir durante diálogos, investigação, puzzles e mensagens.
- [ ] Confirmar persistência do nome escolhido.
- [ ] Confirmar persistência de evidências, pistas e puzzles concluídos.
- [ ] Confirmar persistência do conteúdo visto antes do reset.
- [ ] Testar reinício após o final da nota descartada.
- [ ] Impedir estados impossíveis ou progressão fora de ordem.

### Interface e acessibilidade

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
- [ ] Testar uma, duas e três opções em diferentes resoluções.

### Web e Android

- [ ] Criar testes automatizados para estados e progressão crítica.
- [ ] Substituir o `npm test` provisório por uma suíte funcional.
- [ ] Corrigir o pacote do teste instrumentado Android.
- [ ] Executar `npm run sync` em ambiente Android configurado.
- [ ] Gerar o APK de debug.
- [ ] Instalar e jogar o Ato I completo em um aparelho Android.
- [ ] Tratar o botão físico Voltar no Android.
- [ ] Validar retorno após o aplicativo ir para segundo plano.

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
- [ ] O celular contém pistas opcionais antes do reset.
- [ ] O primeiro contato representa corretamente a personalidade de Lulith.
- [ ] O reset remoto altera o estado e o conteúdo do celular.
- [ ] Mensagens, Galeria, Câmera, Notas, Arquivos, Terminal, Mapa, Progresso e salvamento/replay são apresentados de forma clara.
- [ ] O terminal possui ao menos um tutorial jogável.
- [ ] O ato funciona do início ao fim em desktop, mobile e APK Android.
- [ ] O progresso pode ser salvo e restaurado sem quebrar a sequência.
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
