# Visuais do celular

Os temas usam `state.aparelho.phoneTheme`, persistido pelo Save/Load e aplicado
em `data-phone-theme` na tela do celular. A aparência é independente do aparelho
ativo. Não existem versões separadas dos apps ou da Galeria.

| Tema | Tela inicial | Fundos dos apps | Uso narrativo |
| --- | --- | --- | --- |
| `lulith` | Gradiente azul escuro, sem assinatura MJ | Mensagens, Arquivos e Galeria usam a paleta azul escura; Galeria sem assinatura MJ | Tema inicial do aparelho ao ativá-lo pela Bolsa |
| `mj` | Wallpaper e assinatura MJ preservados | Fundos existentes de Mensagens e Arquivos; Galeria com cabeçalho translúcido, assinatura e detalhes rosa preservados | Tema reservado para futura personalização; também preservado em saves legados |

As regras base de `styles.css` preservam os visuais anteriores, inclusive os
fundos de cada app. As regras específicas de `data-phone-theme="lulith"`
adaptam somente a apresentação atual. Os assets de wallpaper continuam no projeto.

A mudança da Galeria uniformiza o fundo, o cabeçalho e as superfícies de controles
com os outros apps. Fotografias, nove slots, captura, confirmação, exclusão,
Save/Load e autosave mantêm a implementação existente.

A futura personalização/saída do beco continua pendente. A Cutscene 02 de Novo
jogo (`lulith_codigo`) não ativa o aparelho nem troca o tema: o jogador ainda
precisa coletar o celular no cofre e usá-lo na Bolsa.
