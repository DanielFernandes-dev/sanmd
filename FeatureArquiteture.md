# Arquitetura — Celular, Mensagens e Conversas

## Status

A feature está implementada no protótipo web e é copiada para o projeto Capacitor pelo comando `npm run copy:web`.

O fluxo atual separa três tipos de interação:

- **Conversa presencial:** usada quando existe outro personagem no cenário.
- **Monólogo:** usado pelo botão **Conversar** quando o protagonista está sozinho.
- **Mensagens:** conversa remota com o dono do celular dentro do aplicativo Mensagens.

## Fluxo Atual

1. O protagonista entra sozinho na sala.
2. O botão **Conversar** apresenta o monólogo inicial.
3. O jogador abre o celular e entra em **Mensagens**.
4. O jogador escolhe a primeira mensagem do protagonista.
5. O dono permanece em silêncio durante um cooldown de 1 minuto.
6. Após o cooldown, aparece o indicador `digitando...`.
7. As mensagens do dono são entregues uma por vez, com intervalo de 1,2 segundo.
8. O jogador escolhe novas respostas contextuais, com no máximo três opções por etapa.
9. As ramificações curtas retornam ao fluxo principal da conversa.
10. Ao finalizar o chat, o monólogo do botão **Conversar** é atualizado novamente.

## Interface

### Tela principal

O cenário mantém os botões **Conversar** e **Celular**.

O comportamento de **Conversar** depende do contexto:

- Sem personagens presentes, usa o monólogo correspondente ao progresso da história.
- Com um personagem presente, usa a conversa presencial cadastrada para ele.
- Nunca abre o diálogo com o dono do celular.

### Celular

O celular possui duas telas controladas por estado:

- `inicio`: exibe data e aplicativos.
- `mensagens`: exibe cabeçalho, histórico, escolhas e navegação.

O botão **Voltar** é contextual:

- Em Mensagens, retorna à tela inicial do celular.
- Na tela inicial, fecha o celular e retorna ao cenário.
- A tecla `Escape` executa o mesmo comportamento.

### Mensagens

A estrutura relevante de `index.html` é:

```html
<section id="phone-messages" class="oculto" aria-labelledby="messages-header">
  <header id="messages-header">???</header>
  <div id="messages-list" aria-live="polite"></div>
  <div id="messages-choices" class="oculto" role="group" aria-label="Escolha uma resposta"></div>
</section>
```

As mensagens recebidas ficam à esquerda e as enviadas ficam à direita. As escolhas são botões acessíveis por mouse, toque e teclado.

## Modelo de Dados

### Cena e monólogos

`DATA.cena.personagensPresentes` determina se **Conversar** inicia uma conversa presencial ou um monólogo.

Os monólogos da sala são divididos por progresso:

```js
monologos: {
  sala: {
    inicial: [],
    aposPrimeiroEnvio: [],
    conversaConcluida: []
  }
}
```

- `inicial`: antes de enviar qualquer mensagem.
- `aposPrimeiroEnvio`: depois da primeira mensagem do protagonista.
- `conversaConcluida`: depois da última resposta do dono.

### Chat ramificado

O chat é uma sequência de etapas identificadas:

```js
mensagens: {
  dono: {
    inicio: "celular-encontrado",
    abertura: [],
    etapas: {
      "celular-encontrado": {
        recebidas: [],
        opcoes: [
          {
            id: "perguntar-identidade",
            texto: "Quem é você?",
            resposta: ["Minha identidade não importa. Ainda não."],
            proxima: "explicar-teste"
          }
        ]
      }
    }
  }
}
```

Cada etapa contém:

- `recebidas`: mensagens do dono mostradas antes das escolhas da etapa.
- `opcoes`: entre uma e três respostas disponíveis ao jogador.
- `id`: identificador único da opção.
- `texto`: mensagem enviada pelo protagonista.
- `resposta`: reação específica do dono.
- `proxima`: próxima etapa compartilhada ou `null` para encerrar.

`abertura` contém as primeiras mensagens do dono. Elas só entram na fila depois que o protagonista envia sua primeira escolha.

## Estado Do Jogo

`js/game.js` agrupa o estado por domínio:

```js
const state = {
  modo: "livre",
  dialogo: {},
  celular: {},
  mensagens: {}
};
```

### `state.dialogo`

