# Sim, Acredite nas Mentiras Dele kk

Protótipo web de uma Visual Novel de investigação ambientada em São Paulo, com narrativa, exploração point-and-click, celular, puzzles e elementos de ARG.

> **Status:** Protótipo V1 em desenvolvimento
>
> **Referências:** Ace Attorney, SIMULACRA, Cicada 3301, Enigma do Medo e estética hacker retrô

## Sobre o projeto

MJ é uma investigadora criminal e consultora técnica ligada à polícia. Depois de um caso introdutório, ela encontra uma nota com um enigma que conduz a coordenadas, um cofre e o celular de Lulith. O aparelho inicia a investigação principal por meio de mensagens, arquivos, interfaces e puzzles.

O protótipo valida a apresentação visual, a navegação entre cenas, diálogos, monólogos, interações point-and-click, Bolsa, celular e Save/Load. O conteúdo e a arte ainda são provisórios em várias áreas.

## Como executar

O projeto pode ser aberto diretamente pelo `index.html`, mas é recomendado usar um servidor HTTP local. Com Python 3, na raiz do projeto:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

Para executar somente a versão web, não é necessário instalar pacotes.

### Gerar o APK Android

Com Node.js, Java e Android SDK configurados:

```bash
npm ci
npm run apk
```

O comando copia `index.html`, `styles.css`, `js/` e `assets/` para `www/`, sincroniza o Capacitor e executa `assembleDebug` em `android/`.

## Controles

| Ação | Controle |
|---|---|
| Pular cutscene | Duplo clique ou duplo toque |
| Conversar | Botão **Conversar** |
| Mostrar destinos | Botão **Ir para** |
| Abrir celular | Botão **Celular** |
| Abrir Bolsa | Botão **Bolsa** |
| Avançar fala | Clique na caixa, `Enter` ou espaço |
| Fechar menu ou voltar | `Escape` ou botão **Voltar** |

## Estrutura do projeto

```text
.
├── index.html              # Estrutura da VN, overlays e celular
├── styles.css              # Apresentação, animações e responsividade
├── js/                     # Sistemas existentes e carregador de cenas, sem bundler
│   └── scenes/             # Eventos exclusivos carregados ao entrar no local
├── assets/                 # Cenários, sprites, interfaces e áudio
├── test/                   # Suítes Node.js e helper do ambiente DOM
├── docs/                   # Contratos técnicos e decisões
├── android/                # Projeto Android gerado pelo Capacitor
├── scripts/                # Verificações de navegador/overlay
├── capacitor.config.json  # Configuração do Capacitor
├── package.json            # Scripts e dependências
├── AGENTS.md               # Orientações para desenvolvimento
├── ESTRUTURA_GAMING.md     # Arquitetura e estado implementados
├── REGRAS_DE_DESIGN.md     # Regras visuais e contratos de assets
├── GDD.md                  # Design narrativo de longo prazo
├── IDEIA_CONCEITUAL.md      # Decisões e pendências conceituais
├── TODO.md                 # Roadmap e convenções
└── README.md               # Entrada do projeto
```

## Testes

Os testes usam o runner nativo do Node e mocks de DOM:

```bash
npm test
```

A suíte cobre navegação, cenas, cutscenes, diálogos e monólogos, celular, Bolsa, Galeria, entrada de texto, transições, persistência, menu inicial e estação de trabalho. Renderização real, áudio, toque e temporização em WebView ainda exigem validação manual.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Instruções de desenvolvimento e contratos essenciais |
| [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md) | Decisões e pendências conceituais |
| [`GDD.md`](GDD.md) | Design narrativo e mecânico de longo prazo |
| [`TODO.md`](TODO.md) | Roadmap, convenções e checklist de revisão |
| [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) | Arquitetura, estado e fluxos implementados |
| [`REGRAS_DE_DESIGN.md`](REGRAS_DE_DESIGN.md) | Regras visuais e organização de assets |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Fluxo de composição e dependências atuais |
| [`docs/JS_MODULES.md`](docs/JS_MODULES.md) | Referência dos módulos JavaScript |
| [`docs/STATUS_PROJETO.md`](docs/STATUS_PROJETO.md) | Estado, evidências e pendências do protótipo |
| [`docs/SAVE_SYSTEM.md`](docs/SAVE_SYSTEM.md) | Contrato de Save/Load |
| [`docs/SCENE_TRANSITIONS.md`](docs/SCENE_TRANSITIONS.md) | Transições e bloqueio de input |
| [`docs/POINT_AND_CLICK.md`](docs/POINT_AND_CLICK.md) | Hotspots e Bolsa |
| [`docs/TEXT_INPUT.md`](docs/TEXT_INPUT.md) | Teclado virtual e entrada de texto |
| [`docs/PHONE_THEMES.md`](docs/PHONE_THEMES.md) | Temas do celular |
| [`docs/cutscenes.md`](docs/cutscenes.md) | Sequências e tempos das cutscenes |
| [`docs/ADR_LOG.md`](docs/ADR_LOG.md) | Decisões arquiteturais históricas |
| [`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md) | Contratos de mecânicas e animações |
| [`docs/mapa-global.md`](docs/mapa-global.md) | Computador, bilhete, coordenadas e viagens |
| [`docs/INTERFACE_INPUT.md`](docs/INTERFACE_INPUT.md) | Toque, foco e verificações no navegador |
| [`assets/audio/README.md`](assets/audio/README.md) | Sons locais e geração reproduzível |
| [`assets/cenario/README.md`](assets/cenario/README.md) | Contrato dos cenários |
| [`assets/interfaces/README.md`](assets/interfaces/README.md) | Contrato dos ícones e interfaces |
| [`assets/sprites/README.md`](assets/sprites/README.md) | Contrato dos sprites |

Os documentos técnicos incluem registros históricos e trechos que ainda precisam ser atualizados. Para o recorte jogável atual, veja o fluxo abaixo; a implementação é a referência para conferir os contratos.

## Fluxo jogável atual

```text
Inicialização → Cutscene de abertura → Menu em caderno
  ├── Novo jogo → Cutscene de Lulith → Casa → Cena do crime → Delegacia → Beco
  └── Carregar → Registro salvo → Cena restaurada

No beco: abrir cofre → coletar celular → Sair do beco → Encerramento → Menu
```

As quatro ações principais permanecem disponíveis conforme o estado: Conversar, Ir para, Celular e Bolsa. O celular contém Mensagens, Arquivos e Galeria funcionais no recorte atual. O Save continua sendo um sistema geral do jogo, com autosave e até nove saves manuais fotográficos.

## Escopo futuro

Casa, James, investigação básica na cena do crime, bilhete, computador e localização do beco por coordenadas já estão implementados. O roteiro completo do caso, o descarte narrativo da nota, os puzzles definitivos, terminal, replay, progresso, finais e arte final continuam no planejamento.

A migração arquitetural começou de forma incremental: eventos exclusivos da casa, da cena do crime e da delegacia são carregados ao entrar nesses locais, e imagens do mapa e do computador só são requisitadas ao abrir suas interfaces. Os demais sistemas ainda usam scripts clássicos carregados na inicialização. A separação completa por sistemas/cenas e a avaliação de ganhos de desempenho continuam pendentes.
