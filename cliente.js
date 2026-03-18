import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function cadastrarCliente(){

const nome=nome.value;
const dataNascimento=dataNascimento.value;
const endereco=endereco.value;
const plano=plano.value;

const cliente=await addDoc(collection(db,"clientes"),{
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

}