import { db } from "./firebase.js";

import {
collection,
getDocs,
deleteDoc,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("listaClientes");
const busca=document.getElementById("busca");

let clientes=[];

async function carregar(){

const snapshot=await getDocs(collection(db,"clientes"));

snapshot.forEach((docu)=>{
clientes.push({id:docu.id,...docu.data()});
});

mostrar(clientes);

}

function mostrar(dados){

lista.innerHTML="";

dados.forEach(c=>{

lista.innerHTML+=`

<div class="cliente">

<strong>${c.nome}</strong><br>

${c.endereco}

<br><br>

<button onclick="editar('${c.id}','${c.nome}')">
Editar
</button>

<button onclick="excluir('${c.id}')">
Excluir
</button>

</div>

`;

});

}

busca.addEventListener("keyup",()=>{

const filtro=clientes.filter(c=>c.nome.toLowerCase().includes(busca.value.toLowerCase()));

mostrar(filtro);

});

window.excluir=async(id)=>{

await deleteDoc(doc(db,"clientes",id));

location.reload();

}

window.editar=async(id,nome)=>{

const novo=prompt("Novo nome:",nome);

if(novo){

await updateDoc(doc(db,"clientes",id),{nome:novo});

location.reload();

}

}

carregar();