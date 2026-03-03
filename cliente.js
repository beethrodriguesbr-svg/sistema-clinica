import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function cadastrarCliente() {
    try {

        const nome = document.getElementById("nome").value.trim();
        const dataNascimento = document.getElementById("dataNascimento").value;
        const endereco = document.getElementById("endereco").value.trim();
        const plano = document.getElementById("plano").value;

        if (!nome || !dataNascimento || !endereco || !plano) {
            alert("Preencha todos os campos!");
            return;
        }

        const clienteRef = await addDoc(collection(db, "clientes"), {
            nome,
            dataNascimento,
            endereco,
            plano
        });

        for (let i = 1; i <= 12; i++) {
            await addDoc(collection(db, "mensalidades"), {
                clienteId: clienteRef.id,
                parcela: i,
                valor: Number(plano),
                status: "Pendente"
            });
        }

        alert("Cliente cadastrado com 12 mensalidades!");

    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar cliente.");
    }
};