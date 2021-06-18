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
   
    //The anchor and the two divs that will make the preview
    const container = document.getElementById("productlist");
    const newPreview = document.createElement("div");
    const newPreviewInfo = document.createElement("div");

    //we build every element of the preview piecemeal for ease of use 
    const productImg = "<img class='prevImg' alt='picture of "+product.name+"' src='"+product.imageUrl+"'>"
    const productName = "<h3>"+product.name+"</h3>";
    const productPrice = "<p class='text-end'>"+product.price+"€</p>";

    //we set up the preview bloc
    newPreview.classList.add("col-12", "col-md-3", "p-1", "productpreview");
    newPreview.innerHTML = productImg;

    //we set up the info bloc
    newPreviewInfo.classList.add("container-fluid", "prevInfo", "p-1");
    newPreviewInfo.innerHTML = productName+productPrice;

    //we assemble the blocs and add them to the dom
    container.appendChild(newPreview);
    newPreview.appendChild(newPreviewInfo);

}

//call the function that displays the products
displayProducts();

