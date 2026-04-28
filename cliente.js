import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function cadastrarCliente(){

const nome=document.getElementById("nome").value;
const dataNascimento=document.getElementById("dataNascimento").value;
const endereco=document.getElementById("endereco").value;
const plano=document.getElementById("plano").value;

const cliente=await addDoc(collection(db,"clientes"),{
nome,dataNascimento,endereco,plano
});

// DIA FIXO (ex: hoje = 28 → todas dia 28)
let hoje = new Date();
let diaBase = hoje.getDate();

for(let i=1;i<=12;i++){

let dataParcela = new Date(hoje);
dataParcela.setMonth(dataParcela.getMonth() + (i-1));
dataParcela.setDate(diaBase);

await addDoc(collection(db,"mensalidades"),{
clienteId:cliente.id,
parcela:i,
descricao:`MENSALIDADE ${i}`,
valor:Number(plano),
status:"Pendente",
dataPagamento:null,
dataVencimento:dataParcela.toLocaleDateString("pt-BR")
});

}

}