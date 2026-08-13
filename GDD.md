# Game Design Document — Sim, Acredite nas Mentiras Dele kk

## 1. Visão Geral do Projeto

- **Gênero:** Visual Novel · Investigação · Escape Room · Puzzle · ARG
- **Plataforma:** Android (APK), com possibilidade de adaptação para Web/Desktop
- **Modelo:** Projeto experimental / vibecoding
- **Público-alvo:** Jogadores que gostam de mistério, enigmas, investigação, narrativas não lineares e experiências metalinguísticas.
- **Inspirações Principais:** Ace Attorney (Gyakuten Saiban), SIMULACRA, Cicada 3301, Enigma do Medo e estética Hacker Retrô (CRT, Terminal, texto monoespaçado).

---

## 2. Premissa & Enredo

### Protagonista

- **Perfil:** Consultor técnico da polícia.
- **Ponto de Partida:** Encontra um celular desconhecido em sua própria casa.

### A Criação

O aparelho está bloqueado. Depois de investigar suas primeiras barreiras de segurança, ele consegue entrar em contato com o proprietário. O dono afirma que o celular faz parte de um "teste de recrutamento e lógica" com fragmentos de código espalhados pelo mundo real.

Inicialmente, o protagonista aceita a explicação. Porém, ao tentar envolver a polícia, o comportamento do celular muda. O terminal desaparece. O sistema bloqueia determinadas funções quando detecta mais de uma pessoa próxima. Os superiores consideram a situação paranoia. Sem apoio, ele decide investigar sozinho.

### A Verdade

Os códigos espalhados não são apenas enigmas. Eles fazem parte de um vírus autônomo desenvolvido para invasões invisíveis. Um desenvolvedor dissidente descobriu o projeto e tentou impedir sua utilização. Antes de desaparecer, ele criptografou o vírus e criou um mecanismo de emergência. As chaves foram fragmentadas. O protagonista percebe que tudo foi planejado para fazê-lo parecer responsável. O dono do celular precisava de alguém capaz de encontrar as chaves, resolver os enigmas, reunir os fragmentos, ativar o sistema e assumir a culpa pela invasão.

---

## 3. Pilares do Projeto

| Pilar            | Objetivo                                         |
| ---------------- | ------------------------------------------------ |
| 🔍 Investigação  | Fazer o jogador questionar cada informação       |
| 🧩 Puzzles       | Esconder informações atrás de desafios           |
| 📱 Celular       | Servir como principal interface narrativa        |
| 🪞 Metalinguagem | Fazer o jogo ultrapassar sua própria interface   |
| 🌐 ARG           | Conectar o jogo ao mundo externo                 |
| 🔄 Replay        | Transformar novas partidas em investigação       |
| 🕵️ Mistério     | Manter respostas ambíguas até a descoberta       |
| 💯 100%          | Recompensar quem reconstruir a história completa |

---

## 4. Estrutura Narrativa em Cinco Camadas

```text
HISTÓRIA
   ↓
INVESTIGAÇÃO
   ↓
METALINGUAGEM
   ↓
ARG
   ↓
VERDADE
```

O jogador casual pode simplesmente jogar a campanha e alcançar um final. O jogador investigador começa a revisitar cenas e procurar pistas. O jogador dedicado passa a explorar arquivos e elementos externos à experiência normal. O jogador que alcançar 100% deverá conseguir reconstruir praticamente toda a história oculta.

---

## 5. Ato I — A Curiosidade

### Objetivo

Introduzir o celular, seus sistemas, o proprietário, os primeiros enigmas e a relação entre protagonista e aparelho.

### Gameplay

O jogador aprende: exploração point-and-click, interface do celular (mensagens, galeria, notas, arquivos), primeiros puzzles e o terminal. O proprietário apresenta toda a situação como um teste de lógica/recrutamento.

---

## 6. Ato II — O Falso Teste

O protagonista começa a desconfiar da situação. Quando tenta apresentar o celular à polícia, o terminal desaparece devido à trava de presença. O sistema aparentemente exige que o protagonista esteja sozinho. Os superiores consideram a situação paranoia. Sem apoio, ele continua investigando sozinho.

### Pistas ambientais

O cenário começa a apresentar notícias sobre instabilidade de sistemas, documentos, horários, fotografias, inscrições, informações aparentemente desconectadas e mensagens que contradizem o proprietário.

---

## 7. Ato III — A Conspiração

A verdade começa a aparecer. Os códigos espalhados são um vírus autônomo. Um desenvolvedor dissidente o criptografou e criou um mecanismo de emergência. A reintrodução das chaves poderia ativar um rastreamento, alertar a polícia e localizar a origem da invasão. O protagonista percebe que foi usado como bode expiatório.

### Clímax

Quando o rastreamento é ativado, a polícia começa a cercar o protagonista. Um cronômetro aparece. O jogador precisa resolver os últimos enigmas antes que o cerco seja concluído. A partir desse momento, **tempo passa a ser um recurso real**. (Ver ADR-0006)

---

