const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ===== Navigasi antar menu ===== */
$$('#nav button').forEach(b => b.onclick = () => {
  $$('#nav button').forEach(x => x.classList.toggle('on', x === b));
  $$('section').forEach(s => s.classList.toggle('show', s.id === b.dataset.t));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Simulasi impuls saraf ===== */
const steps = $$('#flow .step');
let timer = null;
const notes = [
  'Reseptor mengubah rangsang menjadi impuls saraf.',
  'Neuron sensorik bergerak menuju sumsum tulang belakang.',
  'Interneuron memproses; respons terjadi tanpa menunggu otak.',
  'Neuron motorik bergerak menuju otot (efektor).',
  'Kontraksi otot menarik tulang lewat tendon; sendi bergerak.',
  'Otak menerima informasi sehingga timbul kesadaran.'
];
function resetFlow() {
  clearInterval(timer);
  steps.forEach(s => s.classList.remove('act'));
  $('#flowinfo').textContent = 'Refleks adalah gerak cepat tanpa menunggu perintah sadar dari otak.';
}
$('#reset').onclick = resetFlow;
$('#play').onclick = () => {
  resetFlow();
  let i = 0;
  const go = () => {
    steps.forEach((s, k) => s.classList.toggle('act', k === i));
    $('#flowinfo').textContent = notes[i];
    if (++i >= steps.length) clearInterval(timer);
  };
  go();
  timer = setInterval(go, 1500);
};

/* ===== Tulang ===== */
const bones = {
  'b-tengkorak': ['Tengkorak', 'Melindungi otak. Tersusun dari tulang pipih yang saling terkunci (sutura).'],
  'b-belakang': ['Tulang belakang', '33 ruas tulang yang melindungi sumsum tulang belakang (jalur utama saraf) dan menopang tubuh.'],
  'b-rusuk': ['Tulang rusuk dan dada', 'Melindungi jantung dan paru-paru, membantu gerak pernapasan.'],
  'b-panggul': ['Tulang panggul', 'Menopang organ perut dan menghubungkan tubuh bagian atas dengan kaki.'],
  'b-humerus': ['Humerus (lengan atas)', 'Tulang pipa panjang; tempat melekat biseps dan triseps.'],
  'b-radius': ['Radius dan ulna (lengan bawah)', 'Memungkinkan lengan bawah dan pergelangan tangan berputar.'],
  'b-femur': ['Femur (paha)', 'Tulang terpanjang dan terkuat; menahan beban tubuh.'],
  'b-tibia': ['Tibia dan fibula (tulang kering)', 'Menopang berat tubuh dan menstabilkan pergelangan kaki.']
};
$$('#tulang [id^=b-], #tulang [data-id]').forEach(el => el.onclick = () => {
  const id = el.dataset.id || el.id;
  $$('#tulang .sel').forEach(x => x.classList.remove('sel'));
  $$('#tulang [id="' + id + '"], #tulang [data-id="' + id + '"]').forEach(x => x.classList.add('sel'));
  $('#boneinfo').innerHTML = '<b>' + bones[id][0] + '</b><br>' + bones[id][1];
});

/* ===== Sendi ===== */
const joints = {
  engsel: ['Sendi engsel', 'Gerak satu arah seperti pintu. Contoh: siku, lutut, jari.', [0, -70]],
  putar: ['Sendi putar', 'Gerak memutar pada satu poros. Contoh: tulang leher (atlas-axis), lengan bawah.', [-40, 40]],
  peluru: ['Sendi peluru', 'Gerak ke segala arah. Contoh: bahu dan pinggul.', [-60, 60]],
  pelana: ['Sendi pelana', 'Gerak dua arah, mirip pelana. Contoh: pangkal ibu jari.', [-35, 35]],
  luncur: ['Sendi luncur', 'Gerak menggeser terbatas. Contoh: antar ruas tulang belakang dan pergelangan tangan.', [-10, 10]]
};
Object.keys(joints).forEach(k => {
  const b = document.createElement('button');
  b.textContent = joints[k][0];
  b.onclick = () => {
    $$('#jointBtns button').forEach(x => x.classList.toggle('on', x === b));
    $('#jointinfo').innerHTML = '<b>' + joints[k][0] + '</b>: ' + joints[k][1];
    const a = joints[k][2], g = $('#jointAnim');
    let n = 0;
    g.style.transition = 'transform .6s';
    const iv = setInterval(() => {
      g.style.transform = 'rotate(' + a[n % 2] + 'deg)';
      if (++n > 5) { clearInterval(iv); g.style.transform = 'rotate(0deg)'; }
    }, 650);
  };
  $('#jointBtns').appendChild(b);
});

/* ===== Otot ===== */
function setArm(v) {
  v = +v;
  $('#arm').value = v;
  $('#forearm').setAttribute('transform', 'rotate(' + (-v) + ' 80 130)');
  const f = v / 140;
  $('#biceps').setAttribute('ry', 34 + 16 * f);
  $('#biceps').setAttribute('rx', 10 + 7 * f);
  $('#triceps').setAttribute('ry', 48 - 14 * f);
  $('#triceps').setAttribute('rx', 14 - 5 * f);
  $('#muscleinfo').textContent = f > 0.5
    ? 'Lengan menekuk: biseps berkontraksi (memendek dan menebal), triseps rileks.'
    : 'Lengan lurus: triseps berkontraksi, biseps rileks.';
}
$('#arm').oninput = e => setArm(e.target.value);
const animArm = t => {
  let v = +$('#arm').value;
  const iv = setInterval(() => {
    v += (t > v ? 4 : -4);
    setArm(v);
    if (Math.abs(t - v) < 4) { setArm(t); clearInterval(iv); }
  }, 16);
};
$('#flex').onclick = () => animArm(140);
$('#ext').onclick = () => animArm(0);

/* ===== Tulang belakang ===== */
const spineData = {
  normal: ['Normal', 'Tampak samping. Lengkung alami menyerap guncangan dan menjaga keseimbangan.'],
  skoliosis: ['Skoliosis', 'Tampak belakang. Tulang belakang melengkung ke samping seperti huruf S atau C. Bahu/pinggul terlihat tidak sejajar. Penyebab: bawaan, gangguan saraf/otot, atau tidak diketahui (idiopatik, paling sering pada remaja). Penanganan: pemantauan, fisioterapi, brace, operasi pada kasus berat.'],
  kifosis: ['Kifosis', 'Tampak samping. Punggung atas terlalu membungkuk ke belakang (bungkuk). Penyebab: postur buruk dalam waktu lama, tulang keropos, kelainan bawaan. Latihan peregangan dan postur tegak membantu.'],
  lordosis: ['Lordosis', 'Tampak samping. Pinggang terlalu melengkung ke depan sehingga perut terlihat menonjol. Penyebab: obesitas, kehamilan, postur buruk, otot inti lemah. Penanganan: olahraga penguat otot inti, kontrol berat badan.']
};
const gauss = (t, c, w) => Math.exp(-((t - c) ** 2) / (2 * w * w));

function drawSpine(m) {
  const N = 24, pts = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let x = 160;
    if (m === 'normal') x += -9 * Math.sin(t * Math.PI * 3 + 0.6);
    if (m === 'skoliosis') x += 42 * Math.sin(t * Math.PI * 2);
    if (m === 'kifosis') x += -8 * Math.sin(t * Math.PI * 3) - 58 * gauss(t, 0.38, 0.14);
    if (m === 'lordosis') x += -6 * Math.sin(t * Math.PI * 3) + 55 * gauss(t, 0.82, 0.11);
    pts.push([x, 30 + t * 320]);
  }
  let s = '<text x="160" y="16" text-anchor="middle" fill="var(--mu)" font-size="12">'
        + (m === 'skoliosis' ? 'Tampak belakang' : 'Tampak samping (depan →)') + '</text>';
  s += '<polyline points="' + pts.map(p => p.join(',')).join(' ')
     + '" fill="none" stroke="var(--ac)" stroke-width="3" stroke-dasharray="4 4" opacity=".6"/>';
  pts.forEach((p, i) => {
    const w = 11 + i * 0.9;
    s += '<rect x="' + (p[0] - w / 2) + '" y="' + (p[1] - 5) + '" width="' + w
       + '" height="10" rx="4" fill="var(--bone)" stroke="var(--bones)" stroke-width="1.5"/>';
  });
  [[0, 'Leher'], [0.38, 'Punggung'], [0.8, 'Pinggang']].forEach(l => {
    s += '<text x="305" y="' + (34 + l[0] * 320) + '" text-anchor="end" fill="var(--mu)" font-size="11">' + l[1] + '</text>';
  });
  $('#spine').innerHTML = s;
  $('#spineinfo').innerHTML = '<b>' + spineData[m][0] + '</b><br>' + spineData[m][1];
}
$$('#spineBtns button').forEach(b => b.onclick = () => {
  $$('#spineBtns button').forEach(x => x.classList.toggle('on', x === b));
  drawSpine(b.dataset.m);
});
drawSpine('normal');

/* ===== Penyakit tulang ===== */
const dis = [
  ['Osteoporosis', 'Tulang keropos dan rapuh karena kepadatan tulang menurun.', 'Kekurangan kalsium/vitamin D, usia lanjut, menopause, kurang gerak, merokok.', 'Sering tanpa gejala; mudah patah, tinggi badan berkurang, punggung membungkuk.', 'Konsumsi kalsium dan vitamin D, olahraga beban, berjemur pagi, hindari rokok.'],
  ['Rakitis', 'Tulang lunak dan mudah bengkok pada anak.', 'Kekurangan vitamin D, kalsium, atau fosfor.', 'Kaki O/X, tulang dada menonjol, pertumbuhan lambat.', 'Makanan bergizi, ASI/susu, paparan sinar matahari pagi.'],
  ['Osteoartritis', 'Tulang rawan sendi menipis dan aus sehingga tulang saling bergesekan.', 'Usia, obesitas, cedera sendi, pemakaian berlebihan.', 'Nyeri dan kaku sendi (lutut, pinggul), bunyi "kretek", gerak terbatas.', 'Jaga berat badan, olahraga ringan, hindari cedera, fisioterapi.']
];
$('#dis').innerHTML = dis.map((d, i) =>
  '<details class="card"' + (i ? '' : ' open') + '><summary>' + d[0] + '</summary>'
  + '<p><b>Pengertian:</b> ' + d[1] + '</p>'
  + '<p><b>Penyebab:</b> ' + d[2] + '</p>'
  + '<p><b>Gejala:</b> ' + d[3] + '</p>'
  + '<p><b>Pencegahan:</b> ' + d[4] + '</p></details>'
).join('');

/* ===== Kuis ===== */
const qs = [
  ['Pusat refleks berada di...', ['Otak besar', 'Sumsum tulang belakang', 'Jantung'], 1],
  ['Penghubung otot dengan tulang disebut...', ['Ligamen', 'Tendon', 'Kartilago'], 1],
  ['Lengkung pinggang berlebihan ke depan disebut...', ['Lordosis', 'Kifosis', 'Skoliosis'], 0],
  ['Tulang melengkung ke samping membentuk S/C disebut...', ['Kifosis', 'Lordosis', 'Skoliosis'], 2],
  ['Tulang lunak pada anak akibat kurang vitamin D adalah...', ['Rakitis', 'Osteoporosis', 'Osteoartritis'], 0]
];
let sc = 0, ans = 0;
function buildQuiz() {
  sc = 0; ans = 0;
  $('#score').textContent = 'Jawab semua pertanyaan.';
  $('#quiz').innerHTML = qs.map((q, i) =>
    '<div class="card"><b>' + (i + 1) + '. ' + q[0] + '</b>'
    + q[1].map((o, j) => '<button class="opt" data-q="' + i + '" data-o="' + j + '">' + o + '</button>').join('')
    + '</div>'
  ).join('');
  $$('.opt').forEach(b => b.onclick = () => {
    const qi = +b.dataset.q;
    const sib = $$('.opt[data-q="' + qi + '"]');
    if (sib.some(x => x.disabled)) return;
    const ok = +b.dataset.o === qs[qi][2];
    sib.forEach(x => {
      x.disabled = true;
      if (+x.dataset.o === qs[qi][2]) x.classList.add('right');
    });
    if (!ok) b.classList.add('wrong'); else sc++;
    ans++;
    if (ans === qs.length) {
      $('#score').textContent = 'Skor: ' + sc + ' / ' + qs.length
        + (sc === qs.length ? ' - sempurna! 🎉' : ' - ulangi untuk memperbaiki.');
    }
  });
}
$('#qreset').onclick = buildQuiz;
buildQuiz();