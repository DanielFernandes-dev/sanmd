# TODO — FONTE OCULTA

Itens pendentes para evoluir o protótipo (Atos 1–3 jogáveis) até um jogo completo.

## Conteúdo / Roteiro
- [ ] Escrever roteiro detalhado do Ato 1 e do primeiro puzzle tutorial
- [ ] Expandir diálogos (hoje resumidos) com escolhas ramificadas
- [ ] Adicionar mais cenas por ato (não só sala de estar e delegacia)
- [ ] Reforçar pistas do Ato 2 (notícias de instabilidade, avisos do desenvolvedor)
- [ ] Escrever epílogos detalhados dos 3 finais (culpado perfeito, verdade parcial, sacrifício)

## Arte / Identidade Visual
- [ ] Definir identidade visual e layout definitivo (mockup da tela dividida)
- [ ] Substituir CSS art por sprites/cenários finais
- [ ] Personagens e retratos para a Visual Novel
- [ ] Efeito CRT mais rico e tema visual do terminal
- [ ] Versão mobile/responsiva (hoje tela fixa 1280x720 escalada)

## Áudio
- [ ] Trilha sonora por ato (tensão crescente no Ato 3)
- [ ] Efeitos sonoros: teclado do terminal, notificações, vibração do celular
- [ ] Design de som para a trava sensorial e o alarme do cronômetro

## Mecânicas / Gameplay
- [ ] Timer do Ato 3: balancear 90s com playtests
- [ ] Mais comandos no terminal (persistência entre Atos)
- [ ] Minigames adicionais (quebra de padrão, geolocalização de pistas)
- [ ] Sistema de escolhas que afetam a avaliação dos finais

## Técnica / Código
- [ ] Persistência de jogo (save/continue via localStorage)
- [ ] Tela de opções (volume, velocidade de texto, CRT on/off)
- [ ] Extrair avaliação de finais e parser do terminal para funções puras testáveis
- [ ] Testes automatizados (validação de finais e comandos)
- [ ] Converter para ES modules quando houver build (ver ADR-0001/0003)
- [ ] Migração para framework (React/Phaser) avaliada com base nos ADRs

## QA / Polimento
- [ ] Playtest ponta a ponta dos 3 finais
- [ ] Correção de fluxos: pular diálogos, estado travado, restart limpo
- [ ] Acessibilidade: contraste, tempo do Ato 3 configurável
