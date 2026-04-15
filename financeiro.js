import { db } from "./firebase.js";
import {
collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaFinanceiro");

async function carregar(){

    lista.innerHTML = "";

    const clientesSnap = await getDocs(collection(db,"clientes"));
    const mensalidadesSnap = await getDocs(collection(db,"mensalidades"));

    let totalPrevisto = 0;
    let totalRecebido = 0;

    let clientes = [];

    clientesSnap.forEach(c=>{
        clientes.push({id:c.id, ...c.data()});
    });

    let mensalidades = [];

    mensalidadesSnap.forEach(m=>{
        mensalidades.push({id:m.id, ...m.data()});
    });

    // CALCULAR TOTAIS
    mensalidades.forEach(m=>{
        totalPrevisto += Number(m.valor);

        if(m.status === "PAGO"){
            totalRecebido += Number(m.valor);
        }
    });

    let totalReceber = totalPrevisto - totalRecebido;

    document.getElementById("totalPrevisto").innerText = "R$ " + totalPrevisto.toFixed(2);
    document.getElementById("totalRecebido").innerText = "R$ " + totalRecebido.toFixed(2);
    document.getElementById("totalReceber").innerText = "R$ " + totalReceber.toFixed(2);

    // LISTAR CLIENTES
    clientes.forEach(c=>{

        let parcelas = mensalidades.filter(m=>m.clienteId === c.id);

        parcelas.sort((a,b)=>a.parcela - b.parcela);

        let html = `
        <div class="financeiro-card">
            <h3>${c.nome}</h3>
            <div class="parcelas">
        `;

        parcelas.forEach(p=>{

            html += `
            <div class="parcela ${p.status === "PAGO" ? "pago" : "pendente"}"
            onclick="pagar('${p.id}','${p.status}')">

                <strong>${p.parcela}ª</strong><br>
                R$ ${p.valor}<br>
                ${p.dataVencimento}<br>
                ${p.status}

            </div>
            `;
        });

        html += `</div></div>`;

        lista.innerHTML += html;

    });

}

window.pagar = async (id, status) => {

    await updateDoc(doc(db,"mensalidades",id),{
        status: status === "PAGO" ? "Pendente" : "PAGO",
        dataPagamento: new Date().toLocaleDateString()
    });

    carregar();
}

carregar();