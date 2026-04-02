const form = document.getElementById('compareForm');
const resultsDiv = document.getElementById('results');
const btnCompare = document.getElementById('btnCompare');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileA = document.getElementById('fileA').files[0];
  const fileB = document.getElementById('fileB').files[0];

  if (!fileA || !fileB) return;

  btnCompare.disabled = true;
  btnCompare.textContent = 'Processando...';

  const formData = new FormData();
  formData.append('fileA', fileA);
  formData.append('fileB', fileB);

  try {
    const res = await fetch('/api/compare', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro ao processar.');
      return;
    }

    renderResults(data);
  } catch (err) {
    alert('Erro de conexao com o servidor.');
  } finally {
    btnCompare.disabled = false;
    btnCompare.textContent = 'Comparar';
  }
});

function renderResults(data) {
  resultsDiv.classList.remove('hidden');

  document.getElementById('countMatch').textContent = data.summary.correspondentes;
  document.getElementById('countMissing').textContent = data.summary.ausentes;
  document.getElementById('countExtra').textContent = data.summary.extras;

  fillList('listMatch', data.matching.map(m => m.originalA));
  fillList('listMissing', data.missing.map(m => m.original));
  fillList('listExtra', data.extra.map(m => m.original));

  document.getElementById('totals').textContent =
    `Lista A: ${data.summary.totalA} numeros unicos | Lista B: ${data.summary.totalB} numeros unicos`;
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const isHidden = target.classList.toggle('hidden');
    btn.textContent = isHidden ? 'Ver numeros' : 'Ocultar';
  });
});