- `linha`: índice da fala atual.
- `digitando`: informa se o efeito de digitação está ativo.
- `timer`: intervalo do efeito de texto.
- `falas`: sequência presencial ou monólogo em execução.
- `faseMonologo`: `inicial`, `aposPrimeiroEnvio` ou `conversaConcluida`.

### `state.celular`

- `tela`: `inicio` ou `mensagens`.
- `relogio`: intervalo de atualização do relógio.
- `transicao`: temporizador usado ao fechar o aparelho.

### `state.mensagens`

- `etapa`: etapa atual do chat.
- `historico`: somente as mensagens pertencentes ao caminho escolhido.
- `donoRespondendo`: bloqueia novas escolhas durante o envio.
- `donoDigitando`: controla o indicador `digitando...`.
- `fila`: mensagens do dono ainda não entregues.
- `proximaEtapa`: etapa ativada depois que a fila terminar.
- `cooldownAte`: horário absoluto do fim do cooldown inicial.
- `timer`: temporizador do cooldown ou do próximo envio.

O uso de um horário absoluto permite cancelar o temporizador ao fechar o celular e retomar apenas o tempo restante quando o chat for aberto novamente.

## Configuração De Tempo

Os tempos ficam centralizados em `CONFIG`:

```js
const CONFIG = Object.freeze({
  velocidadeDigitacao: 22,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280
});
```

- A primeira resposta do dono espera 1 minuto.
- O indicador de digitação aparece somente depois desse cooldown.
- Cada mensagem do dono é entregue separadamente após 1,2 segundo.
- Respostas posteriores não repetem o cooldown de 1 minuto.

## Responsabilidades Do Código

### Diálogo e monólogo

- `iniciarConversa()` seleciona conversa presencial ou fase do monólogo.
- `digitarTexto()` controla o efeito de texto.
- `avancarDialogo()` avança ou encerra a sequência.

### Celular

- `abrirCelular()` abre sempre na tela inicial.
- `abrirMensagens()` restaura histórico, etapa e temporizadores.
- `voltarCelular()` implementa o retorno contextual.
- `fecharCelular()` pausa timers visuais e preserva o progresso narrativo.

### Chat

- `obterEtapaMensagem()` centraliza o acesso às etapas.
- `adicionarMensagem()` atualiza o histórico.
- `prepararEnvioDono()` cria a fila e configura o cooldown.
- `agendarEnvioDono()` agenda cooldown ou próxima mensagem.
- `enviarProximaMensagemDono()` entrega apenas um item da fila.
- `finalizarEnvioDono()` libera escolhas ou conclui a conversa.
- `escolherResposta()` registra a escolha e prepara a reação contextual.
- `renderizarMensagens()` e `renderizarEscolhas()` atualizam a interface.

## Regras E Invariantes

- O protagonista sempre envia a primeira mensagem.
- Nenhuma etapa pode exibir mais de três opções.
- Apenas uma opção pode ser selecionada por etapa.
- Opções ficam ocultas enquanto o dono responde.
- Mensagens do dono são entregues individualmente.
- O histórico contém somente o caminho escolhido.
- O dono do celular não é considerado presente no cenário.
- O conteúdo é inserido com `textContent`, nunca como HTML.
- Eventos são registrados somente uma vez na inicialização.
- O progresso é preservado ao navegar entre cenário, celular e Mensagens.

## Como Adicionar Uma Etapa

1. Crie uma chave única em `DATA.mensagens.dono.etapas`.
2. Adicione as mensagens recebidas antes das escolhas.
3. Cadastre entre uma e três opções.
4. Use identificadores únicos nas opções.
5. Defina uma reação específica em `resposta`.
6. Aponte `proxima` para uma etapa existente ou use `null`.
7. Teste todos os caminhos e a convergência das ramificações.

## Validação Pendente

- [ ] Percorrer manualmente todas as opções e reações.
- [ ] Confirmar o cooldown real de 1 minuto.
- [ ] Fechar e reabrir o celular durante o cooldown.
- [ ] Confirmar a entrega individual de todas as mensagens.
- [ ] Validar os três monólogos em seus momentos corretos.
- [ ] Testar teclado, mouse e toque.
- [ ] Testar uma, duas e três opções em telas menores que `700px`.
- [ ] Gerar e validar o APK Android após as mudanças.
