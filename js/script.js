// =======================================
// BLINK DELIVERY
// script.js
// =======================================


// =======================================
// CATÁLOGO
// =======================================

const listaProdutos = document.getElementById("lista-produtos");

async function carregarProdutos() {

    if (!listaProdutos) return;

    try {

        const resposta = await fetch("data/produtos.json");

        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";

        produtos.forEach(produto => {

            listaProdutos.innerHTML += `

<div class="produto-card">

    <div class="produto-imagem">

        <img
            src="${produto.imagem}"
            alt="${produto.nome}"
            onerror="this.src='assets/logo.png'">

    </div>

    <div class="produto-info">

        <span class="categoria">
            ${produto.categoria}
        </span>

        <h3>
            ${produto.nome}
        </h3>

        <p class="volume">
            ${produto.volume}
        </p>

        <div class="produto-footer">

            <span class="preco">
                ${Number(produto.preco).toFixed(2)} €
            </span>

            <button
                class="btn-comprar"
                onclick="window.open('https://wa.me/351929137722?text=Olá! Gostaria de pedir: ${produto.nome} ${produto.volume}','_blank')">

                Pedir

            </button>

        </div>

    </div>

</div>

`;

        });

    }

    catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

        listaProdutos.innerHTML = `
            <div style="
                background:#1b1b1b;
                padding:30px;
                border-radius:15px;
                text-align:center;
                color:white;
            ">
                Erro ao carregar o catálogo.
            </div>
        `;

    }

}

carregarProdutos();



// =======================================
// STATUS DA LOJA
// =======================================

const statusLoja = document.getElementById("status-loja");

if (statusLoja) {

    // =======================================
    // HORÁRIOS DA LOJA
    // =======================================

    /*
        COMO EDITAR

        abre: horário de abertura
        fecha: horário de fechamento

        Se fecha for menor que abre
        significa que fecha no dia seguinte.

        Exemplo:

        abre:20
        fecha:4

        = 20:00 até 04:00

    */

    const HORARIOS = {

        0: [ // Domingo

            { abre: 12, fecha: 16 }

        ],

        1: [ // Segunda

            { abre: 12, fecha: 18 }

        ],

        2: [ // Terça

        ],

        3: [ // Quarta

        ],

        4: [ // Quinta

        ],

        5: [ // Sexta

            { abre: 12, fecha: 16 },

            { abre: 20, fecha: 4 }

        ],

        6: [ // Sábado

            { abre: 12, fecha: 16 },

            { abre: 20, fecha: 4 }

        ]

    };



    const agora = new Date();

    const dia = agora.getDay();

    const hora = agora.getHours();

    const minuto = agora.getMinutes();



    function periodoAtual() {

        const horariosHoje = HORARIOS[dia];

        if (!horariosHoje) return null;

        for (const periodo of horariosHoje) {

            if (periodo.abre < periodo.fecha) {

                if (hora >= periodo.abre && hora < periodo.fecha)
                    return periodo;

            }

            else {

                if (hora >= periodo.abre || hora < periodo.fecha)
                    return periodo;

            }

        }

        return null;

    }



    function lojaAberta() {

        return periodoAtual() !== null;

    }



    function tempoParaFechar() {

        const periodo = periodoAtual();

        if (!periodo) return "";

        const agora = new Date();

        const fecho = new Date(agora);

        if (periodo.fecha > periodo.abre) {

            fecho.setHours(periodo.fecha, 0, 0, 0);

        }

        else {

            if (hora >= periodo.abre) {

                fecho.setDate(fecho.getDate() + 1);

            }

            fecho.setHours(periodo.fecha, 0, 0, 0);

        }

        const diferenca = fecho - agora;

        const horas = Math.floor(diferenca / (1000 * 60 * 60));

        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));

        return `${horas}h ${minutos}min`;

    }



    function proximaAbertura() {

        const nomesDias = [

            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado"

        ];

        for (let i = 0; i < 7; i++) {

            const indice = (dia + i) % 7;

            const horarios = HORARIOS[indice];

            if (!horarios || horarios.length === 0)
                continue;

            if (i === 0) {

                for (const periodo of horarios) {

                    if (hora < periodo.abre) {

                        return `Hoje às ${String(periodo.abre).padStart(2, "0")}:00`;

                    }

                }

            }

            else {

                return `${nomesDias[indice]} às ${String(horarios[0].abre).padStart(2, "0")}:00`;

            }

        }

        return "Sem horário definido";

    }



    if (lojaAberta()) {

        const periodo = periodoAtual();

        statusLoja.innerHTML = `

            🟢 <strong>ABERTO AGORA</strong><br>

            🕓 Fecha às <strong>${String(periodo.fecha).padStart(2, "0")}:00</strong><br>

            ⏳ Fecha em <strong>${tempoParaFechar()}</strong>

        `;

    }

    else {

        statusLoja.innerHTML = `

            🔴 <strong>FECHADO</strong><br>

            📅 Abre <strong>${proximaAbertura()}</strong>

        `;

    }

}