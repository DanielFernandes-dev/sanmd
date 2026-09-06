const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const zlib = require("node:zlib");

// Decode the RGBA8, non-interlaced PNG contract without adding runtime dependencies.
function lerPNG(arquivo) {
  const png = fs.readFileSync(arquivo);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  const largura = png.readUInt32BE(16);
  const altura = png.readUInt32BE(20);
  assert.deepEqual([...png.subarray(24, 29)], [8, 6, 0, 0, 0]);
  const partes = [];
  for (let pos = 8; pos < png.length;) {
    const tamanho = png.readUInt32BE(pos);
    if (png.toString("ascii", pos + 4, pos + 8) === "IDAT") partes.push(png.subarray(pos + 8, pos + 8 + tamanho));
    pos += tamanho + 12;
  }
  const dados = zlib.inflateSync(Buffer.concat(partes));
  const stride = largura * 4;
  assert.equal(dados.length, (stride + 1) * altura);
  const pixels = Buffer.alloc(stride * altura);
  for (let y = 0; y < altura; y += 1) {
    const filtro = dados[y * (stride + 1)];
    assert.ok(filtro <= 4);
    for (let x = 0; x < stride; x += 1) {
      const pos = y * stride + x;
      const a = x >= 4 ? pixels[pos - 4] : 0;
      const b = y > 0 ? pixels[pos - stride] : 0;
      const c = x >= 4 && y > 0 ? pixels[pos - stride - 4] : 0;
      const p = a + b - c;
      const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      const preditor = [0, a, b, Math.floor((a + b) / 2), paeth][filtro];
      pixels[pos] = (dados[y * (stride + 1) + x + 1] + preditor) & 255;
    }
  }
  return { largura, altura, pixels };
}

test("dez IDs fotográficos apontam para PNGs individuais distintos com transparência real", () => {
  const raiz = path.resolve(__dirname, "..");
  const data = vm.runInNewContext(`${fs.readFileSync(path.join(raiz, "js/data.js"), "utf8")}\nDATA`);
  const fotografia = data.personagens.mj.fotografia;
  const ids = Array.from({ length: 10 }, (_, i) => `mj__photo__${String(i + 1).padStart(2, "0")}`);
  assert.deepEqual(Array.from(fotografia.expressoes), ids);
  assert.deepEqual(Object.keys(fotografia.sprites).sort(), ids);
  const conteudos = new Set();
  for (const id of ids) {
    const relativo = `assets/sprites/mj/photo/${id}.png`;
    assert.equal(fotografia.sprites[id], relativo);
    const arquivo = path.join(raiz, relativo);
    const { largura, altura, pixels } = lerPNG(arquivo);
    assert.deepEqual([largura, altura], [512, 576], id);
    let transparentes = 0, quaseOpacos = 0, suaves = 0;
    for (let pos = 3; pos < pixels.length; pos += 4) {
      if (pixels[pos] === 0) transparentes += 1;
      // Generated alpha is commonly 250–254 inside the character; preserve it.
      else if (pixels[pos] >= 250) quaseOpacos += 1;
      else suaves += 1;
    }
    assert.ok(transparentes > largura * altura * 0.05, `${id}: fundo transparente`);
    assert.ok(quaseOpacos > largura * altura * 0.3, `${id}: personagem preservada`);
    assert.ok(suaves > 0, `${id}: contorno suavizado`);
    assert.equal(pixels[3], 0, `${id}: canto superior esquerdo`);
    assert.equal(pixels[largura * 4 - 1], 0, `${id}: canto superior direito`);
    conteudos.add(require("node:crypto").createHash("sha256").update(pixels).digest("hex"));
  }
  assert.equal(conteudos.size, 10);
});
