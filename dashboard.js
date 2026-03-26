import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function carregar(){

const clientes = await getDocs(collection(db,"clientes"));
const mensalidades = await getDocs(collection(db,"mensalidades"));

document.getElementById("totalClientes").innerText =
"Clientes: " + clientes.size;

let pagos=0;
let pendentes=0;

mensalidades.forEach(m=>{
if(m.data().status==="PAGO") pagos++;
else pendentes++;
});

document.getElementById("totalPago").innerText = "Pagos: " + pagos;
document.getElementById("totalPendente").innerText = "Pendentes: " + pendentes;

}

carregar();