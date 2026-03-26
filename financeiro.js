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

let parcelas=[];

mensalidades.forEach(m=>{
const d=m.data();
if(d.clienteId===c.id){
parcelas.push({id:m.id,...d});
}
});

parcelas.sort((a,b)=>a.parcela-b.parcela);

lista.innerHTML+=`<div class="cliente">
<strong>${c.data().nome}</strong>
<div class="mensalidades">`;

parcelas.forEach(p=>{
lista.innerHTML+=`
<div class="parcela ${p.status==="PAGO"?"pago":"pendente"}"
onclick="pagar('${p.id}','${p.status}')">

${p.parcela}<br>
R$${p.valor}<br>
${p.dataVencimento}<br>
${p.status}

</div>`;
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

carregar();