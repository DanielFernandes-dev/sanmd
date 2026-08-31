# TODO — Protótipo V1 — Estrutura Base

> Referência: Ace Attorney (Nintendo DS)

## Interface Principal

- [ ] Criar layout principal inspirado na versão Nintendo DS de Ace Attorney.
- [ ] Dividir a interface entre área principal e área lateral.
- [ ] Criar área esquerda para Visual Novel.
- [ ] Criar área direita para os botões.
- [ ] Criar botão Conversar.
- [ ] Criar botão Celular.
- [ ] Ajustar proporções e espaçamentos da interface.
- [ ] Testar a interface em diferentes resoluções.

## Visual Novel

- [ ] Criar área para exibição do cenário.
- [ ] Criar suporte para exibição de personagem.
- [ ] Criar caixa de diálogo.
- [ ] Exibir nome do personagem.
- [ ] Exibir texto da fala.
- [ ] Implementar avanço das falas.
- [ ] Implementar encerramento do diálogo.
- [ ] Testar troca entre diferentes falas.
- [ ] Testar posicionamento do personagem na cena.

## Conversar

- [ ] Fazer o botão Conversar abrir uma interação.
- [ ] Criar uma conversa de teste.
- [ ] Criar personagem provisório.
- [ ] Criar algumas falas provisórias.
- [ ] Permitir avançar a conversa.
- [ ] Permitir finalizar a conversa.
- [ ] Testar a sensação da interação.

## Celular

- [ ] Fazer o botão Celular abrir a interface do aparelho.
- [ ] Criar tela inicial provisória do celular.
- [ ] Criar botão para retornar à interface principal.
- [ ] Testar entrada e saída do celular.
- [ ] Ajustar tamanho e posicionamento da interface.
- [ ] Testar transição entre Visual Novel e celular.

## Feature Prioritária — Celular, Mensagens e Conversas

> Especificação de origem: `FeatureArquiteture.md`.

### Estrutura da interface (`index.html`)

- [ ] Identificar o aplicativo Mensagens com um `id`, como `btn-mensagens`.
- [ ] Tornar o aplicativo Mensagens interativo e acessível por teclado.
- [ ] Criar a tela `phone-messages` dentro de `phone-screen`.
- [ ] Adicionar à tela de mensagens um cabeçalho com o nome do contato.
- [ ] Exibir `???` como nome do dono enquanto sua identidade não for revelada.
- [ ] Criar uma área `messages-list` com `aria-live="polite"` para a conversa.
- [ ] Manter `phone-home` como tela inicial do aparelho.
- [ ] Deixar a tela de mensagens oculta ao iniciar o jogo.
- [ ] Mover `btn-voltar` para dentro de `phone-screen`.
- [ ] Posicionar o botão Voltar no rodapé, no canto inferior esquerdo do celular.
- [ ] Usar elementos `button` em todas as ações interativas do celular.

### Organização dos dados (`js/data.js`)

- [ ] Remover de `conversas.principal` o diálogo com o dono do celular.
- [ ] Criar `mensagens.dono` para armazenar a conversa digital.
- [ ] Transferir as falas atuais com o dono para `mensagens.dono`.
- [ ] Identificar cada mensagem como enviada pelo `protagonista` ou pelo `dono`.
- [ ] Criar `monologos.sala` para as falas e pensamentos do protagonista sozinho.
- [ ] Manter mensagens digitais, monólogos e conversas presenciais em coleções separadas.

### Estado e navegação (`js/game.js`)

- [ ] Adicionar referências aos elementos da tela inicial e da tela de mensagens.
- [ ] Adicionar ao estado a tela atual do celular, iniciando com `telaCelular: "inicio"`.
- [ ] Criar uma função para abrir o aplicativo Mensagens.
- [ ] Criar uma função para retornar à tela inicial do celular.
- [ ] Criar uma função para renderizar `DATA.mensagens.dono` como balões.
- [ ] Aplicar classes diferentes às mensagens enviadas e recebidas.
- [ ] Exibir as mensagens do dono à esquerda.
- [ ] Exibir as mensagens do protagonista à direita.
- [ ] Restaurar a tela inicial sempre que o celular for aberto novamente.
- [ ] Fazer o botão Voltar retornar de Mensagens para a tela inicial.
- [ ] Fazer o botão Voltar fechar o celular quando o jogador estiver na tela inicial.
- [ ] Aplicar o mesmo retorno contextual ao pressionar `Escape`.
- [ ] Limpar intervalos e temporizadores ao fechar o celular.
- [ ] Registrar os eventos de clique somente uma vez durante a inicialização.
- [ ] Inserir o conteúdo das mensagens usando `textContent`.

### Comportamento do botão Conversar

- [ ] Reservar o botão Conversar para interações presenciais no cenário.
- [ ] Detectar se existe outro personagem presente no cenário.
- [ ] Iniciar uma conversa presencial quando houver outro personagem.
- [ ] Exibir um monólogo ou pensamento quando o protagonista estiver sozinho.
- [ ] Usar `DATA.monologos.sala` no cenário atual, pois não há outra pessoa na sala.
- [ ] Impedir que o botão Conversar inicie o diálogo com o dono do celular.
- [ ] Garantir que o dono do celular não seja tratado como presente na sala.
- [ ] Garantir que a conversa com o dono exista somente no aplicativo Mensagens.