## 8. Mecânicas de Gameplay

### A. Investigação Point-and-Click

O jogador explora cenários investigando objetos, fotografias, documentos, computadores, celulares, inscrições, relógios, notícias e elementos aparentemente decorativos. Nem toda pista é obrigatória; algumas existem exclusivamente para a investigação de 100%.

### B. Interface do Celular

Apps simulados que funcionam como canal narrativo:

- **💬 Mensagens:** Comunicação principal com o proprietário.
- **🖼️ Galeria:** Fotografias, gravações e pistas visuais.
- **📝 Notas:** Informações contextuais.
- **📁 Arquivos:** Documentos, dados corrompidos e informações ocultas.

### C. Terminal Hacker

Interface CRT retrô com comandos:

```text
decode
scan
decrypt
access
trace
```

Puzzles envolvem substituição, padrões, criptografia, códigos, sequências, lógica e fragmentos de texto. A dificuldade aumenta progressivamente.

### D. Trava de Presença

O terminal só funciona quando o protagonista está sozinho. Se outra pessoa entra no ambiente, o sistema exibe `ACESSO BLOQUEADO`. (Ver ADR-0006)

---

## 9. Sistema de Finais

Os finais representam diferentes níveis de sucesso e conhecimento.

| Final | Condição | Desfecho Narrativo |
|---|---|---|
| **Final 1: O Culpado Perfeito** | Poucas senhas / Tempo esgotado | Preso sem provas; o vilão fica com parte do código; ninguém acredita no consultor. |
| **Final 2: A Verdade Parcial** | Metade das senhas decifradas | Preso, mas com registros que plantam a dúvida em um aliado policial. |
| **Final 3: O Sacrifício / Verdadeiro** | 100% das senhas decifradas a tempo | O protagonista corrompe/destrói o vírus. É preso, mas o desenvolvedor dissidente aparece para ajudá-lo. |

> **Terminar a história não significa necessariamente compreendê-la.**

---

## 10. Segunda Camada Narrativa

O jogo não exige que o jogador encontre todo o conteúdo adicional para terminar a história principal. Porém, essas descobertas podem alterar finais, desbloquear informações, mudar interpretações, revelar personagens, apresentar novas cenas e revelar a história completa.

### A Rota do Início

Uma das principais camadas opcionais está escondida na abertura. O jogador pode encontrar **"Sempre lembre do seu início."** Na primeira execução, há uma tela de criação de senha. Depois de avançar na história, ele pode salvar, reiniciar, voltar ao momento inicial, criar uma senha diferente e desbloquear conteúdo anteriormente inacessível. Essa mecânica transforma o próprio **replay** em uma ferramenta de investigação.

### Gravações Apagadas

A senha alternativa pode permitir acesso a gravações antigas do dono do celular. Elas não devem simplesmente explicar a história; seu objetivo é **recontextualizar acontecimentos já vistos**.

> Campanha: "Eu não conheço ninguém da polícia."
>
> Gravação: O jogador vê o proprietário conversando com um policial.

A pergunta deixa de ser **"Quem está dizendo a verdade?"** e passa a ser: **"Por que ele precisou mentir?"**

### O Parceiro

Existe uma segunda pessoa relacionada ao dono do celular, descoberta através de mensagens criptografadas, arquivos, documentos e pistas ambientais. Sua intenção permanece ambígua. Ele pode ter participado do plano, conhecer a origem do vírus, ter se voltado contra o proprietário ou possuir objetivos próprios.

---

## 11. Metalinguagem e ARG

### Camada A — Arquivos reais do APK

O jogador pode explorar os arquivos que compõem o próprio jogo.

```text
assets/
├── scenes/
├── scripts/
├── audio/
├── data/
└── archive/
```

Arquivos escondidos podem conter mensagens, códigos, diálogos, pistas, documentos e arquivos corrompidos.

### Camada B — Arquivos dentro do universo do jogo

Paralelamente, o protagonista investiga arquivos dentro da própria narrativa. Assim existem duas investigações:

```text
JOGADOR
   ↓
investiga o APK

PROTAGONISTA
   ↓
investiga o sistema
```

### ARG como extensão narrativa

O dono do celular pode dar instruções que parecem relacionadas aos arquivos internos do aparelho. Posteriormente, ele pode dizer: **"Procura onde o programa guarda as coisas."** O jogador pode interpretar isso como uma instrução para investigar o próprio APK.

### Metalinguagem progressiva

| Etapa | Descoberta do jogador |
|---|---|
| 1 | "O jogo está escondendo coisas." |
| 2 | "Os arquivos do jogo têm informações." |
| 3 | "Alguém dentro da história sabe que esses arquivos existem." |
| 4 | **"O jogo está falando diretamente comigo."** |

---

## 12. O Título como Pista

> **Sim, Acredite nas Mentiras Dele kk**

O **"kk"** possui função narrativa. Ele funciona como uma característica textual recorrente do proprietário ou de outro personagem. Exemplos: "relaxa kk", "foi só um teste kk", "não precisa confiar em mim kk". Ao longo do jogo, o jogador começa a associar:

