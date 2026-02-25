import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            alert("Erro no login");
        });
}

window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
}