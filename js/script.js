document.getElementById("produtos").innerHTML = `
<div style="
background:#111;
padding:30px;
border-radius:15px;
text-align:center;
">

<h3>Em breve</h3>

<p>O catálogo estará disponível em breve.</p>

</div>
`;
// ===============================
// STATUS DA LOJA
// ===============================

const statusLoja = document.getElementById("status-loja");

const agora = new Date();

const dia = agora.getDay(); // 0=Dom | 1=Seg | ... | 6=Sáb
const hora = agora.getHours();

const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

let aberta = false;
let mensagem = "";

// Sexta e Sábado (18h até 23:59)
if ((dia === 5 || dia === 6) && hora >= 23) {

    aberta = true;
    mensagem = `
        🟢 <strong>Aberto agora</strong><br>
        📅 ${dias[dia]}<br>
        🕓 Até às <strong>04:00</strong>
    `;
}

// Madrugada de Sábado, Domingo e Segunda (00h até 03:59)
else if ((dia === 6 || dia === 0 || dia === 1) && hora < 4) {

    aberta = true;

    let diaAnterior = dia - 1;
    if (diaAnterior < 0) diaAnterior = 6;

    mensagem = `
        🟢 <strong>Aberto agora</strong><br>
        📅 ${dias[diaAnterior]}<br>
        🕓 Até às <strong>04:00</strong>
    `;
}

// Fechado
else {

    mensagem = `
        🔴 <strong>Fechado no momento</strong><br>
        📅 Abrimos <strong>Sexta-feira às 18:00</strong>
    `;
}

statusLoja.innerHTML = mensagem;