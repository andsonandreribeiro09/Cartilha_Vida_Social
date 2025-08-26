
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
  const lineHeight = 18;
  const maxWidth = 515; // largura A4 menos margens
  let y = margin;

  const form = document.getElementById('form-avaliacao');
  const labels = Array.from(form.querySelectorAll('label.field'));

  function addText(text, options = {}) {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach(line => {
      if (y > 780) { // quebrar página antes do final
        doc.addPage();
        y = margin;
      }
      doc.setFont(undefined, options.bold ? 'bold' : 'normal');
      doc.text(line, margin, y);
      y += lineHeight;
    });
  }

  addText('Avaliação — Cartilha Vida Social', { bold: true });
  addText('');

  labels.forEach(label => {
    const pergunta = label.querySelector('span')?.textContent || '';
    const input = label.querySelector('input, textarea');
    const resposta = input ? input.value : '';
    addText(pergunta, { bold: true });
    addText(`Resposta: ${resposta}`);
    addText(''); // linha em branco entre perguntas
  });

  doc.save('avaliacao_cartilha.pdf');
}

// Carregar dados salvos automaticamente ao abrir
window.addEventListener('DOMContentLoaded', () => {
  carregarLocal();
});

