---
aliases:
  - Estrutura Gaming
  - Arquitetura do Jogo
  - Estado Atual do SANMD
tags:
  - sanmd
  - arquitetura
  - gameplay
  - roadmap
  - visual-novel
  - obsidian
status: atual
updated: 2026-08-31
---

# Estrutura Gaming

> [!summary] Objetivo
> Esta nota documenta o que funciona atualmente em **Sim, Acredite nas Mentiras Dele kk**, explica sua arquitetura e organiza a evolução do protótipo em formato de roadmap. O código é a fonte de verdade; recursos descritos no [[GDD]] que ainda não possuem implementação são identificados como planejamento.

## Navegação

- [[ESTRUTURA_GAMING#Visão Geral|Visão Geral]]
- [[ESTRUTURA_GAMING#Roadmap Do Fluxo Atual|Roadmap Do Fluxo Atual]]
- [[ESTRUTURA_GAMING#Arquitetura Técnica|Arquitetura Técnica]]
- [[ESTRUTURA_GAMING#Máquina De Estados|Máquina De Estados]]
- [[ESTRUTURA_GAMING#Visual Novel E Diálogos|Visual Novel E Diálogos]]
- [[ESTRUTURA_GAMING#Interface Do Celular|Interface Do Celular]]
- [[ESTRUTURA_GAMING#Aplicativo Mensagens|Aplicativo Mensagens]]
- [[ESTRUTURA_GAMING#Timers E Ritmo|Timers E Ritmo]]
- [[ESTRUTURA_GAMING#Interface E Acessibilidade|Interface E Acessibilidade]]
- [[ESTRUTURA_GAMING#Execução E Android|Execução E Android]]
- [[ESTRUTURA_GAMING#Matriz De Funcionalidades|Matriz De Funcionalidades]]
- [[ESTRUTURA_GAMING#Limitações Atuais|Limitações Atuais]]
- [[ESTRUTURA_GAMING#Roadmap Futuro|Roadmap Futuro]]
- [[ESTRUTURA_GAMING#Validação Pendente|Validação Pendente]]

## Visão Geral

O projeto atual é um protótipo de Visual Novel investigativa feito com HTML, CSS e JavaScript. Ele possui uma única cena jogável, um sistema de diálogo, monólogos que mudam conforme o progresso e uma interface de celular usada como canal narrativo.

### O Que Funciona

- Cena noturna provisória.
- Silhueta provisória em SVG.
- Botões **Conversar** e **Celular**.
- Caixa de diálogo com efeito de digitação.
- Monólogos condicionados ao progresso da conversa.
- Tela inicial do celular com relógio e data reais.
- Aplicativo Mensagens funcional.
- Respostas selecionáveis com ramificações curtas.
- Cooldown antes da primeira resposta do dono.
- Indicador `digitando...`.
- Entrega individual das mensagens do dono.
- Histórico do caminho escolhido durante a sessão.
- Navegação contextual pelo botão **Voltar** e pela tecla `Escape`.
- Layout responsivo básico para telas menores que `700px`.
- Estrutura Capacitor para geração do aplicativo Android.

### Escopo Atual

O protótipo valida a base da experiência, não o jogo completo. A interface do celular, a apresentação narrativa e a transição entre estados são o foco desta versão.

> [!warning] Fonte de verdade
> O [[GDD]] descreve investigação, terminal, puzzles, múltiplos atos, finais, replay e ARG. Esses recursos fazem parte da visão futura e não estão presentes no código atual.

## Roadmap Do Fluxo Atual

Este roadmap descreve a sequência que já funciona durante uma partida.

### Etapa 1 — Inicialização

1. `index.html` monta a cena, a barra lateral e o celular oculto.
2. `js/data.js` disponibiliza cena, monólogos e árvore de mensagens.
3. `js/game.js` cria o estado inicial em modo `livre`.
4. **Conversar** e **Celular** ficam disponíveis.

### Etapa 2 — Cena Livre

O jogador vê a sala e pode escolher uma das duas ações principais:

- **Conversar:** inicia uma interação local.
- **Celular:** abre o aparelho em uma camada sobre o cenário.

Enquanto um diálogo ou o celular está aberto, os dois botões principais ficam desabilitados.

### Etapa 3 — Monólogo Inicial

Como `DATA.cena.personagensPresentes` está vazio, **Conversar** não encontra um personagem presencial. O sistema usa o monólogo `inicial`, no qual o protagonista percebe que deve verificar o celular.

### Etapa 4 — Abertura Do Celular

O celular abre sempre na tela inicial e apresenta:

- Hora local.
- Data local.
- Sinal e bateria decorativos.
- Mensagens.
- Galeria.
- Notas.
- Arquivos.

Somente **Mensagens** possui comportamento implementado.

### Etapa 5 — Primeira Mensagem Do Protagonista

Ao entrar em Mensagens pela primeira vez, nenhuma mensagem do dono é mostrada. O jogador escolhe uma entre três opções e o protagonista envia a primeira mensagem.

Nesse momento:

- A escolha entra no histórico à direita.
- As opções são ocultadas.
- O monólogo muda para `aposPrimeiroEnvio`.
- Começa um cooldown de 1 minuto.

### Etapa 6 — Resposta Do Dono

Quando o cooldown termina:

1. Aparece `digitando...`.
2. A primeira mensagem chega após 1,2 segundo.
3. As demais mensagens chegam individualmente.
4. Cada mensagem também respeita o intervalo de 1,2 segundo.
5. Ao terminar a fila, novas respostas do protagonista são liberadas.

### Etapa 7 — Ramificações Curtas

O jogador percorre quatro etapas narrativas. As respostas alteram reações locais do dono, mas convergem novamente para o fluxo principal.

```mermaid
flowchart LR
    A[celular-encontrado<br/>3 opções]
    B[explicar-teste<br/>2 opções]
    C[questionar-confianca<br/>1 opção]
    D[encerrar-contato<br/>2 opções]
    E[Fim do chat]

    A --> B
    B --> C
    C --> D
    D --> E
```

### Etapa 8 — Conclusão

Depois da última resposta do dono:

- A etapa do chat passa a `null`.
- Nenhuma nova opção é apresentada.
- O histórico permanece disponível durante a sessão.
- O monólogo muda para `conversaConcluida`.
- **Conversar** passa a apresentar a reflexão final do protagonista.

## Arquitetura Técnica

### Mapa De Arquivos

```text
.
├── index.html                 # Estrutura da cena e do celular
├── styles.css                 # Layout, animações e responsividade
├── js/
│   ├── data.js                # Conteúdo narrativo e árvore do chat
│   └── game.js                # Estado, regras e renderização
├── android/                   # Projeto nativo Android
├── capacitor.config.json      # Configuração Capacitor
├── package.json               # Scripts e dependências
├── README.md                  # Visão geral do projeto
├── TODO.md                    # Implementação e validações pendentes
├── FeatureArquiteture.md      # Arquitetura detalhada da feature de chat
├── GDD.md                     # Visão de longo prazo do jogo
└── ESTRUTURA_GAMING.md        # Esta nota central
```

### Camadas

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Estrutura | [index.html](index.html) | Cena, controles, celular e regiões acessíveis |
| Apresentação | [styles.css](styles.css) | Visual, animações, balões e responsividade |
| Dados | [js/data.js](js/data.js) | Cena, monólogos, etapas e respostas |
| Domínio | [js/game.js](js/game.js) | Estado, timers, navegação e renderização |
| Distribuição | [capacitor.config.json](capacitor.config.json) | Empacotamento web para Android |

### Princípio Atual

Não há framework de interface, bundler ou backend. O navegador carrega os scripts diretamente. O estado existe somente em memória e o DOM é atualizado por funções em `js/game.js`.

## Máquina De Estados

### Estado Principal

```mermaid
stateDiagram-v2
    [*] --> livre
    livre --> dialogo: Conversar
    dialogo --> livre: Encerrar diálogo
    livre --> celular_inicio: Celular
    celular_inicio --> mensagens: Abrir Mensagens
    mensagens --> celular_inicio: Voltar ou Escape
    celular_inicio --> livre: Voltar ou Escape
```

`state.modo` controla os modos globais:

- `livre`.
- `dialogo`.
- `celular`.

### Estado Agrupado

O estado é dividido por domínio:

```js
const state = {
  modo: "livre",
  dialogo: {},
  celular: {},
  mensagens: {}
};
```

### Estado Do Diálogo

| Propriedade | Uso |
|---|---|
| `linha` | Índice da fala atual |
| `digitando` | Indica se o efeito de texto está ativo |
| `timer` | Intervalo do efeito de digitação |
| `falas` | Sequência em execução |
| `faseMonologo` | Seleciona o monólogo narrativo atual |

### Estado Do Celular

| Propriedade | Uso |
|---|---|
| `tela` | `inicio` ou `mensagens` |
| `relogio` | Intervalo de atualização da hora |
| `transicao` | Timer da animação de fechamento |

### Estado Das Mensagens

| Propriedade | Uso |
|---|---|
| `etapa` | Etapa atual do chat |
| `historico` | Mensagens do caminho percorrido |
| `donoRespondendo` | Bloqueia escolhas durante a resposta |
| `donoDigitando` | Controla o indicador de digitação |
| `fila` | Mensagens ainda não entregues |
| `proximaEtapa` | Destino após a fila |
| `cooldownAte` | Horário absoluto do fim do cooldown |
| `timer` | Timer do cooldown ou do próximo envio |

## Visual Novel E Diálogos

### Seleção Da Interação

`iniciarConversa()` consulta o primeiro item de `DATA.cena.personagensPresentes`.

- Se existir um personagem, procura uma conversa em `DATA.conversas.presenciais`.
- Se não existir, usa o monólogo da fase atual.

Atualmente:

```js
personagensPresentes: []
conversas: {
  presenciais: {}
}
```

Portanto, somente os monólogos são jogáveis.

### Efeito De Digitação

- Cada caractere aparece em intervalo de 22 ms.
- Um clique durante a animação completa a frase.
- Outro clique avança para a próxima fala.
- `Enter` e espaço possuem o mesmo comportamento.
- Uma seta aparece quando a fala está pronta para avançar.

### Monólogos Por Progresso

| Fase | Momento |
|---|---|
| `inicial` | Antes de enviar qualquer mensagem |
| `aposPrimeiroEnvio` | Depois da primeira escolha do protagonista |
| `conversaConcluida` | Depois da última resposta do dono |

> [!info] Silhueta e presença narrativa
> A silhueta SVG permanece visível na cena, mas `personagensPresentes` está vazio. A interpretação atual é que a arte representa o protagonista ou um elemento provisório, não outra pessoa disponível para conversa.

## Interface Do Celular

### Abertura

`abrirCelular()`:

- Altera o modo para `celular`.
- Restaura a tela inicial.
- Exibe o overlay animado.
- Atualiza hora e data.
- Inicia o relógio a cada segundo.
- Move o foco para Mensagens.

### Navegação

O botão **Voltar** utiliza a tela atual:

- `mensagens` → `inicio`.
- `inicio` → fecha o celular.

Ao fechar o aparelho:

- O relógio é interrompido.
- O timer de mensagens é cancelado.
- O progresso narrativo permanece em memória.
- O foco retorna ao botão **Celular**.

### Aplicativos

| Aplicativo | Status |
|---|---|
| Mensagens | Funcional |
| Galeria | Placeholder sem ação |
| Notas | Placeholder sem ação |
| Arquivos | Placeholder sem ação |

## Aplicativo Mensagens

### Estrutura Do DOM

```html
<section id="phone-messages" aria-labelledby="messages-header">
  <header id="messages-header">???</header>
  <div id="messages-list" aria-live="polite"></div>
  <div id="messages-choices" role="group" aria-label="Escolha uma resposta"></div>
</section>
```

### Modelo Narrativo

```js
mensagens: {
  dono: {
    inicio: "celular-encontrado",
    abertura: [],
    etapas: {
      etapaId: {
        recebidas: [],
        opcoes: [
          {
            id: "opcao-id",
            texto: "Mensagem do protagonista",
            resposta: ["Resposta do dono"],
            proxima: "outra-etapa"
          }
        ]
      }
    }
  }
}
```

### Regras Das Etapas

- Cada etapa possui entre uma e três opções.
- Cada opção possui identificador único.
- `texto` é enviado pelo protagonista.
- `resposta` contém a reação específica do dono.
- `proxima` aponta para outra etapa.
- `proxima: null` encerra a conversa.
- As opções não selecionadas não entram no histórico.

### Etapas Existentes

| Etapa | Opções | Resultado |
|---|---:|---|
| `celular-encontrado` | 3 | Converge para `explicar-teste` |
| `explicar-teste` | 2 | Converge para `questionar-confianca` |
| `questionar-confianca` | 1 | Avança para `encerrar-contato` |
| `encerrar-contato` | 2 | Encerra em `null` |

### Responsabilidades Principais

| Função | Responsabilidade |
|---|---|
| `obterEtapaMensagem()` | Acessa uma etapa da árvore |
| `adicionarMensagem()` | Insere uma entrada no histórico |
| `prepararEnvioDono()` | Configura fila, destino e cooldown |
| `agendarEnvioDono()` | Agenda cooldown ou próxima entrega |
| `enviarProximaMensagemDono()` | Entrega apenas uma mensagem |
| `finalizarEnvioDono()` | Libera opções ou conclui o chat |
| `escolherResposta()` | Registra a escolha do jogador |
| `renderizarMensagens()` | Atualiza balões e indicador |
| `renderizarEscolhas()` | Cria os botões da etapa atual |

## Timers E Ritmo

Os valores ficam centralizados em `CONFIG`:

```js
const CONFIG = Object.freeze({
  velocidadeDigitacao: 22,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280
});
```

### Cooldown Inicial

- Só ocorre depois da primeira mensagem do protagonista.
- Dura 1 minuto.
- Durante o cooldown, as escolhas ficam ocultas.
- O indicador de digitação ainda não aparece.
- O prazo é salvo como horário absoluto em `cooldownAte`.

### Entrega Sequencial

- Depois do cooldown, `digitando...` é exibido.
- Cada mensagem do dono é removida individualmente da fila.
- O intervalo entre entregas é de 1,2 segundo.
- Depois da última mensagem, a próxima etapa é ativada.

### Retomada

Se o celular for fechado durante o cooldown, o timer é cancelado, mas o horário final permanece. Ao retornar a Mensagens, o código calcula o tempo restante.

> [!note] Persistência limitada
> Histórico, cooldown e progresso sobrevivem à navegação interna, mas não a um recarregamento, fechamento do navegador ou encerramento do aplicativo.

## Interface E Acessibilidade

### Responsividade Implementada

Em telas menores que `700px`:

- A interface principal muda de linha para coluna.
- A barra lateral vira uma barra inferior.
- Título e versão são ocultados.
- Botões principais dividem a largura.
- O celular é reduzido.
- Balões podem ocupar até 84% da largura.
- A área de escolhas recebe mais espaço vertical.

### Recursos De Acessibilidade

- Ações interativas usam `button`.
- As escolhas possuem `role="group"`.
- A região de histórico usa `aria-live="polite"`.
- As escolhas possuem estilo de `:focus-visible`.
- O foco é movido em transições importantes.
- Mensagens são inseridas com `textContent`.

### Pontos Ainda Não Validados

- Navegação completa somente por teclado.
- Leitores de tela.
- Contraste formal.
- Zoom e fontes ampliadas.
- Orientação paisagem.
- Safe areas e recortes de tela.
- `prefers-reduced-motion`.
- Trava de foco dentro do overlay.

## Execução E Android

### Web Local

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`.

### Scripts

| Comando | Função |
|---|---|
| `npm run copy:web` | Recria `www` com os arquivos web |
| `npm run sync` | Copia a web e sincroniza o Android |
| `npm run apk` | Sincroniza e gera o APK de debug |
| `npm test` | Placeholder; atualmente encerra com erro |

### Capacitor

| Configuração | Valor |
|---|---|
| App ID | `com.sanmd.game` |
| Nome | `SANMD` |
| Diretório web | `www` |
| Capacitor | 8.5.0 |
| Android mínimo | SDK 24 |
| Android alvo | SDK 36 |
| Java | 21 |
| Node.js | 22 ou superior |

> [!warning] Build Android
> A estrutura Android existe, mas o APK e os testes Android ainda precisam de validação. O teste instrumentado padrão também referencia um pacote diferente de `com.sanmd.game` e deve ser corrigido.

## Matriz De Funcionalidades

| Recurso | Status | Observação |
|---|---|---|
| Cena noturna | Implementado | Estática e provisória |
| Silhueta SVG | Implementado | Papel narrativo ainda provisório |
| Conversar | Implementado | Executa monólogos na cena atual |
| Diálogo digitado | Implementado | Clique, `Enter` e espaço |
| Monólogos por progresso | Implementado | Três fases |
| Conversa presencial | Parcial | Motor existe, conteúdo não |
| Celular | Implementado | Overlay com tela inicial |
| Relógio e data | Implementado | Valores locais |
| Mensagens | Implementado | Chat ramificado curto |
| Respostas selecionáveis | Implementado | De uma a três opções |
| Cooldown inicial | Implementado | 1 minuto |
| Entrega sequencial | Implementado | Uma mensagem por vez |
| Histórico na sessão | Implementado | Somente em memória |
| Voltar e Escape | Implementado | Navegação contextual web |
| Responsividade | Parcial | CSS existe; validação pendente |
| Capacitor Android | Parcial | Configurado; build pendente |
| Galeria | Placeholder | Sem ação |
| Notas | Placeholder | Sem ação |
| Arquivos | Placeholder | Sem ação |
| Persistência permanente | Não implementado | Sem save/localStorage |
| Investigação | Não implementado | Planejado no GDD |
| Puzzles | Não implementado | Planejado no GDD |
| Terminal | Não implementado | Planejado no GDD |
| Múltiplas cenas | Não implementado | Planejado no GDD |
| Finais e replay | Não implementado | Planejado no GDD |
| ARG | Não implementado | Planejado no GDD |

## Limitações Atuais

### Narrativa

- Existe somente uma cena.
- Não há personagens presenciais cadastrados.
- Todas as ramificações convergem para o mesmo fluxo.
- O contato permanece identificado como `???`.
- Não existem finais distintos.

### Sistemas

- Estado volátil sem save/load.
- Sem gerenciamento de múltiplas partidas.
- Sem sistema de inventário ou evidências.
- Sem eventos de cenário.
- Sem áudio.
- Sem investigação, terminal ou puzzles.

### Interface

- Galeria, Notas e Arquivos parecem clicáveis, mas não executam ações.
- O overlay não possui trava completa de foco.
- O botão físico Voltar do Android não possui tratamento específico.
- Bateria e sinal são decorativos.

### Qualidade

- Não existe suíte de testes versionada para o jogo.
- `npm test` é apenas um placeholder.
- Não existe CI.
- Responsividade e acessibilidade dependem de validação manual.
- O APK ainda não foi validado ponta a ponta.

## Roadmap Futuro

O roadmap abaixo separa evolução técnica imediata da visão narrativa do [[GDD]].

### Fase 0 — Fundação Atual

Status: **implementada**.

- [x] Cena base.
- [x] Visual Novel e diálogo digitado.
- [x] Celular e navegação contextual.
- [x] Mensagens ramificadas.
- [x] Cooldown e entrega sequencial.
- [x] Monólogos por progresso.
- [x] Configuração Capacitor.

### Fase 1 — Estabilização Da V1

Status: **próxima prioridade**.

- [ ] Validar todos os caminhos do chat.
- [ ] Criar testes automatizados para a máquina de estados.
- [ ] Validar responsividade em diferentes resoluções.
- [ ] Validar teclado, toque e leitor de tela.
- [ ] Corrigir teste instrumentado Android.
- [ ] Gerar e testar APK de debug.
- [ ] Tratar o botão físico Voltar no Android.

### Fase 2 — Persistência E Conteúdo

Status: **planejada**.

- [ ] Salvar histórico e progresso.
- [ ] Restaurar sessão após fechar o jogo.
- [ ] Implementar Galeria.
- [ ] Implementar Notas.
- [ ] Implementar Arquivos.
- [ ] Cadastrar personagens e conversas presenciais.
- [ ] Adicionar novas cenas.

### Fase 3 — Investigação

Status: **visão do GDD**.

- [ ] Objetos clicáveis.
- [ ] Evidências.
- [ ] Navegação por mapa.
- [ ] Pistas ambientais.
- [ ] Puzzles.
- [ ] Terminal hacker.

### Fase 4 — Estrutura Narrativa Completa

Status: **visão do GDD**.

- [ ] Múltiplos atos.
- [ ] Cronômetro de clímax.
- [ ] Finais diferentes.
- [ ] Replay narrativo.
- [ ] Progresso de 100%.
- [ ] Camadas metalinguísticas.
- [ ] Integração ARG.

## Validação Pendente

- [ ] Percorrer todas as oito opções cadastradas.
- [ ] Confirmar todas as reações específicas.
- [ ] Confirmar o cooldown real de 1 minuto.
- [ ] Fechar e reabrir o celular durante o cooldown.
- [ ] Confirmar entrega individual de todas as mensagens.
- [ ] Validar os três monólogos nos momentos corretos.
- [ ] Testar clique, `Enter`, espaço e `Escape`.
- [ ] Testar teclado, mouse e toque no chat.
- [ ] Testar larguras abaixo e acima de `700px`.
- [ ] Testar orientação paisagem.
- [ ] Validar contraste e foco.
- [ ] Executar `npm run sync` em ambiente Android configurado.
- [ ] Gerar e instalar o APK de debug.

## Referências

- [[README]] — visão geral e execução.
- [[TODO]] — tarefas concluídas e pendentes.
- [[FeatureArquiteture]] — detalhes da arquitetura de mensagens.
- [[GDD]] — visão narrativa e mecânicas futuras.
- [index.html](index.html) — estrutura atual.
- [styles.css](styles.css) — apresentação atual.
- [js/data.js](js/data.js) — dados narrativos atuais.
- [js/game.js](js/game.js) — regras e estado atuais.

> [!tip] Uso No Obsidian
> Use esta nota como índice técnico principal. As seções podem ser transformadas em notas independentes no futuro e conectadas por links wiki sem alterar a organização conceitual.
