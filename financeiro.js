import { db } from "./firebase.js";
import {
collection,getDocs,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("lista");

async function carregar(){

lista.innerHTML="";

const clientes=await getDocs(collection(db,"clientes"));
const mensalidades=await getDocs(collection(db,"mensalidades"));

clientes.forEach(c=>{

let html=`<div class="cliente"><strong>${c.data().nome}</strong><div class="mensalidades">`;

let parcelas=[];

mensalidades.forEach(m=>{
if(m.data().clienteId===c.id){
parcelas.push({id:m.id,...m.data()});
}
});

// ORDENAR
parcelas.sort((a,b)=>a.parcela-b.parcela);

parcelas.forEach(p=>{

html+=`
<div class="parcela ${p.status==="PAGO"?"pago":"pendente"}"
onclick="pagar('${p.id}','${p.status}')">

${p.parcela}<br>
R$${p.valor}<br>
${p.dataVencimento}<br>
${p.status}<br>
${p.dataPagamento || ""}

</div>
`;

});

html+="</div></div>";

lista.innerHTML+=html;

});

}

window.pagar=async(id,status)=>{

await updateDoc(doc(db,"mensalidades",id),{
status: status==="PAGO"?"Pendente":"PAGO",
dataPagamento:new Date().toLocaleDateString()
});

location.reload();

}

carregar();