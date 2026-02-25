import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function listarMensalidades() {
    const querySnapshot = await getDocs(collection(db, "mensalidades"));
    const lista = document.getElementById("listaMensalidades");

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        lista.innerHTML += `
            <p>Parcela ${data.parcela} - R$ ${data.valor} - ${data.status}</p>
        `;
    });
}

listarMensalidades();