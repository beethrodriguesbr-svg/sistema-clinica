import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("listaMensalidades");

let totalPago=0;
let totalPendente=0;

async function carregar(){

const clientes=await getDocs(collection(db,"clientes"));
const mensalidades=await getDocs(collection(db,"mensalidades"));

clientes.forEach(c=>{

lista.innerHTML+=`<h3>${c.data().nome}</h3>`;

mensalidades.forEach(m=>{

const d=m.data();

if(d.clienteId===c.id){

if(d.status==="PAGO") totalPago+=d.valor;
else totalPendente+=d.valor;

lista.innerHTML+=`

<div class="mensalidade">

Parcela ${d.parcela} - R$ ${d.valor}

<button onclick="mudar('${m.id}','${d.status}')">

${d.status}

</button>

</div>

`;

}

});

});

grafico();

}

window.mudar=async(id,status)=>{

const novo=status==="PAGO"?"Pendente":"PAGO";

await updateDoc(doc(db,"mensalidades",id),{status:novo});

location.reload();

}

function grafico(){

new Chart(document.getElementById("grafico"),{
type:"pie",
data:{
labels:["Pago","Pendente"],
datasets:[{
data:[totalPago,totalPendente],
backgroundColor:["green","red"]
}]
}
});

}

window.gerarPDF=()=>{

const {jsPDF}=window.jspdf;

const pdf=new jsPDF();

pdf.text("Relatório Financeiro",20,20);
pdf.text("Total Pago: "+totalPago,20,40);
pdf.text("Total Pendente: "+totalPendente,20,50);

pdf.save("relatorio.pdf");

}

carregar();