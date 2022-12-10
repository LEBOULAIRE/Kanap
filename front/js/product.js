// Récupération de l'id sur URL
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");


// Récupérer les données par produit
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    theProducts(data);
  })

  .catch(function (err) {
    alert("connexion serveur non accompli");
  });

// Fonction pour afficher produit
function theProducts(data) {
  // Création image
  console.log(data);

  // Image du produit
  const blocImage = document.querySelector("div.item__img");
  const imageProduct = document.createElement("img");
  imageProduct.setAttribute("src", data.imageUrl), ("alt", data.altTxt);
  blocImage.appendChild(imageProduct);

  //Affichage du titre
  const titleProduct = document.getElementById("title");
  titleProduct.textContent = data.name;

  // Affichage du prix
  const priceProduct = document.getElementById("price");
  priceProduct.textContent = data.price;

  // Affichage description
  const descriptionProduct = document.getElementById("description");
  descriptionProduct.textContent = data.description;

  // Affichage menu couleur
  const select = document.getElementById("colors");

  for (let color of data.colors) {
    console.log(color);
    const option = document.createElement("option");
    select.appendChild(option);
    option.setAttribute("value", color);
    option.textContent = color;
  }

  // Ajouter des produits vers le panier

  const addToCartProduct = document.getElementById("addToCart");
  addToCartProduct.addEventListener("click", addToCart);

  function addToCart() {
    // Récupération id dans une constante
    const idProduct = id;
    console.log(idProduct);

    // Récupération valeur de la couleur
    const colorPage = document.querySelector("#colors");
    const colorPageValue = colorPage.value;
    console.log(colorPageValue);

    // Récupération de la valeur
    const quantityPage = document.getElementById("quantity");
    const quantityPageValue = quantityPage.value;
    console.log(quantityPageValue);

    // if pour confirmer que le client à choisis les paramètres du produit
    if (quantityPageValue < 1 || colorPageValue === "") {
      alert("Choissiez une couleur ou la quantité de produit");
    } else {
      // variable regroupant tous les choix du produit
      let objetProduct = {
        id: idProduct,
        color: colorPageValue,
        quantity: quantityPageValue,
      };

      let produitLocalStorageProduct = JSON.parse(
        localStorage.getItem("produit")
      );

      // Savoir si il y a deja le produit sur le localstorage
      if (produitLocalStorageProduct) {
        const result = produitLocalStorageProduct.find(
          (search) => search.id === idProduct && search.color === colorPageValue
        );
        if (result) {
          let moreQuantity =
            parseInt(objetProduct.quantity) + parseInt(result.quantity);
          if (moreQuantity < 101) {
            result.quantity = moreQuantity;
            alert(`Nous avons ${moreQuantity} produits dans notre panier `);
            localStorage.setItem(
              "produit",
              JSON.stringify(produitLocalStorageProduct)
            );
          } else {
            alert(
              "La quantité est malheuresment trop grande pour votre commande "
            );
          }
        } else {
          produitLocalStorageProduct.push(objetProduct);
          localStorage.setItem(
            "produit",
            JSON.stringify(produitLocalStorageProduct)
          );
          alert("Ajout au panier");
        }
      } else {
        produitLocalStorageProduct = [];
        produitLocalStorageProduct.push(objetProduct);
        localStorage.setItem(
          "produit",
          JSON.stringify(produitLocalStorageProduct)
        );
        alert("Ajout au panier");
      }
    }
  }
}
