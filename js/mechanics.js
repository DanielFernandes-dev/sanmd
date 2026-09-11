/** Strategy: resolve apenas tipos próprios e mantém regras fora da apresentação. */
function criarRegistroMecanicas(estrategias) {
  const registro = Object.freeze({ ...estrategias });
  return Object.freeze({
    obter: tipo => Object.hasOwn(registro, tipo) ? registro[tipo] : null
  });
}

/** As cinco mecânicas atuais compartilham o pipeline de validação da cena. */
function criarMecanicasHotspot({ services }) {
  const semEfeitoAdicional = () => true;
  return criarRegistroMecanicas({
    examine: semEfeitoAdicional,
    interact: semEfeitoAdicional,
    collect: hotspot => services.adicionarItem(hotspot.itemId),
    use_item: semEfeitoAdicional,
    trigger: semEfeitoAdicional
  });
}
