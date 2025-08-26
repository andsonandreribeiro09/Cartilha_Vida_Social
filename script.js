
function obterDados() {
  const form = document.getElementById('form-avaliacao');
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) data[el.name] = el.value;
    } else {
      data[el.name] = el.value;
    }
  });
  return data;
}

function salvarLocal() {
  const data = obterDados();
  localStorage.setItem('avaliacao_cartilha', JSON.stringify(data));
  alert('Rascunho salvo neste navegador.');
}

function carregarLocal() {
  const raw = localStorage.getItem('avaliacao_cartilha');
  if (!raw) return;
  const data = JSON.parse(raw);
  const form = document.getElementById('form-avaliacao');
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    if (data[el.name] !== undefined) {
      el.value = data[el.name];
    }
  });
}

function limpar() {
  if (!confirm('Limpar todas as respostas?')) return;
  const form = document.getElementById('form-avaliacao');
  form.reset();
  localStorage.removeItem('avaliacao_cartilha');
}

async function baixarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  const lineHeight = 16;
  let y = margin;

  function addLine(text) {
    const maxWidth = 515; // A4 width 595 - margins
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach(line => {
      if (y > 800) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  }

  addLine('Avaliação — Cartilha Vida Social');
  addLine('');
  const data = obterDados();
  Object.keys(data).sort((a,b)=>{
    // numeric sort on x.y
    const pa = a.split('.').map(Number); const pb = b.split('.').map(Number);
    return (pa[0]-pb[0]) || (pa[1]-pb[1]||0);
  }).forEach(key => {
    addLine(`${key}: ${data[key]}`);
  });

  doc.save('avaliacao_cartilha.pdf');
}
