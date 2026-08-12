# ADR-0005: Terminal com parser de comandos para puzzles

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O pilar "Terminal Hacker" exige que o jogador insira chaves e execute comandos
para decodificar conteúdo (estilo Cicada 3301). O tutorial do Ato 1 usa um ciclo
`decode` → `scan` → `decode` para coletar fragmentos. Esses comandos precisam
evoluir (ex.: `decrypt`) nos Atos 2 e 3 e alimentar o estado dos fragmentos.

## Decisão

Implementar um interpretador de comandos (`exec`) com:
- Saída textual em "linhas" exibidas na tela CRT (com classes visuais).
- Comandos: `help`, `status`, `decode`, `scan`, `keys`, `decrypt`, `ls`,
  `whoami`, `checkin`, `clear`, `sair`.
- Suporte a decodificação de hex e base64 com detecção automática de formato.
- Efeitos colaterais controlados (progresso de tutorial, coleta de fragmentos,
  disparo de eventos) feitos via funções dedicadas.

## Consequências

- Positivas: puzzles rápidos de prototipar; respostas coerentes com o estado;
  fácil adicionar comandos novos por Ato.
- Negativas: parser simples (sem operadores/argumentos complexos) e o "script" do
  puzzle fica acoplado ao `exec`.
- Mitigação futura: extrair a definição de cada comando para uma tabela quando o
  número de comandos crescer.
