# Sim, Acredite nas Mentiras Dele — SANMD

Protótipo de Visual Novel investigativa ambientada em São Paulo, com MJ como protagonista, exploração point-and-click, diálogos, celular e inventário. Disponível em navegador e Android via Capacitor; conteúdo e arte estão em desenvolvimento.

O recorte atual percorre casa, cena do crime, delegacia e beco, com investigação básica, mensagens, arquivos, fotografias/saves e cutscenes. Campanha completa, ARG e múltiplos finais permanecem planejados.

## Como executar

É possível abrir `index.html` diretamente, mas recomenda-se servidor HTTP local para validar recursos e scripts. Com Python 3, na raiz:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`. A versão web não exige instalação de pacotes.

### Gerar o APK Android

Com Node.js/npm, Java e Android SDK configurados:

```bash
npm ci
npm run apk
```

O comando recria `www/` com os recursos web, sincroniza Capacitor e executa `assembleDebug`. APK: `android/app/build/outputs/apk/debug/app-debug.apk`. Edite os fontes, não a cópia em www. Veja [ambiente e validação Android](AGENTS.md#validacao).

## Controles

Use **Conversar**, **Ir para**, **Celular** e **Bolsa** conforme desbloqueados. Clique na caixa, Enter ou espaço avança falas; Escape volta quando permitido. Duplo clique/toque pula cutscenes.

## Desenvolvimento e testes

Leia [AGENTS.md](AGENTS.md) antes de alterar o projeto. Execute a suíte nativa do Node:

```bash
npm test
```

Testes usam mocks e verificações de fontes/assets; renderização, toque e áudio reais exigem QA em navegador e Android.

## Estrutura resumida

```text
index.html / styles.css   Palco, interfaces e apresentação
js/                      Sistemas e composição, sem bundler
js/scenes/               Eventos locais parcialmente sob demanda
assets/                  Cenários, sprites, interfaces e áudio
test/ / scripts/         Testes Node e checks de navegador
android/                 Projeto/configuração nativa
docs/                    Contratos e histórico
AGENTS.md                Referência criativa, técnica e de manutenção
TODO.md                  Tarefas e planos futuros
```

## Documentação

- [AGENTS — referência central e índice dos contratos](AGENTS.md#documentacao).
- [TODO — roadmap](TODO.md).
- [ADR — decisões históricas](docs/ADR_LOG.md).
- [Auditoria documental — inventário e limpeza proposta](docs/AUDITORIA_DOCUMENTAL.md).

Documentos antigos foram preservados e sinalizados; suas propostas não significam funcionalidades implementadas.
