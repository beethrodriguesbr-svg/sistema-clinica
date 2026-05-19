import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("lista");
const busca = document.getElementById("busca");

let clientes = [];

async function carregar(){

clientes = [];

const snap = await getDocs(collection(db,"clientes"));

snap.forEach(c=>{
clientes.push({
id:c.id,
...c.data()
});
});

clientes.sort((a,b)=>a.nome.localeCompare(b.nome));

document.getElementById("totalClientes").innerText = clientes.length;
document.getElementById("clientesAtivos").innerText = clientes.length;

mostrar(clientes);

}

function mostrar(dados){

lista.innerHTML = "";

dados.forEach(c=>{

lista.innerHTML += `

<tr>

<td>
<strong>${c.nome}</strong>
</td>

<td>
${c.endereco || "-"}
</td>

<td>
R$ ${Number(c.plano).toFixed(2)}
</td>

<td>

<div class="acoes">

<button class="btn-editar"
onclick="editar('${c.id}','${c.nome}')">

<i class="ri-pencil-line"></i>

</button>

<button class="btn-excluir"
onclick="excluir('${c.id}')">

<i class="ri-delete-bin-line"></i>

</button>

</div>

</td>

</tr>

`;

});

}

busca.addEventListener("keyup",()=>{

const filtro = clientes.filter(c=>
c.nome.toLowerCase()
.includes(busca.value.toLowerCase())
);

mostrar(filtro);

});

window.editar = async(id,nome)=>{

let novo = prompt("Novo nome:",nome);

if(novo){

await updateDoc(doc(db,"clientes",id),{
nome:novo
});

carregar();

}

}

window.excluir = async(id)=>{

if(!confirm("Excluir cliente e mensalidades?")) return;

// APAGAR MENSALIDADES
const q = query(
collection(db,"mensalidades"),
where("clienteId","==",id)
);

const mensalidades = await getDocs(q);

for(const item of mensalidades.docs){

await deleteDoc(doc(db,"mensalidades",item.id));

}

// APAGAR CLIENTE
await deleteDoc(doc(db,"clientes",id));

carregar();

}

carregar();