import { db } from "./firebase.js";
import {
collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tabela = document.getElementById("tabelaFinanceiro");

let dados = [];

function formatarData(dataStr){
let [dia,mes,ano] = dataStr.split("/");
return new Date(`${ano}-${mes}-${dia}`);
}

function hoje(){
let d = new Date();
d.setHours(0,0,0,0);
return d;
}

async function carregar(){

const clientesSnap = await getDocs(collection(db,"clientes"));
const mensalidadesSnap = await getDocs(collection(db,"mensalidades"));

let clientes = {};
clientesSnap.forEach(c=>{
clientes[c.id] = c.data().nome;
});

dados = [];

let previsto=0, recebido=0, vencido=0, hojeTotal=0;

mensalidadesSnap.forEach(m=>{

let d = m.data();
let dataVenc = formatarData(d.dataVencimento);
let dataHoje = hoje();

let statusVisual = "pendente";

if(d.status === "PAGO"){
statusVisual = "pago";
} else if(dataVenc < dataHoje){
statusVisual = "vencido";
vencido += Number(d.valor);
} else if(dataVenc.getTime() === dataHoje.getTime()){
statusVisual = "hoje";
hojeTotal += Number(d.valor);
}

let item = {
id: m.id,
cliente: clientes[d.clienteId] || "Sem nome",
descricao: d.descricao || `MENSALIDADE ${d.parcela}`,
parcela: `${d.parcela}/12`,
vencimento: d.dataVencimento,
valor: Number(d.valor),
status: d.status,
statusVisual
};

dados.push(item);

previsto += item.valor;
if(item.status === "PAGO") recebido += item.valor;

});

document.getElementById("previsto").innerText = "R$ "+previsto.toFixed(2);
document.getElementById("recebido").innerText = "R$ "+recebido.toFixed(2);
document.getElementById("aberto").innerText = "R$ "+(previsto-recebido).toFixed(2);
document.getElementById("vencido").innerText = "R$ "+vencido.toFixed(2);

render();

}

function render(){

let busca = document.getElementById("buscaCliente").value.toLowerCase();
let status = document.getElementById("filtroStatus").value;

tabela.innerHTML="";

dados
.filter(d=>{
return (!busca || d.cliente.toLowerCase().includes(busca))
&& (!status || d.status === status);
})
.sort((a,b)=> formatarData(a.vencimento) - formatarData(b.vencimento))
.forEach(d=>{

tabela.innerHTML += `
<tr>
<td>${d.cliente}</td>
<td>${d.descricao}</td>
<td>${d.vencimento}</td>
<td>R$ ${d.valor.toFixed(2)}</td>
<td class="${d.statusVisual}">${d.status}</td>

<td>
<button onclick="pagar('${d.id}','${d.status}')">✔</button>
<button onclick="cobrar('${d.cliente}',${d.valor})">📩</button>
</td>
</tr>
`;

});

}

window.pagar = async(id,status)=>{
await updateDoc(doc(db,"mensalidades",id),{
status: status === "PAGO" ? "Pendente" : "PAGO",
dataPagamento:new Date().toLocaleDateString()
});
carregar();
}

// WHATSAPP
window.cobrar = (cliente, valor)=>{
let msg = `Olá ${cliente}, sua mensalidade no valor de R$ ${valor.toFixed(2)} está pendente.`;
let url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
window.open(url, "_blank");
}

document.getElementById("buscaCliente").addEventListener("keyup", render);
document.getElementById("filtroStatus").addEventListener("change", render);

carregar();