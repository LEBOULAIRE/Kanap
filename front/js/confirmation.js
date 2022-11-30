// Récupération de l'id sur URL
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

// Numéro de commande afficher sur la page
const numId = document.getElementById("orderId");
numId.textContent = id;

localStorage.clear();
