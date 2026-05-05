let produtos = [];
let canteiros = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", fazerLogin);
  document
    .getElementById("toggle-menu")
    .addEventListener("click", alternarMenu);
  document
    .querySelectorAll("#menu-nav button[data-screen]")
    .forEach((botao) => {
      botao.addEventListener("click", () => mostrarTela(botao.dataset.screen));
    });
  document
    .getElementById("form-cadastro")
    .addEventListener("submit", handleCadastro);
});

function fazerLogin() {
  const usuarioDigitado = document.getElementById("campoUsuario").value;
  const senhaDigitada = document.getElementById("campoSenha").value;

  const usuarioCorreto = "admin";
  const senhaCorreta = "123";

  if (usuarioDigitado === usuarioCorreto && senhaDigitada === senhaCorreta) {
    alert("Login realizado com sucesso!");

    document.querySelector("#tela-login").style.display = "none";
    document.querySelector("#sistema").style.display = "block";

    document.getElementById("mensagem-boas-vindas").innerText =
      `Bem-vindo(a), ${usuarioDigitado}!`;

    mostrarTela("boas-vindas");
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function alternarMenu() {
  const menu = document.getElementById("menu-nav");
  menu.classList.toggle("show");
}

function mostrarTela(id) {
  document.querySelector("#tela-boas-vindas").style.display = "none";
  document.querySelector("#tela-cadastro").style.display = "none";
  document.querySelector("#tela-estoque").style.display = "none";

  document.querySelector(`#tela-${id}`).style.display = "block";

  if (id === "estoque") renderizarEstoque();

  document.getElementById("menu-nav").classList.remove("show");
}

function handleCadastro(event) {
  event.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const categoria = document.querySelector("#categoria").value;
  const area = parseFloat(document.querySelector("#area").value);
  const plantada = document.querySelector("#plantada").value;

  if (!validarCampos({ nome, categoria, area, plantada })) return;

  const insumos = calcularInsumos(area, categoria);
  const colheita = estimarColheita(plantada, categoria);

  const novoCanteiro = {
    nome,
    categoria,
    area,
    plantada,
    colheita,
    sementes: insumos.sementes,
    densidade: insumos.densidade,
  };

  canteiros.push(novoCanteiro);

  document.getElementById("form-cadastro").reset();
  mostrarTela("estoque");
}

function validarCampos({ nome, categoria, area, plantada }) {
  if (!nome) {
    alert("Preencha o setor do plantio.");
    return false;
  }
  if (!categoria) {
    alert("Selecione a categoria.");
    return false;
  }
  if (!area || area <= 0) {
    alert("Informe uma área válida para o canteiro.");
    return false;
  }
  if (!plantada) {
    alert("Informe a data do plantio.");
    return false;
  }

  return true;
}

function calcularInsumos(area, categoria) {
  const taxas = {
    Alface: 50,
    Tomate: 15,
    Milho: 12,
    Outros: 20,
  };

  const taxa = taxas[categoria] ?? taxas.Outros;
  const sementes = math.round(math.multiply(area, taxa));
  const densidade = math.round(math.divide(sementes, area), 2);

  return { sementes, densidade };
}

function estimarColheita(dataPlantio, categoria) {
  const ciclos = {
    Alface: 45,
    Tomate: 80,
    Milho: 90,
    Outros: 60,
  };

  const dias = ciclos[categoria] ?? ciclos.Outros;
  const data = new Date(dataPlantio);
  const totalDias = math.add(0, dias);

  data.setDate(data.getDate() + totalDias);
  return data.toLocaleDateString("pt-BR");
}

function renderizarEstoque() {
  const lista = document.querySelector("#lista-produtos");

  if (canteiros.length === 0) {
    lista.innerHTML =
      "<p style='text-align: center; color: #555;'>Nenhum canteiro cadastrado no momento.</p>";
    return;
  }

  lista.innerHTML = `
    <div class="grid-cartoes">
      ${canteiros
        .map(
          (p) => `
        <div class="card-canteiro">
          <h3>${p.nome}</h3>
          <p><strong>Categoria:</strong> ${p.categoria}</p>
          <p><strong>Área:</strong> ${p.area.toFixed(2)} m²</p>
          <p><strong>Plantio:</strong> ${new Date(p.plantada).toLocaleDateString("pt-BR")}</p>
          <p><strong>Colheita prevista:</strong> ${p.colheita}</p>
          <p><strong>Sementes necessárias:</strong> ${p.sementes}</p>
          <p><strong>Densidade:</strong> ${p.densidade} semente/m²</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}
