//get the parameter in URL
const productId = new URLSearchParams(window.location.search).get("id");
console.log(productId);

//get the item using the parameter in URL
const getItem = async function(){
    try{
        let response = await fetch("http://localhost:3000/api/cameras/"+productId);
        if(response.ok){
            let data = await response.json();

        return data;
        }
        
    }
    catch(err){
        console.log(err);
    }
}


//fill the page with item info
const displayItem = async function(){
    //wait for the API to give item infos
    let item = await getItem();
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

//we display the item
displayItem();


//cart array init if it doesn't exist
let checkCart = localStorage.getItem("cart");
if(checkCart === null){
    var cart = [];
    window.localStorage;
    localStorage.setItem("cart", JSON.stringify(cart));
}


//CODE FOR THE ADD TO CART BUTTON
const addToCart = function(){

    let cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);
    cart.push(productId);
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

}