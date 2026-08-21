# Protótipo V1 — Estrutura Base

> Referência: Ace Attorney (Nintendo DS)

## Objetivo

A primeira versão do protótipo tem como objetivo testar, na prática, a estrutura visual e a experiência básica de interação do jogo.

Esta versão será baseada diretamente na estrutura da versão Nintendo DS de *Ace Attorney*.

O objetivo não é desenvolver o jogo final neste momento, mas criar uma primeira casca jogável para avaliar:

- Layout.
- Organização da interface.
- Apresentação dos personagens.
- Sistema de diálogos.
- Distribuição dos elementos na tela.
- Sensação de navegação pela interface.

O conteúdo utilizado será provisório e poderá ser completamente substituído posteriormente.

---

## 1. Estrutura da Interface

A tela principal será dividida em duas áreas.

```
┌──────────────────────────────────────┬──────────────┐
│                                      │              │
│                                      │              │
│                                      │              │
│           VISUAL NOVEL               │  CONVERSAR   │
│                                      │              │
│        PERSONAGEM / CENÁRIO          │  CELULAR     │
│                                      │              │
│                                      │              │
└──────────────────────────────────────┴──────────────┘
```

### Lado esquerdo

Será a área principal da experiência.

Responsável por:

- Cenário.
- Personagens.
- Diálogos.
- Apresentação visual da cena.
- Elementos da Visual Novel.

A organização visual será baseada na versão Nintendo DS de *Ace Attorney*.

### Lado direito

Será a área de ações.

Nesta primeira versão existirão somente dois botões:

- **Conversar**
- **Celular**

Não serão implementados outros botões de ação nesta versão.

---

## 2. Referência Nintendo DS

A estrutura visual da versão Nintendo DS de *Ace Attorney* será utilizada como base para o protótipo.

A intenção é reproduzir a sensação de uma interface dividida, utilizando:

- Área principal para a cena.
- Área lateral para comandos.
- Elementos visuais compactos.
- Interface com aparência de jogo portátil.
- Apresentação de diálogos semelhante à Visual Novel.

A referência será utilizada diretamente nesta primeira versão para permitir uma avaliação prática da estrutura.

---

## 3. Botão Conversar

O botão **Conversar** será responsável pelas interações com personagens.

A apresentação dos diálogos será baseada no estilo de *Ace Attorney*.

Exemplo:

```
┌──────────────────────────────────────┬──────────────┐
│                                      │              │
│             PERSONAGEM               │  CONVERSAR   │
│                                      │              │
│                                      │  CELULAR     │
│  ┌──────────────────────────────┐    │              │
│  │ Personagem                   │    │              │
│  │                              │    │              │
│  │ "Você estava aqui ontem?"    │    │              │
│  └──────────────────────────────┘    │              │
└──────────────────────────────────────┴──────────────┘
```

O sistema deverá permitir:

- Exibir o nome do personagem.
- Exibir as falas.
- Avançar o diálogo.
- Alternar entre falas.
- Encerrar a conversa.

A primeira versão não precisa possuir uma estrutura complexa de diálogo.

O objetivo é testar a apresentação.

---

## 4. Botão Celular

O botão **Celular** será a segunda ação disponível na interface principal.

Ao selecioná-lo, o jogador poderá acessar a interface do celular.

A implementação detalhada do celular não faz parte do objetivo deste protótipo.

Nesta versão, o botão existe principalmente para testar:

- Como uma segunda interface será aberta.
- Como ela ocupará a tela.
- Como o jogador retornará para a interface principal.
- Como a ação ficará visualmente ao lado de Conversar.

---

## 5. Cenários

Os cenários serão provisórios.

O objetivo é possuir elementos visuais suficientes para testar a interface, sem investir ainda em arte definitiva.

Podem ser utilizados:

- Fundos simples.
- Imagens provisórias.
- Cenários improvisados.
- Elementos gráficos temporários.

A qualidade artística não será um critério desta versão.

---

## 6. Personagens

Os personagens também serão provisórios.

Serão utilizados apenas para testar:

- Posicionamento.
- Escala.
- Presença na cena.
- Apresentação durante os diálogos.
- Relação entre personagem e caixa de diálogo.

Não será necessário desenvolver sprites ou designs definitivos.

---

## 7. Fluxo de Teste

O protótipo deverá permitir uma pequena sequência jogável.

```
┌─────────────────┐
│     CENÁRIO     │
│                 │
│   PERSONAGEM    │
└────────┬────────┘
         │
         ▼
    CONVERSAR
         │
         ▼
     DIÁLOGO
         │
         ▼
      CELULAR
         │
         ▼
   INTERFACE DO
      CELULAR
         │
         ▼
       VOLTAR
         │
         ▼
      CENÁRIO
```

O objetivo é testar a transição entre as duas ações principais e a apresentação da Visual Novel.

---

## 8. Conteúdo Provisório

Todo o conteúdo utilizado nesta versão deverá ser considerado temporário.

Isso inclui:

- Personagens.
- Cenários.
- Textos.
- Diálogos.
- Imagens.
- Ícones.
- Elementos da interface.

O conteúdo definitivo será desenvolvido posteriormente.

---

## 9. Fora do Escopo

A V1 **não** terá como objetivo implementar:

- Sistema de investigação.
- Examinar.
- Apresentar evidências.
- Navegação por mapa.
- Puzzles.
- Terminal.
- ARG.
- Sistema de finais.
- Sistema de 100%.
- Replay.
- Narrativa definitiva.
- Arte definitiva.

Esses elementos não fazem parte deste primeiro teste.

---

## 10. Critério de Sucesso

A V1 será considerada funcional quando for possível:

- [ ] Visualizar um cenário.
- [ ] Visualizar um personagem.
- [ ] Utilizar o botão Conversar.
- [ ] Exibir uma sequência de diálogos.
- [ ] Utilizar o botão Celular.
- [ ] Abrir uma interface provisória de celular.
- [ ] Retornar à interface principal.
- [ ] Alternar entre essas interfaces sem problemas.

O principal objetivo é conseguir jogar a primeira versão e visualizar na prática como essa estrutura de interface funciona.

> «A V1 não precisa representar o jogo final. Ela precisa permitir descobrir se essa casca é a direção que queremos seguir.»
