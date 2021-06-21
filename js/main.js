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

//call the function that displays the products
displayProducts();


