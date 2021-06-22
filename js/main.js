
// -------------------- UNIVERSAL CODE --------------------  //

//create the cart array if it doesn't exist
let checkCart = localStorage.getItem("cart");
if(checkCart === null){
    var cart = [];
    window.localStorage;
    localStorage.setItem("cart", JSON.stringify(cart));
}

//count number of items in cart
const numberItems = function() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log(cart.length);
    return cart.length;
}

//display number of items in cart on top of cart icon 
const displayItemCount = function(){
    if(document.getElementsByClassName("cartbutton") != null) {
        let itemCount = numberItems();
        if(itemCount > 0){
            let counter = document.getElementById("itemcount");
            
            counter.innerHTML = itemCount;
            counter.style.opacity = 1;
            
        }
    }
}

displayItemCount();


//get an item using it's ID
const getItem = async function(id){
    try{
        let response = await fetch("http://localhost:3000/api/cameras/"+id);
        if(response.ok){
            let data = await response.json();

        return data;
        }
        
    }
    catch(err){
        console.log(err);
    }
}




// ---------- SEARCH PAGE (INDEX) --------- //


//calls the API and return the JSON the API gives
const getProducts = async function(){
    try{
        let response = await fetch("http://localhost:3000/api/cameras");
        if(response.ok){
            
            let data = await response.json();

            return data;
        } 
    }
    catch(err){
        console.log(err);
    }    
}

//goes through the array of products to display them one after the other
const displayProducts = async function(){
    
    let products = await getProducts();

    console.log(products);

    let productCount = products.length;
    for(i=0; i<productCount; i++){
       buildProductPrev(products[i]);
    }
}

//adds a preview div for a product
const buildProductPrev = function(product){
   
    //The anchor and the two divs that will make the preview
    const anchor = document.getElementById("productlist");
    const newPreview = document.createElement("a");
    const newPreviewInfo = document.createElement("div");

    //the content of the new
    const productImg = "<img class='prevImg' alt='picture of "+product.name+"' src='"+product.imageUrl+"'>";
    const productName = "<h3>"+product.name+"</h3>";
    const productPrice = "<p class='text-end price'>"+product.price+"€</p>";

    //we set up the preview bloc
    newPreview.href = "product.html?id="+product._id;
    newPreview.classList.add("col-12", "col-md-3", "p-1", "productpreview");
    newPreview.innerHTML = productImg;

    //we set up the info bloc
    newPreviewInfo.classList.add("container-fluid", "prevInfo", "p-2");
    newPreviewInfo.innerHTML = productName+productPrice;

    //we assemble the blocs and add them to the dom
    anchor.appendChild(newPreview);
    newPreview.appendChild(newPreviewInfo);

}



// ------ PRODUCT PAGE CODE ------------//

//fill the page with item info
const displayItem = async function(){
    //get the parameter in URL
    const productId = new URLSearchParams(window.location.search).get("id");
    //wait for the API to give item infos
    let item = await getItem(productId);
    //give corresponding title to page
    document.title = item.name;
    //the anchor and the two blocs 
    const anchor = document.getElementById("iteminfo");
    const imgBloc = document.createElement("div");
    const infoBloc = document.createElement("div");
    const orderBloc = document.createElement("div");

    //the content of the new blocs
    const itemImg = "<img alt='picture of "+item.name+"' src='"+item.imageUrl+"'>";
    
    const itemName = "<h1>"+item.name+"</h1>";
    const itemDesc = "<p>"+item.description+"</p>";
    
    const itemPrice = "<span class='itemprice'>"+item.price+"€</span>";
    const orderButton = "<button type='button' onclick='addToCart()'> <i class='fas fa-cart-plus'></i> Ajouter au panier </button>"

    //we set up the imgBloc
    imgBloc.classList.add("col-12", "col-md-7", "p-1", "imgBloc");
    imgBloc.innerHTML = itemImg;

    //we set up the infoBloc
    infoBloc.classList.add("col-12", "col-md-5", "p-1", "infoBloc");
    infoBloc.innerHTML = itemName+itemDesc+makeForm(item.lenses);

    //we set up the orderBloc
    orderBloc.classList.add("orderBloc");
    orderBloc.innerHTML = itemPrice+orderButton;

    //we assemble and add to the DOM
    anchor.appendChild(imgBloc);
    anchor.appendChild(infoBloc);
    infoBloc.appendChild(orderBloc);


}

//this function makes the form, separated from the rest for ease of use
const makeForm = function(optionList){

    //we make the different parts
    const formLabel = "<label for='customform'>Choix de l'objectif</label>";
    const formStart = "<select id='customform' name='objectifs'>";
    let list = "";
    const formEnd = "</select>";
    //this populates the options
    for(i=0; i < optionList.length; i++){
        list += "<option value='"+optionList[i]+"'>"+optionList[i]+"</option>";
    }
    //we return the form in a string
    return formLabel+formStart+list+formEnd;
}

//add stuff to cart
const addToCart = function(){
    const productId = new URLSearchParams(window.location.search).get("id");
    let cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);
    cart.push(productId);
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    displayItemCount();
}

//builds the list of items in cart
const buildItemList = function(item){
    //we create the element
    const itemInList = document.createElement("div");
    //we set up the components of the element
    const itemName = "<div class='itemname col-3 text-end'>"+item.name+"</div>";
    const itemPrice = "<div class='itemprice col-3 text-center'>"+item.price+"€</div>"; 
    const itemRemove = "<button class='removeItem col-2'>Retirer cet article</button>";
    //we build the element
    itemInList.classList.add("col12", "row", "iteminlist");
    itemInList.innerHTML = itemName+itemPrice+itemRemove; 
    //we return the built element
    return itemInList;
}

// ------------- CART PAGE ------------- //
const displayItemsInCart = async function(){
    let itemCount = numberItems();
    let anchor = document.getElementById("cartitemlist");

    if(itemCount>0){
        let cart = localStorage.getItem("cart");
        cart = JSON.parse(cart);
        for(i=0; i<cart.length; i++){
            //get the item
            let item = await getItem(cart[i]);
           anchor.appendChild(buildItemList(item));
        }
    }else{
        anchor.innerHTML = "<p>Vous n'avez pas d'article dans votre panier.</p>";
    }
}



// ------------ DISPLAY PAGE SPECIFIC STUFF -------------- //
//We check where we are and what we should display
const pageType = document.querySelector("body");

switch(true) {
    case pageType.classList.contains("searchpage") :
        displayProducts();
    break;
    case pageType.classList.contains("productpage") :
        displayItem();
    break; 
    case pageType.classList.contains("cartpage") :
        displayItemsInCart();
    break;
    default : console.log("No special display functions were called");
}
