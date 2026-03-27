import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function carregar(){

const clientes = await getDocs(collection(db,"clientes"));
const mensalidades = await getDocs(collection(db,"mensalidades"));

document.getElementById("totalClientes").innerText = clientes.size;

let pago=0;
let pendente=0;

mensalidades.forEach(m=>{
if(m.data().status==="PAGO") pago++;
else pendente++;
});

document.getElementById("totalPago").innerText = pago;
document.getElementById("totalPendente").innerText = pendente;

}

carregar();