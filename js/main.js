
// -------------------- UNIVERSAL CODE --------------------  //
// -------------- this code is NOT page specific ----------- //

// --------- OBJECTS ----------- //
//define what a contact object is
class Contact{
    constructor(firstName, lastName, address, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

//define what an order object is
class Order{
    constructor(contact, products){
        this.contact = contact;
        this.products = products;
    }
}

//----------------- CART FUNCTIONS -----------------//

//create the shopping cart (array) if it doesn't already exist 
let checkCart = localStorage.getItem("cart");
if(checkCart === null){
    var cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
}

//this function returns an array of the produt ids in the cart
const getCart = function(){
    let cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);
    return cart;
}

//this function empties the cart
const deleteCart = function(){
    let cart = getCart();
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayItemCount();
}

//add stuff to cart
const addToCart = function(){
    const productId = new URLSearchParams(window.location.search).get("id");
    let cart = getCart();
    cart.push(productId);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayItemCount();
}

//removes the item at the given position from the cart
const removeFromCart = function(pos){
    let cart = getCart();
    cart.splice(pos, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayItemCount();
    displayItemsInCart();
}

//count number of items in cart
const numberItems = function() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    return cart.length;
}

//display number of items in cart on top of cart icon 
const displayItemCount = function(){
    //we check that the cart icon exists
    if(document.getElementsByClassName("cartbutton") != null) {
        let itemCount = numberItems();
        let counter = document.getElementById("itemcount");
        if(itemCount > 0){
            counter.innerHTML = itemCount;
            counter.style.opacity = 1;
            
        }else{
            counter.innerHTML = 0;
            counter.style.opacity = 0;
        }
    }
}


//------------ ITEMS IN BACKEND FUNCTIONS -----------//

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

//get every item
const getProducts = async function(){
    try{
        let response = await fetch("http://localhost:3000/api/cameras");
        if(response.ok){
            let data = await response.json();
            return data;
        } 
    }
    catch(err){
        window.alert("OUPS ! Il semblerait que la partie back-end de ce projet ne soit pas pas lancée. Assurez d'avoir démarré la partie back-end avec la commande 'npm start' depuis le répertoire 'JDWP5'."); 
        console.log(err);
    }    
}

// ---------- SEARCH PAGE (INDEX) --------- //


//goes through the array of products to display them one after the other
const displayProducts = async function(){
    
    let products = await getProducts();

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

    //the content of the new product to be displayed
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



// ---------------- PRODUCT PAGE -------------------//

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
// ------------- CART PAGE ------------- //
//builds the list of items in cart
const buildItemList = function(item, pos){
    //we create the element
    const itemInList = document.createElement("div");
    const itemRemove = document.createElement("button");

    //we set up the components of the element
    const itemName = "<div class='itemname col-md-3 col-4 text-end'>"+item.name+"</div>";
    const itemPrice = "<div class='itemprice col-md-3 col-4 text-center'>"+item.price+"€</div>"; 

    itemRemove.innerHTML = "Retirer cet article";
    itemRemove.classList.add("col-md-4", "col-12");
    //we build the element with an event listener for the remove button
    itemInList.classList.add("col12", "row", "p-1", "iteminlist");
    itemInList.innerHTML = itemName+itemPrice; 
    
    itemInList.appendChild(itemRemove);
    itemRemove.addEventListener("click", function(){
        removeFromCart(pos);
    });

    //we return the built element
    return itemInList;
}


//function that displays what's in the cart
const displayItemsInCart = async function(){
    let itemCount = numberItems();
    let anchor = document.getElementById("cartitemlist");
    let submitButton = document.getElementById("submitorder");
    //we wipe the cart clean, in case we're already on the page and updating the cart
    anchor.innerHTML = "";

    //we check that the cart is not empty
    if(itemCount>0){
        //we get the items in the cart
        let cart = getCart();

        //we use the display loop to calculate the price total
        let totalPrice = 0;

        for(i=0; i<cart.length; i++){
            //get the item
            let item = await getItem(cart[i]);
            //display the item
            anchor.appendChild(buildItemList(item, i));
            //add to price total
            totalPrice += item.price;
        }
        //we allow access to the order form
        document.getElementById("contactform").disabled = false;
        //we display the price total
        let totalDiv = document.createElement("div");
        totalDiv.classList.add("col-12", "p-3", "text-end");
        totalDiv.innerHTML = "<p>Total du panier : "+totalPrice+"€</p>"
        anchor.appendChild(totalDiv);
        //we add the eventListener to the submit button
        submitButton.addEventListener("click", placeOrder);
        //we check if the submit button was disabled, and if so we remove the class
        if(submitButton.classList.contains("btn-disabled")){
            submitButton.classList.remove("btn-disabled");
        }
    //if the cart is empty   
    } else {
        //we display a message
        anchor.innerHTML = "<p>Vous n'avez pas d'article dans votre panier.</p>";
        //we block access to the order form and the button
        document.getElementById("contactform").disabled = true;
        submitButton.classList.add("btn-disabled");
    }
}


//function that places the order
const placeOrder = function(event){
    //we select the form
    const target = document.getElementById("orderform");
    
    //we check if it's valid
    if(target.checkValidity() == false){
        //if invalid we let the event play out to get the most out of html5 form handling
        console.log("error : invalid inputs");
    }else{
        //if the form is valid, we prevent the submit event
        event.preventDefault();
        //we call the function that creates a contact object using the form
        let contact = getFormInfo(target);
        //then we create the order object (contact object + the cart array)
        let order = new Order(contact, getCart());
        //we call the function that sends orders
        sendOrder(order);
    }
}

//this function takes info from the form and creates a contact object
const getFormInfo = function(target){
    let formData = new FormData(target);
    let contact = new Contact(
        formData.get("firstname"),
        formData.get("lastname"),
        formData.get("address"),
        formData.get("city"),
        formData.get("email")  
    );
    //we return the contact object
    return contact;
}

//this function takes an order object and sends it
const sendOrder = async function(order){
    //calls the order API
    let response = await fetch("http://localhost:3000/api/cameras/order",{
        method: "POST",
        headers: {
            "Accept": 'application/json', 
            "Content-Type": "application/json"
        },
            //sends the order object in JSON format
            body: JSON.stringify(order)
        })
    if(response.ok){
        let data = await response.json();
        //we store the order
        localStorage.setItem("lastOrder", JSON.stringify(data));
        //we empty the cart
        deleteCart();
        //we redirect to the confirmation page, and pass the order id in the url
        window.location.replace("confirmation.html");
    }else{
        console.log(response);
    }
}

// ---------------- ORDER CONFIRMED --------------- //
//we display relevent informations
const displayOrdeRecap = function(){
    //we get the order data
    let order = JSON.parse(localStorage.getItem("lastOrder"));
    
    //we display the name of the customer in our thank you message
    const nameSpan = document.getElementById("customername");
    nameSpan.innerHTML = order.contact.firstName;

    //---- for the recap ----//
    //we set up the anchor
    const anchor = document.getElementById("orderrecap");
    
    //we create the components
    const orderidBloc = document.createElement("div");
    const recapBloc = document.createElement("div");
    

    //we set up the bloc that display the order ID
    orderidBloc.classList.add("col-12", "text-center");
    orderidBloc.innerHTML = "<p>Voici l'identifiant de votre commande : "+order.orderId+"</p>";

    //we set up the recap
    let priceTotal = 0;
    recapBloc.classList.add("col-md-4", "col-12", "mx-auto", "text-center", "row"); 
    recapBloc.innerHTML = "<h3>Récapitulatif de votre commande :</h3>"
    for(i=0; i<order.products.length; i++){
       recapBloc.innerHTML += "<p class='col-6'>"+order.products[i].name+"</p><p class='col-6'>"+order.products[i].price+"€</p>"
       priceTotal += order.products[i].price;
    }
    recapBloc.innerHTML += "<div class='text-center'> TOTAL : "+priceTotal+"€</div>";

    anchor.appendChild(orderidBloc);
    anchor.appendChild(recapBloc);
}


// ------------ DISPLAY PAGE SPECIFIC STUFF -------------- //
//We check where we are and what we should display
const pageType = document.querySelector("body");

switch(true) {
    case pageType.classList.contains("searchpage") :
        displayProducts();
        displayItemCount();
    break;
    case pageType.classList.contains("productpage") :
        displayItem();
        displayItemCount();
    break; 
    case pageType.classList.contains("cartpage") :
        displayItemsInCart();
        displayItemCount();
    break;
    case pageType.classList.contains("confirmation") :
        displayOrdeRecap();
    break;
    default : console.log("No special display functions were called");
}
