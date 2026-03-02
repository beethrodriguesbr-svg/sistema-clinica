import { auth } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// LOGIN
window.login = function () {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            console.log("Usuário logado:", userCredential.user);
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error(error);

            if (error.code === "auth/user-not-found") {
                alert("Usuário não encontrado.");
            } else if (error.code === "auth/wrong-password") {
                alert("Senha incorreta.");
            } else {
                alert("Erro ao fazer login.");
            }
        });
};

// LOGOUT
window.logout = function () {
    signOut(auth)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Erro ao sair:", error);
        });
};