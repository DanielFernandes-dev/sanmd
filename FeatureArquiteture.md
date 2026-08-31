# Mudanças — Celular, Mensagens e Conversas

## Objetivo

Alterar o fluxo de diálogo para deixar claro que o protagonista está sozinho no cenário atual e que a conversa com o dono do celular acontece exclusivamente pelo aplicativo **Mensagens** do aparelho.

Também deve ser adicionado um botão **Voltar** no canto inferior do celular do protagonista.

## Comportamento Esperado

### Botão Voltar do celular

- O botão **Voltar** deve ficar dentro da interface do celular, no canto inferior esquerdo.
- Quando o jogador estiver no aplicativo Mensagens, o botão deve retornar à tela inicial do celular.
- Quando o jogador estiver na tela inicial do celular, o botão deve fechar o aparelho e retornar ao cenário.
- A tecla `Escape` pode manter o mesmo comportamento contextual do botão.

### Aplicativo Mensagens

- O aplicativo **Mensagens** da tela inicial do celular deve ser interativo.
- Ao abrir o aplicativo, deve ser exibida uma conversa entre o protagonista e o dono do celular.
- As mensagens do dono do celular devem aparecer alinhadas à esquerda.
- As mensagens do protagonista devem aparecer alinhadas à direita.
- Cada lado da conversa deve possuir cores diferentes para facilitar a identificação do remetente.
- A conversa deve ter rolagem quando o conteúdo ultrapassar o espaço disponível.
- O nome do contato deve aparecer no cabeçalho da conversa. Enquanto a identidade não for revelada, pode ser usado o nome `???`.

### Respostas selecionáveis do protagonista

- As mensagens do protagonista não devem ser enviadas automaticamente.
- Depois de uma mensagem do dono, o jogador deve escolher o que o protagonista responderá.
- Cada momento de escolha deve oferecer no mínimo uma e no máximo três opções.
- As opções devem ser coerentes com o contexto das mensagens recebidas anteriormente.
- A opção escolhida deve aparecer no histórico como uma mensagem enviada pelo protagonista.
- Cada opção deve produzir uma reação curta e contextual do dono do celular.
- As ramificações serão curtas: depois da reação específica, a conversa poderá convergir novamente para uma etapa principal compartilhada.
- As opções devem desaparecer ou ficar desabilitadas imediatamente após a escolha para impedir envios duplicados.
- Enquanto o dono estiver respondendo, novas escolhas devem permanecer bloqueadas.
- O histórico deve preservar somente a resposta escolhida e a respectiva reação.
- O progresso da conversa deve ser mantido enquanto o jogo estiver aberto, mesmo que o jogador saia e retorne ao aplicativo Mensagens.
- Antes da resposta do dono, pode ser exibido um indicador `digitando...` e um pequeno atraso para simular uma troca de mensagens real.

### Botão Conversar

- O botão **Conversar** deve continuar reservado para interações presenciais no cenário.
- Se o protagonista estiver sozinho, o botão deve apresentar uma fala, pensamento ou monólogo do próprio protagonista.
- Se houver outra pessoa no cenário, o botão deve iniciar uma conversa presencial com essa pessoa.
- Como não existe outra pessoa na sala atual, o botão deve apresentar somente falas ou pensamentos do protagonista.
- O diálogo com o dono do celular não deve mais aparecer na caixa de diálogo presencial.

## Fluxo Desejado

1. O jogador entra na sala e encontra o protagonista sozinho.
2. Ao selecionar **Conversar**, o protagonista fala ou pensa sozinho.
3. Ao selecionar **Celular**, a tela inicial do aparelho é aberta.
4. O jogador seleciona o aplicativo **Mensagens**.
5. A conversa com o dono do celular é exibida em formato de chat.
6. O jogador usa **Voltar** para sair da conversa e retornar à tela inicial do celular.
7. Ao usar **Voltar** novamente, o celular é fechado e o jogador retorna ao cenário.

## Como Implementar

### 1. Alterações em `index.html`

- Identificar o botão do aplicativo Mensagens com um `id`, por exemplo `btn-mensagens`.
- Criar uma nova área dentro de `#phone-screen` para representar a tela de mensagens.
- A tela deve conter um cabeçalho com o nome do contato e uma área para os balões da conversa.
- Manter `#phone-home` como a tela inicial do aparelho.
- Colocar `#btn-voltar` dentro de `#phone-screen`, no rodapé do celular.
- Deixar a tela de mensagens oculta inicialmente.
- Usar elementos `button` nas ações para preservar a navegação por teclado e a acessibilidade.

Estrutura sugerida:

```html
<div id="phone-messages" class="oculto">
  <header id="messages-header">???</header>
  <div id="messages-list" aria-live="polite"></div>
</div>

<div id="phone-nav">
  <button id="btn-voltar" type="button">◀ VOLTAR</button>
</div>
```

