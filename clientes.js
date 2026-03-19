import { db } from "./firebase.js";
import {
collection,getDocs,deleteDoc,doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista=document.getElementById("lista");
const busca=document.getElementById("busca");

let clientes=[];

async function carregar(){

const snap=await getDocs(collection(db,"clientes"));

snap.forEach(c=>clientes.push({id:c.id,...c.data()}));

clientes.sort((a,b)=>a.nome.localeCompare(b.nome));

mostrar(clientes);

}

function mostrar(listaDados){

lista.innerHTML="";

listaDados.forEach(c=>{

lista.innerHTML+=`
<div class="cliente">
<strong>${c.nome}</strong><br>
${c.endereco || ""}

<br><br>

<button onclick="excluir('${c.id}')">Excluir</button>

</div>
`;

});

}

busca.addEventListener("keyup",()=>{
mostrar(clientes.filter(c=>c.nome.toLowerCase().includes(busca.value.toLowerCase())));
});

window.excluir=async(id)=>{
if(confirm("Excluir cliente?")){
await deleteDoc(doc(db,"clientes",id));
location.reload();
}
}

carregar();