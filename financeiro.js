import { db } from "./firebase.js";
import {
collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaFinanceiro");

function formatarDataBR(data){
let [d,m,a]=data.split("/");
return new Date(`${a}-${m}-${d}`);
}

function hoje(){
let d = new Date();
d.setHours(0,0,0,0);
return d;
}

async function carregar(){

lista.innerHTML = "";

const clientesSnap = await getDocs(collection(db,"clientes"));
const mensalidadesSnap = await getDocs(collection(db,"mensalidades"));

let clientes = {};
clientesSnap.forEach(c=>{
clientes[c.id] = c.data().nome;
});

let totalPrevisto=0;
let totalRecebido=0;

// AGRUPAR POR CLIENTE
let mapa = {};

mensalidadesSnap.forEach(m=>{
let d = m.data();

if(!mapa[d.clienteId]){
mapa[d.clienteId] = [];
}

mapa[d.clienteId].push({
id: m.id,
...d
});

totalPrevisto += Number(d.valor);
if(d.status==="PAGO") totalRecebido += Number(d.valor);

});

document.getElementById("totalPrevisto").innerText = "R$ "+totalPrevisto.toFixed(2);
document.getElementById("totalRecebido").innerText = "R$ "+totalRecebido.toFixed(2);
document.getElementById("totalReceber").innerText = "R$ "+(totalPrevisto-totalRecebido).toFixed(2);

// RENDER
Object.keys(mapa).forEach(clienteId=>{

let nome = clientes[clienteId] || "Sem nome";

let html = `
<div class="financeiro-card">
<h3>${nome}</h3>
<div class="parcelas">
`;

mapa[clienteId]
.sort((a,b)=>a.parcela-b.parcela)
.forEach(p=>{

let dataVenc = formatarDataBR(p.dataVencimento);
let statusClass = "pendente";

if(p.status==="PAGO"){
statusClass="pago";
}else if(dataVenc < hoje()){
statusClass="vencido";
}else if(dataVenc.getTime()===hoje().getTime()){
statusClass="hoje";
}

html += `
<div class="parcela ${statusClass}" onclick="pagar('${p.id}','${p.status}')">

<strong>${p.parcela}ª</strong><br>
${p.descricao}<br>
R$ ${Number(p.valor).toFixed(2)}<br>
${p.dataVencimento}<br>
${p.status}<br>

<button onclick="event.stopPropagation(); cobrar('${nome}',${p.valor})">📩</button>

</div>
`;

});

html += `</div></div>`;

lista.innerHTML += html;

});

}

window.pagar = async(id,status)=>{
await updateDoc(doc(db,"mensalidades",id),{
status: status==="PAGO"?"Pendente":"PAGO",
dataPagamento:new Date().toLocaleDateString("pt-BR")
});
carregar();
}

// WHATSAPP
window.cobrar = (cliente, valor)=>{
let msg = `Olá ${cliente}, sua mensalidade de R$ ${valor.toFixed(2)} está pendente.`;
let url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
window.open(url, "_blank");
}

carregar();