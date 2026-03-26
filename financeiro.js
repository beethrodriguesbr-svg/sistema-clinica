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

lista.innerHTML+=`<div class="cliente"><strong>${c.data().nome}</strong><div class="mensalidades">`;

mensalidades.forEach(m=>{

const d=m.data();

if(d.clienteId===c.id){

relatorio.push(d);

lista.innerHTML+=`
<div class="parcela ${d.status==="PAGO"?"pago":"pendente"}"
onclick="pagar('${m.id}','${d.status}')">

${d.parcela} - R$${d.valor}<br>
${d.status}<br>
${d.dataPagamento || ""}

</div>
`;

}

});

lista.innerHTML+="</div></div>";

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
pdf.text(`Parcela ${r.parcela} - R$${r.valor} - ${r.status}`,20,y);
y+=10;
});

pdf.save("relatorio.pdf");

}

carregar();