### 2. Alterações em `js/data.js`

- Remover a conversa com o dono do celular de `conversas.principal`.
- Criar uma coleção específica para as mensagens trocadas pelo celular.
- Criar uma coleção separada para os monólogos do protagonista na sala.
- Manter os dados separados para não misturar conversas presenciais com mensagens digitais.

Estrutura sugerida:

```js
const DATA = {
  monologos: {
    sala: [
      { autor: "Você", texto: "Não há ninguém aqui para conversar." }
    ]
  },

  mensagens: {
    dono: [
      { autor: "dono", texto: "Ah... você encontrou o celular, foi?" },
      { autor: "protagonista", texto: "Um teste? O aparelho estava na MINHA casa." }
    ]
  }
};
```

Os textos atuais podem ser preservados, mas devem ser transferidos para `mensagens.dono` e receber uma identificação consistente de remetente.

### 3. Alterações em `js/game.js`

- Adicionar referências para o botão Mensagens, a tela inicial, a tela de mensagens e a lista de mensagens.
- Adicionar ao estado uma propriedade que indique qual tela do celular está aberta, por exemplo `telaCelular: "inicio"`.
- Criar uma função para abrir o aplicativo Mensagens.
- Criar uma função para renderizar os balões usando os dados de `DATA.mensagens.dono`.
- Aplicar uma classe diferente conforme o remetente, por exemplo `mensagem-recebida` e `mensagem-enviada`.
- Atualizar o botão **Conversar** para usar `DATA.monologos.sala` enquanto não existir outra pessoa no cenário.
- Não iniciar a conversa com o dono do celular pelo botão **Conversar**.
- Alterar `fecharCelular()` ou criar uma função de retorno contextual.

Comportamento sugerido para o retorno:

```js
function voltarCelular() {
  if (state.telaCelular === "mensagens") {
    mostrarTelaInicial();
    return;
  }

  fecharCelular();
}
```

Ao abrir o celular novamente, a tela inicial deve ser restaurada para evitar que o aparelho reabra acidentalmente dentro de uma conversa antiga.

### 4. Alterações em `styles.css`

- Posicionar o rodapé de navegação na parte inferior de `#phone-screen`.
- Alinhar o botão **Voltar** à esquerda desse rodapé.
- Remover o estilo que posiciona o botão fora da moldura do celular.
- Criar estilos para a tela de mensagens e seu cabeçalho.
- Criar uma área de conversa flexível com rolagem vertical.
- Estilizar mensagens recebidas à esquerda e mensagens enviadas à direita.
- Limitar a largura dos balões para evitar linhas excessivamente longas.
- Garantir contraste suficiente entre texto, balões e fundo.
- Verificar o posicionamento em telas pequenas por meio da media query existente.

Exemplo de organização visual:

```css
#messages-list {
  flex: 1;
  overflow-y: auto;
}

.mensagem-recebida {
  align-self: flex-start;
}

.mensagem-enviada {
  align-self: flex-end;
}

#phone-nav {
  justify-content: flex-start;
}
```

### 5. Implementação das respostas selecionáveis

#### Estrutura em `index.html`

- Criar uma área `messages-choices` abaixo do histórico e acima da navegação do celular.
- Usar um contêiner com `role="group"` e um nome acessível que informe que são opções de resposta.
- Renderizar cada opção como um elemento `button` para permitir mouse, toque e teclado.
- Manter a área oculta quando não houver uma escolha disponível ou enquanto o dono estiver respondendo.

Estrutura sugerida:

```html
<div id="messages-choices" class="oculto" role="group" aria-label="Escolha uma resposta"></div>
```

#### Estrutura em `js/data.js`

- Substituir a lista linear por etapas identificadas por um `id` único.
- Cada etapa deve declarar as mensagens recebidas, as opções disponíveis e a próxima etapa.
- Cada opção deve possuir `id`, `texto`, `resposta` e `proxima`.
- A propriedade `resposta` contém a reação específica do dono.
- A propriedade `proxima` aponta para a etapa compartilhada que continuará a conversa.
- Usar `proxima: null` para indicar o encerramento da conversa.
- Não cadastrar mais de três opções em uma mesma etapa.

Estrutura sugerida:

```js
mensagens: {
  dono: {
    inicio: "celular-encontrado",
    etapas: {
      "celular-encontrado": {
        recebidas: ["Ah... você encontrou o celular, foi?"],
        opcoes: [
          {
            id: "perguntar-identidade",
            texto: "Quem é você?",
            resposta: ["Isso não importa agora."],
            proxima: "explicar-teste"
          },
          {
            id: "questionar-celular",
            texto: "Por que seu celular estava na minha casa?",
            resposta: ["Faz parte do teste."],
            proxima: "explicar-teste"
          }
        ]
      }
    }
  }
}
```

