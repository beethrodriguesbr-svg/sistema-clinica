import { db } from "./firebase.js";
import {
collection,getDocs,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("lista");

async function carregar(){

const clientes=await getDocs(collection(db,"clientes"));
const mensalidades=await getDocs(collection(db,"mensalidades"));

clientes.forEach(c=>{

lista.innerHTML+=`<h3>${c.data().nome}</h3><div class="mensalidades-grid">`;

mensalidades.forEach(m=>{

const d=m.data();

if(d.clienteId===c.id){

lista.innerHTML+=`

<div class="parcela ${d.status==="PAGO"?"pago":"pendente"}"
onclick="pagar('${m.id}','${d.status}')">

${d.parcela}<br>
R$${d.valor}<br>
${d.status}

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
pdf.save("relatorio.pdf");
}

carregar();