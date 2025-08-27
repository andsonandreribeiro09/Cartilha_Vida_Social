const form = document.getElementById("form-avaliacao");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

form.addEventListener("submit", async function(event) {
  event.preventDefault();
  let valido = true;

  // Valida todos os campos obrigatórios
  form.querySelectorAll("[required]").forEach(input => {
    const msgErro = input.parentElement.querySelector(".erro-msg");
    if (!input.value.trim()) {
      msgErro.classList.remove("hidden");
      valido = false;
    } else {
      msgErro.classList.add("hidden");
    }
    // Validação extra para email
    if (input.type === "email") {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(input.value)) {
        msgErro.textContent = "Digite um e-mail válido";
        msgErro.classList.remove("hidden");
        valido = false;
      }
    }
  });

  if (!valido) return;

  // Se passar na validação, envia para Formspree
  const dados = new FormData(form);
  try {
    const resposta = await fetch(form.action, {
      method: "POST",
      body: dados,
      headers: { Accept: "application/json" }
    });

    if (resposta.ok) {
      mensagemSucesso.classList.remove("hidden");
      form.reset();
      setTimeout(() => mensagemSucesso.classList.add("hidden"), 4000);
    } else {
      alert("Erro ao enviar avaliação. Tente novamente.");
    }
  } catch (erro) {
    alert("Falha na conexão. Verifique sua internet.");
  }
});

function limpar() {
  if (!confirm('Deseja realmente limpar todas as respostas?')) return;
  form.reset();
  form.querySelectorAll(".erro-msg").forEach(msg => msg.classList.add("hidden"));
}


