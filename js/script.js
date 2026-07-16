// =======================================
// BLINK DELIVERY
// script.js
// =======================================

// Elemento onde os produtos serão exibidos
const listaProdutos = document.getElementById("lista-produtos");

const pesquisa = document.getElementById("pesquisa");

const botoesCategoria = document.querySelectorAll(".categoria");

const contadorProdutos = document.getElementById("contador-produtos");

let todosProdutos = [];

let categoriaAtual = "Todos";

// =======================================
// CARRINHO
// =======================================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const painelCarrinho = document.getElementById("carrinho");

const overlayCarrinho = document.getElementById("overlay-carrinho");

const listaCarrinho = document.getElementById("lista-carrinho");

const totalCarrinho = document.getElementById("total-carrinho");

const btnCarrinho = document.getElementById("btn-carrinho");

const btnFecharCarrinho = document.getElementById("fechar-carrinho");

const btnFinalizar = document.getElementById("finalizar-pedido");

function salvarCarrinho(){

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarContadorCarrinho();

}

// =======================================
// ABRIR / FECHAR CARRINHO
// =======================================

function abrirCarrinho(){

    painelCarrinho.classList.add("ativo");

    overlayCarrinho.classList.add("ativo");

    renderizarCarrinho();

}

function fecharCarrinho(){

    painelCarrinho.classList.remove("ativo");

    overlayCarrinho.classList.remove("ativo");

}

if(btnCarrinho){

    btnCarrinho.addEventListener("click", abrirCarrinho);

}

if(btnFecharCarrinho){

    btnFecharCarrinho.addEventListener("click", fecharCarrinho);

}

if(overlayCarrinho){

    overlayCarrinho.addEventListener("click", fecharCarrinho);

}

// =======================================
// RENDERIZAR CARRINHO
// =======================================

function renderizarCarrinho() {

    listaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        totalCarrinho.textContent = "€ 0.00";
        return;
    }

    let total = 0;

    carrinho.forEach(produto => {

        total += Number(produto.preco) * produto.quantidade;

        listaCarrinho.innerHTML += `
            <div class="carrinho-item">

                <img src="${produto.imagem}" class="imagem-carrinho">

                <div class="info-carrinho">

                    <h3>${produto.nome}</h3>

                    <p>€ ${Number(produto.preco).toFixed(2)}</p>

                    <div class="controles">

                        <button onclick="diminuirQuantidade(${produto.id})">−</button>

                        <span>${produto.quantidade}</span>

                        <button onclick="aumentarQuantidade(${produto.id})">+</button>

                    </div>

                </div>

            </div>
        `;

    });

    totalCarrinho.textContent = `€ ${total.toFixed(2)}`;

}

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

        todosProdutos = produtos;
        mostrarProdutos(todosProdutos);

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

    contadorProdutos.textContent = `${produtos.length} produtos`;

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

                <div class="botoes-card">

                <button
                    class="botao-carrinho"
                    onclick="adicionarCarrinho(${produto.id})">

                    🛒 Adicionar

                </button>

                <button
                    class="botao-card"
                    onclick="pedirProduto(${produto.id})">

                    📞 Pedir Agora

                </button>

</div>

            </div>

        </div>

        `;

    });

}

// =======================================
// PEDIDO WHATSAPP
// =======================================

function pedirProduto(id){

    const produto = todosProdutos.find(p => p.id === id);

    const mensagem = `Olá!

Gostaria de pedir:

🛒 ${produto.nome}

💶 € ${Number(produto.preco).toFixed(2)}

Encontrei este produto no site da Blink Delivery.`;

    const url =
`https://wa.me/351929137722?text=${encodeURIComponent(mensagem)}`;

    window.open(url,"_blank");

}

function adicionarCarrinho(id){

    const produto = todosProdutos.find(p=>p.id===id);

    const existente = carrinho.find(p=>p.id===id);

    if(existente){

        existente.quantidade++;

    }

    else{

        carrinho.push({

            id:produto.id,

            nome:produto.nome,

            preco:produto.preco,

            imagem:produto.imagem,

            quantidade:1

        });

    }

    salvarCarrinho();

    renderizarCarrinho();

}

// =======================================
// AUMENTAR QUANTIDADE
// =======================================

function aumentarQuantidade(id){

    const produto = carrinho.find(p => p.id === id);

    if(!produto) return;

    produto.quantidade++;

    salvarCarrinho();

    renderizarCarrinho();

}

    // =======================================
    // DIMINUIR QUANTIDADE
    // =======================================

function diminuirQuantidade(id){

    const indice = carrinho.findIndex(p => p.id === id);

    if(indice === -1) return;

    carrinho[indice].quantidade--;

    if(carrinho[indice].quantidade <= 0){

        carrinho.splice(indice,1);

    }

    salvarCarrinho();

    renderizarCarrinho();
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

                    <span>🗓️ Hoje</span>

                    <strong>${NOMES_DIAS[dia]}</strong>

                </div>

                <div class="status-item">

                    <span>🕒 Fecha às</span>

                    <strong>${periodoAtual.fecha === 24 ? "00" : String(periodoAtual.fecha).padStart(2, "0")}:00</strong>

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

                            <span>🗓️ Hoje</span>

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

                            <span>🗓️ Próxima abertura</span>

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

function atualizarContadorCarrinho(){

    const contador=document.getElementById("contador-carrinho");

    if(!contador) return;

    const quantidade=carrinho.reduce((t,p)=>t+p.quantidade,0);

    contador.textContent=quantidade;

}

carregarProdutos();

atualizarStatusLoja();

atualizarContadorCarrinho();

setInterval(atualizarStatusLoja,60000);

// =======================================
// PESQUISA
// =======================================

pesquisa.addEventListener("input", filtrarProdutos);

botoesCategoria.forEach(botao=>{

    botao.addEventListener("click",()=>{

        botoesCategoria.forEach(b=>b.classList.remove("ativa"));

        botao.classList.add("ativa");

        categoriaAtual = botao.dataset.categoria;

        filtrarProdutos();

    });

});

btnFinalizar.addEventListener("click", finalizarPedido);

function filtrarProdutos(){

    const texto = pesquisa.value.toLowerCase();

    const produtosFiltrados = todosProdutos.filter(produto=>{

        const nome = produto.nome.toLowerCase();

        const categoria =
            categoriaAtual==="Todos" ||
            produto.categoria===categoriaAtual;

        const pesquisaNome =
            nome.includes(texto);

        return categoria && pesquisaNome;

    });

    mostrarProdutos(produtosFiltrados);

}

function finalizarPedido(){

    if(carrinho.length === 0){

        alert("Seu carrinho está vazio.");

        return;

    }

    let mensagem = "Olá! Gostaria de pedir:\n\n";

    let total = 0;

    carrinho.forEach(produto=>{

        mensagem += `🛒 ${produto.nome}\n`;
        mensagem += `Quantidade: ${produto.quantidade}\n`;
        mensagem += `Subtotal: € ${(produto.preco * produto.quantidade).toFixed(2)}\n\n`;

        total += produto.preco * produto.quantidade;

    });

    mensagem += `💶 Total: € ${total.toFixed(2)}`;

    const url =
`https://wa.me/351929137722?text=${encodeURIComponent(mensagem)}`;

    window.open(url,"_blank");

}