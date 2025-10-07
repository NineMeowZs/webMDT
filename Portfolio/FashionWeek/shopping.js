window.onload = pageLoad;

function pageLoad(){
   var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "cloth.json");
    xhr.onload = function() { 
        var jsdata = JSON.parse(xhr.responseText);
        showData(jsdata);
    }; 
     xhr.onerror = function() { 
         alert("ERROR!"); 
    }; 
     xhr.send();
}

function showData(data){
	const productBoxes = document.querySelectorAll('#layer div');
	const keys = Object.keys(data);
	for(let i = 0; i < keys.length; i++){
		
		if (i < productBoxes.length) {

			let key = keys[i];
			let product = data[key];
			let box = productBoxes[i];

			let productImg = document.createElement('img');
			let brandName = document.createElement('h2');  
			let priceText = document.createElement('p');  

			productImg.src = 'pic/' + product.img;
			productImg.style.width = "95%";
            productImg.style.margin = "5%";
			
			brandName.textContent = "Brand: " + product.brand;
			priceText.textContent = "Price: " + product.price + " THB";
            priceText.style.fontWeight = "bold";
			box.appendChild(productImg);
			box.appendChild(brandName);
			box.appendChild(priceText);
		}
	}
}