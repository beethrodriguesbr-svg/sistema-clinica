import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function cadastrarCliente(){

const nome = document.getElementById("nome").value;
const dataNascimento = document.getElementById("dataNascimento").value;
const endereco = document.getElementById("endereco").value;
const plano = document.getElementById("plano").value;

if(!nome || !plano){
alert("Preencha os campos!");
return;
}

const cliente = await addDoc(collection(db,"clientes"),{
nome,
dataNascimento,
endereco,
plano
});

for(let i=1;i<=12;i++){

await addDoc(collection(db,"mensalidades"),{
clienteId:cliente.id,
parcela:i,
valor:Number(plano),
status:"Pendente",
dataPagamento:null
});

}

alert("Cliente cadastrado com sucesso!");

}