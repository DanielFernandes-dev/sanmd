# ADR-0004: Interface em camadas sobrepostas

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O GDD pede um mockup de tela dividida: a cena da Visual Novel com o smartphone
sobreposto e o terminal hacker em camada profunda. Navegação por páginas/rotas
desperdiçaria o efeito de "camada" e complicaria a sobreposição.

## Decisão

Implementar uma tela única em camadas empilhadas por `z-index`:
- Cena (Visual Novel point-and-click) e caixa de diálogo.
- Celular simulado deslizando sobre a cena (painel direito).
- Terminal CRT como overlay em tela cheia.
- Modais, avisos (toasts) e painel DEV acima de tudo.

## Consequências

- Positivas: fidelidade ao mockup do GDD; trocas de contexto rápidas; transições
  simples (transform/opacity).
- Negativas: hierarquia de z-index precisa de disciplina; conteúdo de cenas novas
  exige mais CSS art.
- Mitigação: manter constante a ordem dos z-index e usar classes utilitárias de
  visibilidade (`hidden`, `off`).
