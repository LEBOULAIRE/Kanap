// Initialiser le localstorage
const produitLocalStorage = JSON.parse(localStorage.getItem("produit"));


// Récupérer donnée get sur le localhost;

const items = document.getElementById("cart__items");

function addCart() {
  if (produitLocalStorage === null || produitLocalStorage.length === 0) {
    //Insertion paragraphe quand 0 produit
    const textNoCart = document.createElement("p");
    items.appendChild(textNoCart);
    textNoCart.textContent = "Le panier est vide";
    localStorage.removeItem("produit");
  } else {
    for (let product of produitLocalStorage) {
      // Insertion article
      const article = document.createElement("article");
      items.appendChild(article);
      article.className = "cart__item";
      article.setAttribute("data-id", product.id);
      article.setAttribute("data-color", product.color);
      fetch("http://localhost:3000/api/products/" + product.id)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function (data) {
          // Cart__item__img
          const itemImg = document.createElement("div");
          article.appendChild(itemImg);
          itemImg.className = "cart__item__img";

          // Image
          const image = document.createElement("img");
          itemImg.appendChild(image);
          image.setAttribute("src", data.imageUrl);
          image.setAttribute("alt", data.altTxt);

          // cart__item__content
          const itemContent = document.createElement("div");
          article.appendChild(itemContent);
          itemContent.className = "cart__item__content";

          // cart__item__content__description
          const itemContentDescription = document.createElement("div");
          itemContent.appendChild(itemContentDescription);
          itemContentDescription.className = "cart__item__content__description";

          // Menu h2
          const menu = document.createElement("h2");
          itemContentDescription.appendChild(menu);
          menu.textContent = data.name;

          // Paragraphe couleur
          const textColor = document.createElement("p");
          itemContentDescription.appendChild(textColor);
          textColor.textContent = product.color;

          // Paragraphe prix
          const textPrice = document.createElement("p");
          itemContentDescription.appendChild(textPrice);
          textPrice.textContent = `${data.price} € `;

          // cart__item__content__settings
          const itemContentSettings = document.createElement("div");
          itemContent.appendChild(itemContentSettings);
          itemContentSettings.className = "cart__item__content__settings";

          // cart__item__content__settings__quantity
          const itemContentSettingsQuantity = document.createElement("div");
          itemContentSettings.appendChild(itemContentSettingsQuantity);
          itemContentSettingsQuantity.className =
            "cart__item__content__settings__quantity";

          // Paragraphe quantité
          const textQuantity = document.createElement("p");
          itemContentSettingsQuantity.appendChild(textQuantity);
          textQuantity.textContent = "Qté :";

          //input quantité
          const input = document.createElement("input");
          itemContentSettingsQuantity.appendChild(input);
          input.className = "itemQuantity";
          input.value = product.quantity;
          input.setAttribute("min", "1");
          input.setAttribute("max", "100");
          input.setAttribute("type", "number");
          input.setAttribute("name", "itemQuantity");

          // cart__item__content__settings__delete
          const itemContentDelete = document.createElement("div");
          itemContentSettings.appendChild(itemContentDelete);
          itemContentDelete.className = "cart__item__content__settings__delete";

          // Paragraphe delete
          const textDelete = document.createElement("p");
          itemContentDelete.appendChild(textDelete);
          textDelete.textContent = "Supprimer";
          textDelete.className = "deleteItem";
          deleteCart();
          modifyQuantity();
          totalProductPrice(data);
        })
        .catch(function (err) {alert("connexion serveur non accompli")});
    }
  }
}
addCart();

// Modification de la quantité de produit ;
function modifyQuantity() {
  const quantityMore = document.querySelectorAll(".itemQuantity");

  for (let a = 0; a < quantityMore.length; a++) {
    // Récuperer l'input
    const quantityFor = quantityMore[a];

    // Ecoute de l'evenemeent input
    quantityFor.addEventListener("change", function (e) {
      e.preventDefault();

      const closQty = quantityFor.closest("article");
      const dataId = closQty.dataset.id;
      const dataColor = closQty.dataset.color;

      const result = produitLocalStorage.find(
        (el) => el.id === dataId && el.color === dataColor
      );

      // Envoie de la nouvelle quantité dans le localstorage
      let newValueQuantity = parseInt(quantityFor.value);
      if (newValueQuantity > 100) {
        alert("La quantité est limité à 100 par produit");
      } else {
        let produitLocalStoraged = result.quantity;
        produitLocalStoraged = newValueQuantity;
        produitLocalStorage[a].quantity = newValueQuantity;
        localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
      }
      location.reload();
    });
  }
}

// Supprimer le produit du local storage et de la page

function deleteCart() {
  const deleteClass = document.querySelectorAll(".deleteItem");

  for (let l = 0; l < deleteClass.length; l++) {
    const deleteClassFor = deleteClass[l];
    deleteClassFor.addEventListener("click", function (e) {
      e.preventDefault();
      const clos = deleteClassFor.closest("article");

      const dataId = clos.dataset.id + clos.dataset.color;

      const newLocalStorage = produitLocalStorage.filter(
        (el) => el.id + el.color !== dataId
      );

      localStorage.setItem("produit", JSON.stringify(newLocalStorage));

      location.reload();
    });
  }
}



