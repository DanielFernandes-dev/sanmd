# Game Design Document (GDD)

## 1. Visão Geral do Projeto

- **Gênero:** Visual Novel / Escape Room Investigativo / Puzzle de Terminal.
- **Inspirações Principais:** Ace Attorney (Gyakuten Saiban), SIMULACRA, Cicada 3301 e estética Hacker Retrô.
- **Plataforma:** Web / Desktop (com interface simulando smartphone e terminal).
- **Público-Alvo:** Fãs de mistério, enigmas lógicos e narrativas investigativas com múltiplos finais.

## 2. Premissa & Enredo

### Protagonista

- **Perfil:** Consultor técnico da polícia.
- **Ponto de Partida:** Encontra um celular misterioso deixado em sua própria casa.

### Estrutura em Três Atos (Plots)

**Ato 1 (A Curiosidade):**
O protagonista tenta fuçar no celular para identificar o dono e devolvê-lo. Ao desbloquear as primeiras travas, estabelece contato remoto com o proprietário.

**Ato 2 (O Falso Teste & O Isolamento):**
- O dono afirma que o celular é um "teste de recrutamento e lógica" com fragmentos de código espalhados pelo mundo real.
- Ao tentar reportar o caso à delegacia, o celular oculta o terminal devido a uma trava de presença única (sensores térmicos/radar que bloqueiam o app se houver mais de uma pessoa por perto).
- Sem apoio dos superiores, que o julgam paranoico, ele decide resolver o caso sozinho.
- Pistas no cenário: notícias de instabilidade em sistemas e avisos enigmáticos deixados pelo desenvolvedor original mostram que há algo errado.

**Ato 3 (A Conspiração & O Cronômetro):**
- O código fragmentado é, na verdade, um vírus autônomo projetado para invasões invisíveis.
- Um desenvolvedor dissidente havia criptografado o vírus e colocado um alarme com rastreio em tempo real para a polícia caso as senhas fossem reinseridas.
- O protagonista descobre que foi usado como bode expiatório para reunir as chaves e assumir a culpa da invasão.

## 3. Pilares de Gameplay & Mecânicas

### A. O Ciclo de Feedback (Mão Dupla)

**Visual Novel (Mundo Real / Investigação):**
Exploração point-and-click de cenários, leitura de diálogos, busca de pistas visuais em objetos (inscrições, horários, fotos).

**Interface do Smartphone (Camada Moderna):**
Apps simulados (Chat, Galeria, Notas) usados para receber mensagens e organizar pistas contextuais.

**Terminal Hacker (Camada Profunda):**
Interface CRT retrô onde o jogador insere chaves, executa comandos simples (decode, scan, decrypt) e quebra criptografias estilo Cicada 3301.

**Regra da Trava Sensorial:**
O terminal só pode ser aberto em cenas onde o protagonista está sozinho no cenário.

### B. Clímax com Cronômetro

- No Ato 3, o sistema de rastreamento é ativado e a polícia inicia o cerco.
- Um temporizador de contagem regressiva surge na tela, forçando o jogador a agir rápido para resolver os últimos enigmas antes da invasão da delegacia.

## 4. Sistema de Finais (Perspectivas)

| Final | Condição | Desfecho Narrativo |
|---|---|---|
| **Final 1: O Culpado Perfeito** | Poucas senhas / Esgotou o tempo | Preso sem provas; o vilão fica com parte do código; ninguém acredita no consultor. |
| **Final 2: A Verdade Parcial** | Metade das senhas decifradas | Preso, mas com a posse de registros de áudio que plantam a dúvida em um colega policial leal. |
| **Final 3: O Sacrifício / Verdadeiro** | 100% das senhas decifradas a tempo | O protagonista usa o acesso total para corromper e destruir o código do vírus, frustrando o vilão. Ele é preso, mas o desenvolvedor dissidente aparece para se aliar a ele e provar sua inocência no julgamento. |

## 5. Próximos Passos de Desenvolvimento

1. Definir a identidade visual e layout (Mockup da tela dividida: Cena da Visual Novel + Smartphone sobreposto).
2. Escrever o roteiro detalhado do Ato 1 e do primeiro puzzle tutorial.
3. Estruturar as variáveis de estado no código (`tempo_restante`, `fragmentos_coletados`, `local_isolado`).
