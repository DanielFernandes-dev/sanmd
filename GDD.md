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

- **Nome de desenvolvimento:** MJ; o nome real será escolhido pelo jogador.
- **Perfil:** Mulher, investigadora criminal/consultora técnica ligada à polícia.
- **Experiência:** Enigmas, ARGs, escape rooms e atividades semelhantes.
- **Estado inicial:** Cansada e dormindo mal por causa do trabalho antes dos eventos principais.
- **Traço de personalidade:** Teme interpretar evidências de forma errada ou estar diante de uma farsa, ilusão ou alucinação. Esse medo sustenta sua personalidade, mas não é o centro da trama nem uma mecânica principal.

### Ponto de partida

Após uma cutscene provisória de Lulith, William James acorda MJ e a leva para uma cena de crime. O jogador resolve um caso introdutório que ensina investigação point-and-click. De volta à delegacia, MJ encontra uma nota criptografada sobre sua mesa.

O jogador recebe duas escolhas explícitas:

1. Amassar a nota e jogá-la fora, encerrando imediatamente o jogo com um percentual mínimo de conclusão.
2. Resolver o enigma, revelar coordenadas e continuar a investigação.

MJ consulta as coordenadas no computador da delegacia, desloca-se ao local indicado e encontra um cofre protegido por outro puzzle. Dentro dele está o celular de Lulith, que inicia a trama principal.

### Trama principal

O aparelho contém inicialmente pistas capazes de antecipar informações do Ato II. Depois da conclusão da primeira conversa, um último arquivo é liberado e começa uma janela de um minuto. Ao final dela, Lulith reinicia o celular remotamente: o conteúdo desaparece do acesso normal e o aparelho passa a parecer comum, além das funções específicas do jogo.

Lulith escolheu MJ por sua experiência com enigmas e experiências imersivas. MJ não é a única candidata testada. A origem dos testes, o objetivo verdadeiro do celular, a situação dos demais candidatos e aquilo que Lulith deseja recuperar ainda não estão definidos.

> A antiga trama do vírus autônomo e do protagonista usado como bode expiatório não é mais tratada como verdade canônica. Seus elementos só poderão retornar após nova decisão narrativa.

### Localização

A história se passa em **São Paulo**. Bairros, delegacia e locais de investigação ainda serão definidos.

### Personagens principais

- **MJ:** protagonista curiosa, analítica e experiente em enigmas.
- **Lulith:** dona do celular; influencia as pessoas sem ordens explícitas, usa tom leve e perde a calma quando perde o controle. Não haverá romance entre ela e MJ.
- **William James:** amigo de dormitório, antigo professor de MJ na preparação para o concurso e seu colega de ramo há cerca de dois anos. Sua preocupação com o cansaço de MJ não invalida a competência dela.

O jogo terá no máximo seis personagens principais/relevantes. Os demais nomes e funções ainda estão pendentes.

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

Apresentar MJ e James, ensinar a investigação, introduzir a nota, o deslocamento, o cofre, o celular, Lulith e os principais sistemas de gameplay.

### Gameplay

1. Cutscene provisória de Lulith falando sobre recuperar aquilo que lhe foi tirado.
2. James acorda MJ e a leva à cena do crime.
3. Caso introdutório e tutorial de investigação point-and-click.
4. Retorno à mesa na delegacia e descoberta da nota.
5. Escolha entre o final imediato ou a resolução do enigma.
6. Consulta das coordenadas, deslocamento e puzzle do cofre.
7. Obtenção do celular, exploração dos arquivos iniciais e primeiro contato anônimo com Lulith.
8. Rotas condicionais de conversa, liberação do enigma de identidade e cronômetro de um minuto.
9. Reset remoto e apresentação de Mensagens, Galeria, Câmera, Notas, Arquivos, Terminal, Mapa, Progresso e Salvamento/replay.

O caso introdutório poderá usar temporariamente o primeiro julgamento de *Ace Attorney* como referência estrutural de prototipagem, mas deverá receber conteúdo original.

### Primeiro contato, arquivos e reset

O contato permanece identificado como `???` durante a primeira conversa e não revela nome, gênero ou informações pessoais. MJ presume inicialmente que o dono do aparelho seja um homem.

