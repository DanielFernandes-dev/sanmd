# Sim, Acredite nas Mentiras Dele — SANMD

Protótipo de Visual Novel investigativa ambientada em São Paulo, com MJ como protagonista, exploração point-and-click, diálogos, celular e inventário. Disponível em navegador e Android via Capacitor; conteúdo e arte estão em desenvolvimento.

O recorte atual percorre casa, cena do crime, delegacia e beco, com investigação básica, mensagens, arquivos, fotografias/saves e cutscenes. Campanha completa, ARG e múltiplos finais permanecem planejados.

O mapa global é compartilhado pelo PC da delegacia e pelo celular da Lulith, após ativar o aparelho pela Bolsa. O ícone Mapas permanece desabilitado no celular da MJ. Ambos os acessos usam os mesmos destinos, desbloqueios e dados do Save v1.

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

### Instalar e abrir pelo ADB

Com a depuração ativada e o aparelho autorizado, consulte `adb devices -l`. Na depuração sem fio, use `adb pair IP:PORTA_PAREAMENTO` e informe o código exibido pelo Android; depois use `adb connect IP:PORTA_CONEXAO`. As duas portas podem ser diferentes.

Substitua `SERIAL` pelo identificador listado pelo ADB:

```bash
adb -s SERIAL install -r android/app/build/outputs/apk/debug/app-debug.apk
adb -s SERIAL shell am force-stop com.sanmd.game
adb -s SERIAL shell am start -W -n com.sanmd.game/.MainActivity
```

`install -r` atualiza o aplicativo preservando os dados existentes. A abertura confirma a inicialização; posicionamento dos objetos e funcionamento completo exigem validação no aparelho.

## Controles

Use **Conversar**, **Ir para**, **Celular** e **Bolsa** conforme desbloqueados. Clique na caixa, Enter ou espaço avança falas; Escape volta quando permitido. Duplo clique/toque pula cutscenes.

## Desenvolvimento e testes

Leia [AGENTS.md](AGENTS.md) antes de alterar o projeto. Execute a suíte nativa do Node:

```bash
npm test
```

Testes usam mocks e verificações de fontes/assets; renderização, toque e áudio reais exigem QA em navegador e Android.

Na validação de 09/10/2026 do commit `cfa1b28`, os 241 testes passaram. A bolsa recebeu deslocamentos verticais e a chave teve sprite e hotspot ampliados. O alinhamento visual da bolsa com o chão ainda aguarda confirmação; os deslocamentos são medidos na arte lógica e variam em pixels na tela conforme a escala.

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