// Connaitre le prix total et le nombre de produit
function totalProductPrice(data) {
  // Récupération de tous les produits pour le total
  const numberProducts = document.querySelectorAll(".itemQuantity");
  totalProducts = 0;
  totalPriceProducts = 0;

  for (let z = 0; z < numberProducts.length; z++) {
    
    const elementNumber = parseInt(numberProducts[z].value);
    const elementPrice = data.price;
    totalProducts += elementNumber;
    totalPriceProducts += elementNumber * elementPrice;
    
  }
 
  const totalQty = document.getElementById("totalQuantity");
  totalQty.textContent = totalProducts;
  const totalSomme = document.getElementById("totalPrice");
  totalSomme.textContent = totalPriceProducts;
}

// (Partie vérification formulaire)

// Utilsation du language regex pour les vérifications des données clients
const regexAdress = new RegExp("^([0-9]{1,3})?[-,;a-zA-Zzéèêëàçâ ]+$");
const regexNameAndCity = new RegExp("^[A-Za-zéèêëàçâ -]{3,30}$");
const mail = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);

// Ecoute des différents input lors d'un changment

const formBacket = document.querySelector(".cart__order__form");

formBacket.firstName.addEventListener("change", function () {
  firstName(this);
});

formBacket.lastName.addEventListener("change", function () {
  lastName(this);
});

formBacket.address.addEventListener("change", function () {
  adress(this);
});

formBacket.city.addEventListener("change", function () {
  city(this);
});

formBacket.email.addEventListener("change", function () {
  validEmail(this);
});
// Fonction pour prénom

function firstName(inputFirstName) {
  const paragrapheFirstName = inputFirstName.nextElementSibling;
  const testFirstName = regexNameAndCity.test(inputFirstName.value);
  if (testFirstName) {
    paragrapheFirstName.textContent = "";
  } else {
    paragrapheFirstName.textContent = "Veuillez indiquer un prénon valable";
  }
}
// Fonction pour nom
function lastName(inputLastName) {
  const paragrapheLastName = inputLastName.nextElementSibling;
  const testLastName = regexNameAndCity.test(inputLastName.value);
  if (testLastName) {
    paragrapheLastName.textContent = "";
  } else {
    paragrapheLastName.textContent = "Veuillez indiquer un nom valable";
  }
}
// fonction pour valider adresse
function city(inputCity) {
  const paragrapheCity = inputCity.nextElementSibling;
  const testCity = regexNameAndCity.test(inputCity.value);
  if (testCity) {
    paragrapheCity.textContent = "";
  } else {
    paragrapheCity.textContent = "Veuillez indiquer une ville valable";
  }
}
// fonction pour valider adresse
function adress(inputAdress) {
  // element suivant de l'HTML
  const paragrapheAdress = inputAdress.nextElementSibling;

  const testAdress = regexAdress.test(inputAdress.value);
  if (testAdress) {
    paragrapheAdress.textContent = "";
  } else {
    paragrapheAdress.textContent =
      "Veuillez indiquer une adresse postale valable";
  }
}

// funcion pour valider email
function validEmail(inputEmail) {
  const paragrapheError = inputEmail.nextElementSibling;
  const testEmail = mail.test(inputEmail.value);
  if (testEmail) {
    paragrapheError.textContent = "";
  } else {
    paragrapheError.textContent = "Veuillez indiquer une adresse email valable";
  }
}
// Fonciton pour envoyer la commande
function postForm() {
  const order = document.getElementById("order");
  order.addEventListener("click", (event) => {
    event.preventDefault();

    // Objet pour vérifier si le formulaire est corret
    const verify = {
      falseFirstName: document.getElementById("firstNameErrorMsg").textContent,
      falseLastName: document.getElementById("lastNameErrorMsg").textContent,
      falseAdress: document.getElementById("addressErrorMsg").textContent,
      falseCity: document.getElementById("cityErrorMsg").textContent,
      falseEmail: document.getElementById("emailErrorMsg").textContent,
    };

    // Les données du client
    const contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };

    if (
      produitLocalStorage === null ||
      produitLocalStorage.length === 0 ||
      contact.firstName == "" ||
      contact.lastName == "" ||
      contact.address == "" ||
      contact.city == "" ||
      contact.email == "" ||
      verify.falseFirstName != "" ||
      verify.falseLastName != "" ||
      verify.falseAdress != "" ||
      verify.falseCity != "" ||
      verify.falseEmail != ""
    ) {
      alert(
        "Le panier est vide ou le formulaire n'est pas correct pour la commande"
      );
    } else {
      //Regroupement de toutes les id des produits dans le panier
      let products = [];
      for (let i = 0; i < produitLocalStorage.length; i++) {
        products.push(produitLocalStorage[i].id);
      }

      // Je mets ensemble donnée client et id produit dans objet
      const sendFormData = {
        contact,
        products,
      };

      // Envoie des informations au serveur
      const options = {
        method: "POST",
        body: JSON.stringify(sendFormData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Requete fetch a l'aide de fetch
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);
          document.location.href = "confirmation.html?id=" + data.orderId;
        });
    }
  });
}
postForm();