Antes do reset, o aparelho apresenta quatro registros:

| Arquivo | Informação | Efeito no fluxo |
|---|---|---|
| `CANDIDATOS_04.log` | Existem outros perfis avaliados em São Paulo | Libera uma pergunta sobre candidatos |
| `ROTA_013.txt` | Nota, coordenadas, cofre e aparelho formam uma rota planejada | Libera uma rota sobre a origem do celular |
| `RECUPERAR.tmp` | O contato deseja recuperar algo que lhe foi tirado | Libera uma cobrança direta |
| `REMETENTE.enc` | `5-12-1`, usando A1Z26, resulta em `ELA` | Permite deduzir que a dona do aparelho é uma mulher |

Os três primeiros arquivos podem ser examinados antes ou durante a conversa. A primeira resposta condicional escolhida fixa um único monólogo interno de MJ, relacionado a candidatos, rota ou recuperação. Mesmo que outros registros tenham sido vistos, essas reflexões não se misturam na mesma partida, incentivando replay.

Antes de resolver o enigma de identidade, os monólogos individuais usam o masculino presumido por MJ. Depois da solução `ELA`, a rota escolhida é preservada, mas sua redação passa ao feminino.

`REMETENTE.enc` só aparece depois da conclusão da conversa. Sua liberação inicia um cronômetro vermelho de um minuto. Se o jogador examinar os quatro arquivos e resolver o enigma, um quarto monólogo substitui a rota individual e conecta todas as informações.

Quando o tempo termina, Lulith reinicia o aparelho remotamente. Mensagens e Arquivos permanecem acessíveis, mas seus conteúdos visíveis desaparecem. O protótipo preserva internamente, apenas durante a sessão, os arquivos vistos, a solução, o histórico e a rota de monólogo.

---

## 6. Ato II — O Falso Teste

**Status: pendente de reestruturação.**

MJ começa a reconstruir a história por fragmentos e percebe que a aparente motivação de vingança de Lulith não significa exatamente o que parecia na abertura. O ato deverá aprofundar os testes, os demais candidatos e as informações vistas antes do reset do celular.

### Pistas ambientais

O cenário deverá apresentar documentos, horários, fotografias, inscrições, objetos, interfaces e mensagens aparentemente desconectadas. Esses elementos precisam permitir deduções e contradições sem depender de explicações diretas dos personagens.

---

## 7. Ato III — A Conspiração

**Status: pendente de definição.**

Os atos posteriores deverão revelar a motivação de Lulith, a origem dos testes, o objetivo do celular e o destino dos candidatos. A verdade será reconstruída pelo jogador por meio de investigação, puzzles, interfaces e replay.

### Clímax

O clímax e o uso de tempo como recurso ainda precisam ser confirmados. A estrutura final deve recompensar o compartilhamento de informações e a capacidade de MJ de confiar em outras pessoas, conforme o código dramático provisório da personagem.

---

## 8. Mecânicas de Gameplay

### A. Investigação Point-and-Click

O jogador explora cenários investigando objetos, fotografias, documentos, computadores, celulares, inscrições, relógios, notícias e elementos aparentemente decorativos. Nem toda pista é obrigatória; algumas existem exclusivamente para a investigação de 100%.

### B. Navegação Contextual Entre Cenas

O protótipo usa o comando **Ir para** para apresentar somente os destinos conectados à cena atual. O menu é uma extensão contextual do ícone, não uma sidebar nem um modal, e deve ocupar pouco espaço sem ocultar desnecessariamente o cenário.

Os destinos são botões de texto reais, acessíveis por teclado, empilhados quando existe mais de uma opção. A implementação atual valida uma rota curta entre `beco_entrada`, `beco_interior` e `beco_fundo`; ela serve de base técnica para locais futuros, mas não define ainda o mapa completo do Ato I.

Como regra de design, o menu não deve competir com a cena: não possui título, moldura ornamental, backdrop ou aparência de formulário. A apresentação pode se adaptar entre desktop e celular, mas deve permanecer compacta, legível, próxima ao comando e separada da lógica que determina os destinos.

### C. Interface do Celular

Apps simulados que funcionam como canal narrativo:

- **💬 Mensagens:** Comunicação principal com Lulith; o primeiro contato permanece anônimo e possui opções condicionadas às pistas examinadas.
- **🖼️ Galeria:** Fotografias, gravações e pistas visuais.
- **📷 Câmera:** Registro de pistas e possível sistema diegético de salvamento.
- **📝 Notas:** Informações contextuais.
- **📁 Arquivos:** Documentos, dados corrompidos, informações ocultas e gatilhos para rotas de conversa e monólogos.
- **⌨️ Terminal:** Interface central de puzzles e acesso a informações escondidas.
- **🗺️ Mapa:** Consulta de locais e deslocamento.
- **💯 Progresso:** Percentual da história reconstruída.
- **💾 Salvamento/replay:** Retomada e investigação de novas perspectivas.

### D. Terminal Hacker

Interface de puzzle cuja linguagem visual e comandos definitivos ainda precisam ser definidos. Comandos possíveis para prototipagem:

```text
decode
scan
decrypt
access
trace
```

Puzzles envolvem substituição, padrões, criptografia, códigos, sequências, lógica e fragmentos de texto. A dificuldade aumenta progressivamente.

### E. Trava de Presença

Existe a ideia de o terminal esconder ou bloquear funções quando outras pessoas estão presentes. Essa regra é provisória e ainda precisa ser validada narrativa e tecnicamente.

---

## 9. Sistema de Finais

Os finais representam principalmente perspectivas diferentes de MJ sobre aquilo que conseguiu descobrir. Cada rota pode revelar informações distintas, sem necessariamente constituir uma realidade separada.

| Final | Condição | Função narrativa |
|---|---|---|
| **Nota descartada** | Amassar e jogar fora a nota | Encerrar antes da investigação principal e mostrar progresso mínimo. |
| **Perspectivas parciais** | Seguir rotas e reunir conjuntos diferentes de pistas | Revelar partes da cronologia e incentivar reinterpretação. |
| **Final verdadeiro** | Reconstrução completa da investigação | Oferecer o único encerramento realmente completo. |

A quantidade, os nomes, as condições e a relação exata entre o final verdadeiro, todos os finais e o progresso de 100% permanecem pendentes.

> **Terminar a história não significa necessariamente compreendê-la.**

---

## 10. Segunda Camada Narrativa

O jogo não exige que o jogador encontre todo o conteúdo adicional para terminar a história principal. Porém, essas descobertas podem alterar finais, desbloquear informações, mudar interpretações, revelar personagens, apresentar novas cenas e revelar a história completa.

### História fragmentada

A origem dos testes, a motivação de Lulith, os acontecimentos anteriores, a verdade por trás do celular e os participantes envolvidos serão apresentados em fragmentos. O jogador deverá formar uma cronologia a partir deles.

### Informações anteriores ao reset

O conteúdo acessível no celular antes de Lulith reiniciá-lo poderá antecipar descobertas do Ato II. Replay, arquivos recuperados e novas perspectivas podem permitir que o jogador compreenda melhor aquilo que viu sem contexto.

No recorte atual, candidatos, rota de entrega e recuperação representam três perspectivas individuais. A primeira resposta condicional escolhida determina qual delas será elaborada pelo monólogo de MJ. A leitura dos quatro arquivos libera uma perspectiva combinada. Quando houver persistência entre partidas, essa estrutura deverá estimular o jogador a repetir o Ato I para acessar as outras interpretações.

### Outros candidatos

Uma cena provisória poderá mostrar o computador de Lulith e sua pesquisa por pessoas da região com experiência em ARGs e escape rooms. A quantidade de candidatos, o destino deles e a possível presença de outro candidato no elenco principal ainda serão definidos.

---

## 11. Metalinguagem e ARG

**Status: direção planejada, ainda sem função definitiva na história.**

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

Instruções de Lulith podem apontar simultaneamente para arquivos dentro da narrativa e para elementos externos ao jogo. A integração definitiva com o APK, a Web ou o mundo real ainda precisa ser definida e não deve ser obrigatória até que sua acessibilidade e manutenção sejam avaliadas.

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

O uso de **"kk"** como pista textual recorrente de Lulith ou de outro personagem permanece como hipótese de design. Caso seja mantido, deve adquirir significado retrospectivo sem tornar a identidade ou a mentira óbvios desde o início.