#### Estado e fluxo em `js/game.js`

- Adicionar ao estado a etapa atual, o histórico visível e a indicação de que o dono está respondendo.
- Ao abrir a conversa pela primeira vez, carregar a etapa indicada por `inicio`.
- Renderizar as mensagens recebidas da etapa e depois exibir suas opções.
- Ao escolher uma opção, ocultar as demais e adicionar o texto escolhido como mensagem do protagonista.
- Exibir `digitando...`, aguardar um pequeno intervalo e adicionar a reação do dono.
- Atualizar a etapa atual com o valor de `proxima` e exibir as novas opções.
- Encerrar o fluxo de escolhas quando `proxima` for `null`.
- Preservar o histórico e a etapa atual ao retornar para a tela inicial do celular.
- Impedir cliques repetidos enquanto uma resposta estiver sendo processada.
- Cancelar com segurança o temporizador de resposta quando o celular for fechado ou o jogo reiniciado.
- Levar a rolagem para a mensagem ou escolha mais recente depois de cada atualização.
- Mover o foco para a primeira nova opção quando ela aparecer.

#### Aparência em `styles.css`

- Posicionar as opções abaixo do histórico sem cobrir os balões ou o botão Voltar.
- Exibir as opções verticalmente para acomodar textos maiores em telas estreitas.
- Diferenciar visualmente opções disponíveis, foco, toque e estado desabilitado.
- Garantir área de toque adequada e quebra de linha nos botões.
- Estilizar o indicador `digitando...` como uma mensagem temporária recebida.
- Validar a interface com uma, duas e três opções em desktop e abaixo de `700px`.

## Cuidados de Implementação

- Não duplicar a conversa com o dono na Visual Novel e no celular.
- Não tratar o dono do celular como personagem presente na sala.
- Limpar intervalos e temporizadores ao fechar o celular.
- Evitar adicionar um novo evento de clique toda vez que o aplicativo for aberto.
- Usar `textContent` ao inserir as mensagens para evitar interpretar o conteúdo como HTML.
- Manter o foco e os botões acessíveis por teclado.
- Garantir que mensagens longas não ultrapassem os limites da tela.

## Testes Necessários

- Abrir e fechar o celular repetidas vezes.
- Abrir o aplicativo Mensagens pela tela inicial.
- Conferir a ordem e o alinhamento das mensagens.
- Conferir a rolagem em conversas longas.
- Usar **Voltar** dentro de Mensagens e confirmar o retorno à tela inicial.
- Usar **Voltar** na tela inicial e confirmar o retorno ao cenário.
- Pressionar `Escape` nas duas telas do celular.
- Selecionar **Conversar** na sala vazia e confirmar que somente o protagonista fala.
- Confirmar que nenhuma fala do dono aparece como diálogo presencial.
- Testar o fluxo em desktop e em telas com largura inferior a `700px`.
- Confirmar que cada etapa apresenta entre uma e três opções contextuais.
- Selecionar opções diferentes e conferir as respectivas reações do dono.
- Confirmar que as ramificações curtas retornam à etapa principal indicada.
- Tentar clicar duas vezes e confirmar que somente uma mensagem é enviada.
- Sair e retornar ao aplicativo Mensagens e confirmar a preservação do histórico.
- Confirmar que somente o caminho escolhido aparece no histórico.
- Testar o indicador de digitação e o bloqueio temporário das escolhas.
- Navegar e selecionar todas as opções usando somente o teclado.

## Critérios de Aceitação

- [ ] O botão **Voltar** aparece no canto inferior do celular.
- [ ] O botão retorna de Mensagens para a tela inicial do celular.
- [ ] O botão fecha o celular quando usado na tela inicial.
- [ ] O aplicativo Mensagens abre uma conversa funcional.
- [ ] As mensagens do protagonista e do dono possuem alinhamentos diferentes.
- [ ] Toda conversa com o dono acontece dentro do aplicativo Mensagens.
- [ ] O botão **Conversar** não inicia uma conversa com o dono do celular.
- [ ] Na sala vazia, o botão **Conversar** apresenta um monólogo do protagonista.
- [ ] O fluxo funciona corretamente em desktop e dispositivos móveis.
- [ ] O protagonista somente envia mensagens escolhidas pelo jogador.
- [ ] Cada escolha oferece no máximo três respostas contextuais.
- [ ] Respostas diferentes geram reações curtas diferentes do dono.
- [ ] As ramificações retornam corretamente ao fluxo principal.
- [ ] Uma opção não pode ser enviada mais de uma vez.
- [ ] O histórico mantém somente o caminho selecionado pelo jogador.
- [ ] O progresso da conversa é preservado ao sair e retornar ao aplicativo.
