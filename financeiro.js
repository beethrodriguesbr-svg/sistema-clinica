import { db } from "./firebase.js";
import {
collection,getDocs,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("lista");

let relatorio=[];

async function carregar(){

lista.innerHTML="";

const clientes=await getDocs(collection(db,"clientes"));
const mensalidades=await getDocs(collection(db,"mensalidades"));

clientes.forEach(c=>{

let clienteNome=c.data().nome;

lista.innerHTML+=`<h3>${clienteNome}</h3><div class="mensalidades-grid">`;

mensalidades.forEach(m=>{

const d=m.data();

if(d.clienteId===c.id){

relatorio.push({
cliente:clienteNome,
parcela:d.parcela,
valor:d.valor,
status:d.status
});

lista.innerHTML+=`

<div class="parcela ${d.status==="PAGO"?"pago":"pendente"}"
onclick="pagar('${m.id}','${d.status}')">

${d.parcela}<br>
R$${d.valor}<br>
${d.status}<br>
${d.dataPagamento ? d.dataPagamento : ""}

</div>

`;

}

});

lista.innerHTML+="</div>";

});

}

window.pagar=async(id,status)=>{

await updateDoc(doc(db,"mensalidades",id),{
status: status==="PAGO"?"Pendente":"PAGO",
dataPagamento:new Date().toLocaleDateString()
});

location.reload();

}

window.gerarPDF=()=>{

const {jsPDF}=window.jspdf;
const pdf=new jsPDF();

pdf.text("Relatório Financeiro",20,20);

let y=30;

relatorio.forEach(r=>{
pdf.text(`${r.cliente} - Parcela ${r.parcela} - R$${r.valor} - ${r.status}`,20,y);
y+=10;
});

pdf.save("relatorio.pdf");

}

carregar();