### Aparência e responsividade (`styles.css`)

- [ ] Fixar o rodapé de navegação na parte inferior de `phone-screen`.
- [ ] Alinhar o botão Voltar à esquerda do rodapé.
- [ ] Remover o posicionamento externo atual do botão Voltar.
- [ ] Criar estilos para a tela e o cabeçalho de Mensagens.
- [ ] Organizar a lista de mensagens em coluna flexível.
- [ ] Adicionar rolagem vertical à conversa.
- [ ] Criar estilos diferentes para mensagens enviadas e recebidas.
- [ ] Usar cores distintas e com contraste suficiente para cada remetente.
- [ ] Limitar a largura dos balões para manter os textos legíveis.
- [ ] Impedir que mensagens longas ultrapassem os limites da tela.
- [ ] Validar o celular e a conversa na media query abaixo de `700px`.

### Fluxo esperado

- [ ] Entrar na sala com o protagonista sozinho.
- [ ] Usar Conversar e visualizar uma fala ou pensamento do protagonista.
- [ ] Abrir a tela inicial pelo botão Celular.
- [ ] Abrir a conversa com o dono pelo aplicativo Mensagens.
- [ ] Exibir a conversa em formato de chat dentro do aparelho.
- [ ] Usar Voltar para sair da conversa e retornar à tela inicial do celular.
- [ ] Usar Voltar novamente para fechar o celular e retornar ao cenário.

### Testes e critérios de aceitação

- [ ] Abrir e fechar o celular repetidas vezes sem quebrar o estado.
- [ ] Confirmar que Mensagens abre pela tela inicial do aparelho.
- [ ] Confirmar a ordem correta das mensagens.
- [ ] Confirmar o alinhamento correto de cada remetente.
- [ ] Testar a rolagem com uma conversa maior que a tela.
- [ ] Confirmar que Voltar retorna de Mensagens para a tela inicial.
- [ ] Confirmar que Voltar fecha o celular a partir da tela inicial.
- [ ] Testar `Escape` na tela de Mensagens e na tela inicial.
- [ ] Confirmar que somente o protagonista fala ao usar Conversar na sala vazia.
- [ ] Confirmar que nenhuma fala do dono aparece como diálogo presencial.
- [ ] Testar o fluxo completo em desktop.
- [ ] Testar o fluxo completo em telas menores que `700px`.
- [ ] Confirmar que todas as ações continuam acessíveis por teclado.

## Cenários

- [ ] Criar cenário provisório.
- [ ] Criar um segundo cenário provisório, se necessário para o teste.
- [ ] Testar troca de cenário.
- [ ] Testar posicionamento dos personagens sobre os cenários.
- [ ] Utilizar somente arte temporária nesta versão.

## Personagens

- [ ] Criar personagem provisório.
- [ ] Criar pelo menos uma pose ou sprite provisório.
- [ ] Posicionar personagem na área de Visual Novel.
- [ ] Testar personagem durante os diálogos.
- [ ] Ajustar escala e posicionamento.

## Fluxo de Teste

- [ ] Entrar no cenário.
- [ ] Visualizar personagem.
- [ ] Clicar em Conversar.
- [ ] Executar diálogo.
- [ ] Encerrar diálogo.
- [ ] Clicar em Celular.
- [ ] Abrir interface do celular.
- [ ] Retornar para a Visual Novel.
- [ ] Repetir o ciclo sem quebrar a interface.

## Testes

- [ ] Testar navegação entre as interfaces.
- [ ] Testar avanço rápido dos diálogos.
- [ ] Testar retorno do celular.
- [ ] Testar diferentes tamanhos de texto.
- [ ] Testar diferentes resoluções.
- [ ] Verificar elementos sobrepostos.
- [ ] Verificar problemas de escala.
- [ ] Verificar problemas de posicionamento.
- [ ] Verificar se os dois botões permanecem claramente acessíveis.

## Refinamento da V1

- [ ] Ajustar tamanho dos botões.
- [ ] Ajustar posição dos botões.
- [ ] Ajustar tamanho da caixa de diálogo.
- [ ] Ajustar posição dos personagens.
- [ ] Ajustar proporção da área Visual Novel.
- [ ] Ajustar proporção da área lateral.
- [ ] Ajustar transições.
- [ ] Remover elementos desnecessários.

## Validação

- [ ] Jogar o protótipo do início ao fim.
- [ ] Avaliar se a interface funciona visualmente.
- [ ] Avaliar se a divisão entre Visual Novel e ações funciona.
- [ ] Avaliar se Conversar e Celular são suficientes para a interface inicial.
- [ ] Anotar problemas encontrados.
- [ ] Anotar ideias para a próxima versão.
- [ ] Decidir o que será mantido.
- [ ] Decidir o que será alterado.
- [ ] Decidir o que será descartado.

## Conclusão

- [ ] V1 considerada funcional.
- [ ] Feedback da primeira experiência registrado.
- [ ] Próxima versão definida a partir dos testes.
