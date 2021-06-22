const initCart = async function(){
    //Test the /order api
        let order = {
            contact: {
                firstName:" ", 
                lastName:" ", 
                address:" ", 
                city:" ", 
                email:" "
            },
            products: [productId]
        };
    
        console.log(order);
        
        let response = await fetch("http://localhost:3000/api/cameras/order",{
            method: "POST",
            headers: {
                "Accept": 'application/json', 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        if(response.ok){
            let data = await response.json();
            console.log(data.products);
        }else{
            console.log(response);
        }
}

