
// Initialiser le localstorage
const produitLocalStorage = JSON.parse(localStorage.getItem("produit"));


// Récupérer donnée get sur le localhost;


const items = document.getElementById ('cart__items');

function addCart () {
if (produitLocalStorage === null || produitLocalStorage.length === 0)
{
//Insertion paragraphe quand 0 produit
const textNoCart = document.createElement ('p');
items.appendChild (textNoCart);
textNoCart.textContent = "Le panier est vide";
if (produitLocalStorage.length === 0) {
localStorage.removeItem ('produit');
}
}

else{

for (let product of produitLocalStorage){

// Insertion article
const article = document.createElement ('article');
items.appendChild (article);
article.className = "cart__item";
article.setAttribute ('data-id', product.id);
article.setAttribute ('data-color', product.color);
fetch ("http://localhost:3000/api/products/" + product.id)
.then (function(res){
    if (res.ok) {
        return res.json();
    }
}
)
.then (
    function (data) {
        theProducts(data); 
        deleteCart ();
        modifyQuantity ();
        totalProductPrice (data);
    }
    
 )
function theProducts (data) {
// Cart__item__img
const itemImg = document.createElement ('div');
article.appendChild (itemImg);
itemImg.className = "cart__item__img";

// Image
const image = document.createElement ('img');
itemImg.appendChild (image);
image.setAttribute ('src', data.imageUrl);
image.setAttribute ('alt', data.altTxt);

// cart__item__content
const itemContent = document.createElement ('div');
article.appendChild (itemContent);
itemContent.className = "cart__item__content";

// cart__item__content__description
const itemContentDescription = document.createElement ('div');
itemContent.appendChild (itemContentDescription);
itemContentDescription.className = "cart__item__content__description"

// Menu h2 
const menu = document.createElement ('h2');
itemContentDescription.appendChild (menu);
menu.textContent = data.name;

// Paragraphe couleur
const textColor = document.createElement ('p');
itemContentDescription.appendChild (textColor);
textColor.textContent = product.color;

// Paragraphe prix
const textPrice = document.createElement ('p');
itemContentDescription.appendChild (textPrice);
textPrice.textContent = `${data.price} € `

// cart__item__content__settings
const itemContentSettings = document.createElement ('div');
itemContent.appendChild (itemContentSettings);
itemContentSettings.className = "cart__item__content__settings";

// cart__item__content__settings__quantity
const itemContentSettingsQuantity = document.createElement ('div');
itemContentSettings.appendChild (itemContentSettingsQuantity);
itemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

// Paragraphe quantité
const textQuantity = document.createElement ('p');
itemContentSettingsQuantity.appendChild (textQuantity);
textQuantity.textContent = "Qté :"

//input quantité
const input = document.createElement ('input');
itemContentSettingsQuantity.appendChild (input);
input.className = "itemQuantity";
input.value = product.quantity;
input.setAttribute ('min', "1");
input.setAttribute ('max', "100");
input.setAttribute ('type', "number");
input.setAttribute ('name', "itemQuantity")


// cart__item__content__settings__delete
const itemContentDelete = document.createElement ('div');
itemContentSettings.appendChild (itemContentDelete);
itemContentDelete.className = "cart__item__content__settings__delete";

// Paragraphe delete
const textDelete = document.createElement ('p');
itemContentDelete.appendChild (textDelete);
textDelete.textContent = "Supprimer"
textDelete.className = "deleteItem";

}
}
}
}
addCart ();

// Modification de la quantité de produit ;
      function modifyQuantity () {
      const quantityMore = document.querySelectorAll (".itemQuantity"); 
      
      for (let a = 0; a < quantityMore.length; a++) {
      // Récuperer l'input
      const quantityFor = quantityMore[a];
      
      // Ecoute de l'evenemeent input
      quantityFor.addEventListener ('change', function(e){
      e.preventDefault();  
      
      const closQty = quantityFor.closest('article');
      const dataId = closQty.dataset.id;
      const dataColor = closQty.dataset.color;

      const result = produitLocalStorage.find (el => el.id === dataId && el.color === dataColor)
      
      // Envoie de la nouvlle quantité dans le localstorage
      let newValueQuantity = parseInt(quantityFor.value);
      let produitLocalStoraged = result.quantity; 
      produitLocalStoraged = newValueQuantity
      produitLocalStorage[a].quantity = newValueQuantity;
      localStorage.setItem ("produit", JSON.stringify(produitLocalStorage));
      
      location.reload();
    })
  
}
      }



// Supprimer le produit du local storage et de la page 

function deleteCart () {
const deleteClass= document.querySelectorAll (".deleteItem");

for (let l = 0;  l < deleteClass.length;  l++) {
      const deleteClassFor = deleteClass[l];
      deleteClassFor.addEventListener ('click', function(e){
      e.preventDefault();
      const clos = deleteClassFor.closest('article');
        
      const dataId = clos.dataset.id + clos.dataset.color;
         
      const newLocalStorage = produitLocalStorage.filter (el => (el.id + el.color)!== dataId );
      
      localStorage.setItem ("produit", JSON.stringify(newLocalStorage));
        
      alert ("Ce produit est supprimé du panier");
      location.reload()
        
    })
}
}


// Connaitre le prix total et le nombre de produit 
  function totalProductPrice (data) {
  const numberProducts = document.querySelectorAll (".itemQuantity");;
  totalProducts = 0;
  totalPriceProducts = 0;

  for (let z = 0; z < numberProducts.length; z++) {
    const elementNumber = parseInt(numberProducts[z].value);
    const elementPrice = data.price
    console.log (elementNumber)
    totalProducts += elementNumber;
    totalPriceProducts += (elementNumber * elementPrice)
    
  }

  const totalQty = document.getElementById ('totalQuantity');
  totalQty.textContent = totalProducts;
  const totalSomme = document.getElementById ('totalPrice');
  totalSomme.textContent = totalPriceProducts;
  console.log (totalPriceProducts)
  }



