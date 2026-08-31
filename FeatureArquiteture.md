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
