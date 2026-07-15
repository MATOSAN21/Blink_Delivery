// =======================================
// BLINK DELIVERY
// script.js
// =======================================

// Elemento onde os produtos serão exibidos
const listaProdutos = document.getElementById("lista-produtos");

// =======================================
// CARREGAR PRODUTOS
// =======================================

async function carregarProdutos() {

    try {

        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar produtos.json");
        }

        const produtos = await resposta.json();

        mostrarProdutos(produtos);

    }

    catch (erro) {

        console.error(erro);

        listaProdutos.innerHTML = `
            <div style="padding:40px;text-align:center;color:white;">
                <h2>Erro ao carregar produtos.</h2>
                <p>Verifique se o arquivo produtos.json existe.</p>
            </div>
        `;

    }

}

// =======================================
// MOSTRAR PRODUTOS
// =======================================

function mostrarProdutos(produtos) {

    listaProdutos.innerHTML = "";

    produtos.forEach(produto => {

        const preco = Number(produto.preco).toFixed(2);

        const precoAntigo = produto.precoAntigo
            ? `<div class="preco-antigo">€ ${Number(produto.precoAntigo).toFixed(2)}</div>`
            : "";

        const badge = produto.promocao
            ? `<span class="badge">🔥 Promoção</span>`
            : "";

        const descricao = produto.descricao
            ? produto.descricao
            : produto.volume;

        listaProdutos.innerHTML += `

        <div class="card">

            <div class="card-imagem">

                ${badge}

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>

            <div class="card-body">

                <span class="categoria-produto">

                    ${produto.categoria}

                </span>

                <h3>

                    ${produto.nome}

                </h3>

                <p class="descricao">

                    ${descricao}

                </p>

                <div class="preco-box">

                    ${precoAntigo}

                    <div class="preco">

                        € ${preco}

                    </div>

                </div>

                <button
                    class="botao-card"
                    onclick="pedirProduto('${produto.nome}', ${produto.preco})">

                    🛒 Pedir Agora

                </button>

            </div>

        </div>

        `;

    });

}

// =======================================
// PEDIDO WHATSAPP
// =======================================

function pedirProduto(nome, preco) {

    const mensagem = `Olá!

Gostaria de pedir:

🛒 ${nome}

💶 € ${Number(preco).toFixed(2)}

Encontrei este produto no site da Blink Delivery.`;

    const url = `https://wa.me/351929137722?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

}

// =======================================
// INICIAR SITE
// =======================================

// =======================================
// HORÁRIOS DA LOJA
// Basta alterar esta tabela
// =======================================

const HORARIOS = {

    0: [
        { abre: 12, fecha: 24 }
    ], // Domingo

    1: [
        { abre: 12, fecha: 24 }
    ], // Segunda

    2: [
        { abre: 12, fecha: 24 }
    ], // Terça

    3: [
        { abre: 12, fecha: 24 }
    ], // Quarta

    4: [
        { abre: 12, fecha: 24 }
    ], // Quinta

    5: [
        { abre: 12, fecha: 16 },
        { abre: 20, fecha: 4 }
    ], // Sexta

    6: [
        { abre: 12, fecha: 16 },
        { abre: 23, fecha: 4 }
    ] // Sábado

};

// =======================================
// STATUS DA LOJA
// =======================================

const statusLoja = document.getElementById("status-loja");

const NOMES_DIAS = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

function atualizarStatusLoja() {

    if (!statusLoja) return;

    const agora = new Date();

    const dia = agora.getDay();

    const horaAtual = agora.getHours() + (agora.getMinutes() / 60);

    let aberto = false;

    let periodoAtual = null;

    // ------------------------
    // Verifica hoje
    // ------------------------

    if (HORARIOS[dia]) {

        for (const periodo of HORARIOS[dia]) {

            if (periodo.abre < periodo.fecha) {

                if (horaAtual >= periodo.abre && horaAtual < periodo.fecha) {

                    aberto = true;
                    periodoAtual = periodo;

                }

            } else {

                if (horaAtual >= periodo.abre || horaAtual < periodo.fecha) {

                    aberto = true;
                    periodoAtual = periodo;

                }

            }

        }

    }

    // ------------------------
    // LOJA ABERTA
    // ------------------------

    if (aberto) {

        statusLoja.innerHTML = `

            <div class="status-titulo">

                🟢 ABERTO AGORA

            </div>

            <div class="status-grid">

                <div class="status-item">

                    <span>📅 Hoje</span>

                    <strong>${NOMES_DIAS[dia]}</strong>

                </div>

                <div class="status-item">

                    <span>🕒 Fecha às</span>

                    <strong>${String(periodoAtual.fecha).padStart(2, "0")}:00</strong>

                </div>

            </div>

        `;

        return;

    }

    // ------------------------
    // PRÓXIMA ABERTURA
    // ------------------------

    for (let i = 0; i < 7; i++) {

        const indice = (dia + i) % 7;

        const horarios = HORARIOS[indice];

        if (!horarios || horarios.length === 0) continue;

        for (const periodo of horarios) {

            // Ainda abre hoje

            if (i === 0 && horaAtual < periodo.abre) {

                statusLoja.innerHTML = `

                    <div class="status-titulo">

                        🔴 FECHADO

                    </div>

                    <div class="status-grid">

                        <div class="status-item">

                            <span>📅 Hoje</span>

                            <strong>${NOMES_DIAS[dia]}</strong>

                        </div>

                        <div class="status-item">

                            <span>🕓 Abre às</span>

                            <strong>${String(periodo.abre).padStart(2, "0")}:00</strong>

                        </div>

                    </div>

                `;

                return;

            }

            // Abre outro dia

            if (i > 0) {

                statusLoja.innerHTML = `

                    <div class="status-titulo">

                        🔴 FECHADO

                    </div>

                    <div class="status-grid">

                        <div class="status-item">

                            <span>📅 Próxima abertura</span>

                            <strong>${NOMES_DIAS[indice]}</strong>

                        </div>

                        <div class="status-item">

                            <span>🕓 Horário</span>

                            <strong>${String(periodo.abre).padStart(2, "0")}:00</strong>

                        </div>

                    </div>

                `;

                return;

            }

        }

    }

    statusLoja.innerHTML = `

        <div class="status-titulo">

            ⚠️ Sem horário definido

        </div>

    `;

}

// Iniciar

carregarProdutos();

atualizarStatusLoja();

setInterval(atualizarStatusLoja, 60000);