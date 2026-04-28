import { db } from "./firebase.js";
import {
collection, getDocs, doc, updateDoc, deleteDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("lista");
const busca=document.getElementById("busca");

let clientes=[];

async function carregar(){

clientes = [];

const snap=await getDocs(collection(db,"clientes"));

snap.forEach(c=>clientes.push({id:c.id,...c.data()}));

clientes.sort((a,b)=>a.nome.localeCompare(b.nome));

mostrar(clientes);

}

function mostrar(dados){

lista.innerHTML="";

dados.forEach(c=>{

lista.innerHTML+=`
<div class="cliente">

<strong>${c.nome}</strong><br>
${c.endereco}

<br>

<button onclick="editar('${c.id}','${c.nome}')">Editar</button>
<button onclick="excluir('${c.id}')">Excluir</button>

</div>
`;

});

}

busca.addEventListener("keyup",()=>{
mostrar(clientes.filter(c=>c.nome.toLowerCase().includes(busca.value.toLowerCase())));
});

window.editar=async(id,nome)=>{
let novo=prompt("Novo nome:",nome);
if(novo){
await updateDoc(doc(db,"clientes",id),{nome:novo});
location.reload();
}
}

window.excluir=async(id)=>{

if(!confirm("Excluir cliente e TODAS mensalidades?")) return;

// 🔥 APAGAR MENSALIDADES VINCULADAS
const q = query(collection(db,"mensalidades"), where("clienteId","==",id));
const snap = await getDocs(q);

for(const docSnap of snap.docs){
await deleteDoc(doc(db,"mensalidades", docSnap.id));
}

// 🔥 APAGAR CLIENTE
await deleteDoc(doc(db,"clientes",id));

alert("Cliente e mensalidades excluídos!");
location.reload();

}

carregar();