```text
kk
 ↓
PERSONAGEM
 ↓
MENTIRA
```

Essa função ainda precisa ser confirmada ao definir a história completa.

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

- As perspectivas necessárias para compreender a história.
- Todas as principais evidências.
- Gravações.
- Arquivos.
- Pistas.
- Personagens ocultos.
- Conteúdos ARG.
- Informações necessárias para reconstruir a história completa.

O 100% representa: **"Você descobriu tudo que existe para descobrir."** — e não simplesmente: **"Você coletou todos os itens."**

Ainda será decidido se todos os finais precisam ser vistos para liberar o final verdadeiro e como cada categoria afeta o percentual.

---

## 15. Pistas Pós-Final

Cada final pode fornecer pistas para encontrar outros caminhos.

As pistas devem orientar sem entregar diretamente a solução. Elas podem indicar informações perdidas antes do reset, cenas que admitem outra interpretação, arquivos ignorados ou ações possíveis em uma nova partida.

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
DESCOBRIR OUTROS CANDIDATOS
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

O máximo possível da ambientação deve participar da narração: cenários, personagens, expressões, diálogos, objetos, interfaces, puzzles, mecânicas, arquivos, progresso e replay. A história não deve existir apenas no texto falado.

---

## 19. Experiência Desejada

A experiência ideal possui três momentos de compreensão:

| Momento | Realização |
|---|---|
| **Depois do primeiro final** | "Entendi o que aconteceu." |
| **Depois da segunda camada** | "Não. Eu entendi o que queriam que eu acreditasse." |
| **Ao atingir 100%** | "Agora eu sei o que realmente aconteceu." |

Essa diferença entre **zerar** e **compreender** é o núcleo do projeto.

### Direção artística

- A apresentação final será pixelada; pixel art não é apenas placeholder.
- Personagens serão apresentados em 2D, com sprites expressivos, poses marcantes e leitura clara de emoções.
- *Ace Attorney* é referência de linguagem visual e composição, não de personagens ou designs específicos.
- Protótipos 1 e 2 usarão personagens e cenários genéricos para validar narrativa e compatibilidade visual.
- O design definitivo será fechado apenas no Protótipo 3.
- Para os protótipos atuais, todos os elementos serão 2D.
- A dimensionalidade final dos cenários, entre 2D, 3D tratado como pixel art ou abordagem híbrida, permanece pendente.

A influência hentai ainda precisa ser decidida: ela pode permanecer apenas como referência estética de design ou deixar de integrar a definição de gênero.

---

## 20. Arquitetura Técnica (Contexto do Projeto)

### Estado atual do protótipo

- **Plataforma:** Web / Desktop (HTML/CSS/JS vanilla, sem build).
- **Estrutura:** Separada em `js/data.js` (conteúdo) e `js/game.js` (motor) — ver ADR-0003.
- **Interface implementada:** Cena em tela cheia com três comandos por ícones pixelados, menu contextual de destinos e smartphone sobreposto.
- **Conteúdo implementado:** Três cenas provisórias conectadas no beco, primeiro contato anônimo, opções condicionais validadas por arquivos, rotas de monólogo com pronome contextual, enigma A1Z26, cronômetro e reset remoto com estados explícitos.
- **Ainda não implementado:** Investigação point-and-click, terminal, sistema geral de puzzles, mapa completo, cenas canônicas do início do Ato I, atos completos, finais, progresso, replay persistente e ARG.
- **Compatibilidade narrativa:** O recorte do celular segue a direção atual do Ato I; a cena inicial ainda é provisória e começa depois de etapas narrativas não implementadas.

O estado atual existe somente em memória. Arquivos vistos, solução, histórico e rota de monólogo sobrevivem à navegação e ao reset durante a sessão, mas não ao recarregamento ou fechamento. Persistência, save por fotografia e gerenciamento de replay ainda são planejamento.

---

## 21. Status do Projeto

**Tipo:** Projeto experimental / vibecoding
**Plataforma do protótipo:** Web / Desktop, com camada Capacitor para Android
**Plataforma planejada:** Android (APK), com possibilidade de Web/Desktop
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
