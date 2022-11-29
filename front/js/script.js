// Récupérer donnée get sur le localhost;
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    console.log(data);
    theProducts(data);
  })

  .catch(function (err) {
    alert("connexion serveur non accompli");
  });

// Mettre les produits sur la page
function theProducts(data) {
  for (const products of data) {
    // Block items html
    const itemsHTML = document.getElementById("items");
    // Création lien
    const link = document.createElement("a");
    itemsHTML.appendChild(link);
    link.href = `./product.html?id=${products._id}`;

    // Création article
    const articles = document.createElement("article");
    link.appendChild(articles);

    // Création image
    const image = document.createElement("img");
    articles.appendChild(image);
    image.setAttribute("src", products.imageUrl), ("alt", products.altTxt);

    // Création titre
    const title = document.createElement("h3");
    articles.appendChild(title);
    title.classList.add("productName");
    title.textContent = products.name;

    // Création du paragraphe
    const paragraph = document.createElement("p");
    articles.appendChild(paragraph);
    paragraph.classList.add("productDescription");
    paragraph.textContent = products.description;
  }
}