```text
kk
 ↓
PERSONAGEM
 ↓
MENTIRA
```

Assim, o próprio título se transforma em uma pista retrospectiva.

---

## 13. Sistema de Progresso

Após qualquer final, o jogador acessa uma tela de investigação que registra o que foi encontrado.

### Finais

```text
☑ Final 1
☑ Final 2
☐ Final 3
☐ Final 4
```

### Evidências

```text
☑ Fotografia
☑ Registro telefônico
☑ Código
☐ Gravação 02
☐ Arquivo corrompido
```

### Pistas

```text
☑ "Sempre lembre do seu início."
☑ "Ele não está sozinho."
☐ "Mensagem desconhecida."
```

### Investigação

```text
68%
```

A checklist **não informa como encontrar o conteúdo restante**. Ela funciona como um mapa conceitual da investigação realizada.

---

## 14. Sistema de 100%

O jogador pode terminar a história sem atingir 100%. Para considerar a história completamente investigada, é necessário descobrir:

- Todos os finais.
- Todas as principais evidências.
- Gravações.
- Arquivos.
- Pistas.
- Personagens ocultos.
- Conteúdos ARG.
- Informações necessárias para reconstruir a história completa.

O 100% representa: **"Você descobriu tudo que existe para descobrir."** — e não simplesmente: **"Você coletou todos os itens."**

---

## 15. Pistas Pós-Final

Cada final pode fornecer pistas para encontrar outros caminhos.

### Exemplo

Após o Final 1: **"Algumas coisas que foram apagadas ainda podem ser lembradas."** (direciona para as gravações do início)

Após outro final: **"Nem toda mensagem foi enviada para você."** (direciona para o parceiro)

As pistas devem orientar sem entregar diretamente a solução.

---

## 16. Filosofia de Replay

Cada nova partida deve possuir uma finalidade.

```text
PRIMEIRA PARTIDA
"O que aconteceu?"
        ↓
SEGUNDA
"Como consigo outro final?"
        ↓
TERCEIRA
"O que aquela pista significava?"
        ↓
QUARTA
"O que existe no início?"
        ↓
QUINTA
"O que existe nos arquivos?"
        ↓
FINAL
"Qual é a história verdadeira?"
```

> **Replay é investigação.**

---

## 17. Progressão Ideal do Jogador

```text
JOGAR
  ↓
ZERAR
  ↓
PERCEBER QUE EXISTE MAIS
  ↓
REVISITAR
  ↓
ENCONTRAR PISTAS
  ↓
DESCOBRIR ROTAS ALTERNATIVAS
  ↓
INVESTIGAR O APK
  ↓
DESCOBRIR O PARCEIRO
  ↓
RECONSTRUIR A HISTÓRIA
  ↓
100%
```

---

## 18. Princípio Narrativo Central

> **O jogo nunca deve mentir diretamente para o jogador.**

O jogo pode omitir, distorcer, contextualizar, esconder informações e permitir que personagens mintam. Mas as pistas devem existir desde o começo. Depois de descobrir a verdade, o jogador deve conseguir voltar e perceber: **"O jogo tinha me mostrado isso. Eu simplesmente não sabia interpretar."**

Esse princípio é especialmente importante para o ARG e para o título.

---

## 19. Experiência Desejada

A experiência ideal possui três momentos de compreensão:

| Momento | Realização |
|---|---|
| **Depois do primeiro final** | "Entendi o que aconteceu." |
| **Depois da segunda camada** | "Não. Eu entendi o que queriam que eu acreditasse." |
| **Ao atingir 100%** | "Agora eu sei o que realmente aconteceu." |

Essa diferença entre **zerar** e **compreender** é o núcleo do projeto.

---

## 20. Arquitetura Técnica (Contexto do Projeto)

### Estado atual do protótipo

- **Plataforma:** Web / Desktop (HTML/CSS/JS vanilla, sem build).
- **Estrutura:** Separada em `js/data.js` (conteúdo) e `js/game.js` (motor) — ver ADR-0003.
- **Interface:** Camadas sobrepostas (Visual Novel + Smartphone + Terminal) — ver ADR-0004.
- **Terminal:** Parser de comandos para puzzles — ver ADR-0005.
- **Atos 2 e 3:** Multi-cena, cronômetro e três finais — ver ADR-0006.

### Variáveis de estado relevantes

- `tempo_restante`
- `fragmentos_coletados`
- `local_isolado`
- `state.timerRunning`
- `state.isolated`

---

## 21. Status do Projeto

**Tipo:** Projeto experimental / vibecoding
**Plataforma inicial:** Android (APK)
**Possíveis plataformas futuras:** Web / Desktop
**Estrutura:** Visual Novel + Investigação + Puzzle + ARG
**Estado:** Em desenvolvimento / definição de conceito

---

> **Você pode terminar o jogo.**
>
> **Você pode até achar que entendeu a história.**
>
> **Mas talvez tenha acreditado na mentira dele.**
>
> **kk**
