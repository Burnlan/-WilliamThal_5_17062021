//calls the API and return the JSON the API gives
const getProducts = async function(){
    
    let response = await fetch("http://localhost:3000/api/cameras");
    let data = await response.json();

    return data;
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
   
    const container = document.getElementById("productlist");
    const newPreview = document.createElement("div");
    //we build every element of the preview piecemeal for ease of use 
    const productImg = "<img class='prevImg' alt='picture of "+product.name+"' src='"+product.imageUrl+"'>"
    const productName = "<h3>"+product.name+"</h3>";
    const productPrice = "<p>"+product.price+"€</p>";

    newPreview.classList.add("col-12", "col-md-3", "p-3", "productpreview");
    newPreview.innerHTML = productImg+productName+productPrice;

    container.appendChild(newPreview);

}

//call the function that displays the products
displayProducts();

