# Sim, Acredite nas Mentiras Dele kk

Protótipo web de uma Visual Novel de investigação que combina narrativa, interface de celular, puzzles e elementos de ARG.

> **Status:** Protótipo V1 em desenvolvimento
>
> **Referências:** Ace Attorney, SIMULACRA, Cicada 3301, Enigma do Medo e estética hacker retrô

## Sobre o projeto

O protagonista é um consultor técnico da polícia que encontra um celular desconhecido em sua própria casa. Ao entrar em contato com o proprietário, recebe a explicação de que o aparelho faz parte de um teste de recrutamento e lógica. Conforme investiga, ele percebe que o celular, os códigos e as mensagens escondem algo maior.

O objetivo da V1 é validar a estrutura visual e a experiência básica antes do desenvolvimento do jogo completo. O protótipo utiliza conteúdo e arte provisórios para testar:

- Layout inspirado na interface compacta de Ace Attorney para Nintendo DS.
- Apresentação de cenário e personagem.
- Sistema de diálogos com efeito de digitação.
- Navegação entre a Visual Novel e o celular.
- Organização dos aplicativos simulados do aparelho.
- Funcionamento em desktop e dispositivos móveis.

## Estado atual

O núcleo do protótipo é uma aplicação web estática feita com HTML, CSS e JavaScript. O projeto também possui uma camada Capacitor para gerar o aplicativo Android.

Já estão disponíveis:

- Cena noturna provisória.
- Personagem provisório em SVG.
- Botões **Conversar** e **Celular**.
- Caixa de diálogo com nome, falas sequenciais e efeito de digitação.
- Avanço do diálogo por clique, `Enter` ou barra de espaço.
- Interface de celular com relógio, data e aplicativos provisórios.
- Conversa ramificada com o dono dentro do aplicativo **Mensagens**.
- Respostas selecionáveis com reações e histórico do caminho escolhido.
- Monólogo do protagonista ao usar **Conversar** na sala vazia.
- Retorno contextual do celular pelo botão **Voltar** ou pela tecla `Escape`.
- Layout responsivo para telas menores.
- Projeto Android e comando de build de APK com Capacitor.

## Celular, mensagens e conversas

A interface separa as conversas presenciais das mensagens digitais:

- O diálogo com o dono do celular acontece dentro do aplicativo **Mensagens**.
- As mensagens do dono são exibidas à esquerda e as do protagonista à direita.
- O botão **Conversar** é usado para interações presenciais.
- Quando o protagonista está sozinho, **Conversar** apresenta um pensamento ou monólogo.
- O botão **Voltar** fica no canto inferior da interface do celular.
- Dentro de Mensagens, **Voltar** retorna à tela inicial do aparelho.
- Na tela inicial, **Voltar** fecha o celular e retorna ao cenário.

Os requisitos e as instruções detalhadas de implementação estão em [`FeatureArquiteture.md`](FeatureArquiteture.md).

## Como executar

O projeto pode ser aberto diretamente pelo `index.html`, mas é recomendado usar um servidor HTTP local.

Com Python 3:

```bash
python3 -m http.server 8000
```

Depois, acesse:

```text
http://localhost:8000
```

Para executar somente a versão web, não é necessário instalar pacotes.

### Gerar o APK Android

Com Node.js, Java e o Android SDK configurados:

```bash
npm ci
npm run apk
```

O comando copia os arquivos web, sincroniza o projeto Capacitor e executa o build Android de debug.

## Controles

| Ação | Controle |
|---|---|
| Iniciar conversa | Botão **Conversar** |
| Avançar ou completar uma fala | Clique na caixa, `Enter` ou espaço |
| Abrir o celular | Botão **Celular** |
| Voltar ou fechar o celular | Botão **Voltar** ou `Escape` |

## Estrutura do projeto

```text
.
├── index.html       # Estrutura da Visual Novel e do celular
├── styles.css       # Aparência, animações e responsividade
├── js/
│   ├── data.js      # Cena, personagem e falas provisórias
│   └── game.js      # Estado, diálogos e navegação
├── android/          # Projeto nativo gerado pelo Capacitor
├── capacitor.config.json # Configuração do aplicativo Android
├── package.json      # Dependências e comandos de build
├── GDD.md           # Visão completa do jogo e da narrativa
├── FeatureArquiteture.md # Próximas alterações e como implementá-las
├── TODO.md          # Lista de tarefas do protótipo
└── README.md        # Visão geral e instruções de execução
```

## Fluxo da V1

```text
Cenário
   │
   ├── Conversar ──> Diálogo ou monólogo ──> Cenário
   │
   └── Celular ──> Tela inicial ──> Aplicativos ──> Voltar
```

O celular é a principal interface narrativa planejada. Seus aplicativos simulados são:

- **Mensagens:** comunicação com o proprietário.
- **Galeria:** fotografias, gravações e pistas visuais.
- **Notas:** informações contextuais.
- **Arquivos:** documentos, dados corrompidos e conteúdo oculto.

Na V1 atual, **Mensagens** está funcional; os demais aplicativos ainda são elementos provisórios.

## Escopo da V1

A V1 busca validar somente a base da interface e das interações. Permanecem fora deste protótipo inicial:

- Sistema completo de investigação.
- Exame e apresentação de evidências.
- Navegação por mapa.
- Puzzles e terminal hacker.
- ARG e integrações externas.
- Sistema de finais e progresso de 100%.
- Replay narrativo.
- Arte e narrativa definitivas.

Esses recursos fazem parte da visão de longo prazo descrita no [`GDD.md`](GDD.md), mas não são necessários para validar a estrutura atual.

## Critérios de validação

A estrutura básica da V1 será considerada funcional quando for possível:

- [x] Visualizar um cenário provisório.
- [x] Visualizar um personagem provisório.
- [x] Utilizar o botão **Conversar**.
- [x] Exibir e avançar uma sequência de falas.
- [x] Utilizar o botão **Celular**.
- [x] Abrir uma interface provisória de celular.
- [x] Retornar à interface principal.
- [x] Repetir a navegação sem quebrar o estado da interface.
- [x] Conversar com o dono pelo aplicativo **Mensagens**.
- [x] Usar **Conversar** como monólogo quando o protagonista estiver sozinho.
- [x] Posicionar o botão **Voltar** dentro do celular.

> A V1 não precisa representar o jogo final. Ela precisa mostrar se essa estrutura é a direção certa para o projeto.
