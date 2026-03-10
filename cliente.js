import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function cadastrarCliente(){

const nome=document.getElementById("nome").value;
const dataNascimento=document.getElementById("dataNascimento").value;
const endereco=document.getElementById("endereco").value;
const plano=document.getElementById("plano").value;

const clienteRef = await addDoc(collection(db,"clientes"),{
nome,
dataNascimento,
endereco,
plano
});

for(let i=1;i<=12;i++){

await addDoc(collection(db,"mensalidades"),{
clienteId:clienteRef.id,
parcela:i,
valor:Number(plano),
status:"Pendente"
});

}

alert("Cliente cadastrado!");

}