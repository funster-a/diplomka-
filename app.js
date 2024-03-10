let CART = "";
let PATH = '/data/products.json';


function getUser() {
	if(sessionStorage.getItem('isAuthenticated')) {
		
		let count = 0;
		let currUserId = sessionStorage.getItem('currUserId');
		let currentUserCartKey = 'cart_' + currUserId;
		count = JSON.parse(localStorage.getItem(currentUserCartKey || "[]")).length;
		document.getElementById('basket').innerHTML = count;
		document.getElementById('loginButton').style.display = 'none';
		document.getElementById('cartName').innerHTML =  sessionStorage.getItem('currUserName') + ' Корзина' ;

	} else {
		document.getElementById('cartName').innerHTML = "Cart";
		document.getElementById('logoutButton').style.display = 'none';
		document.getElementById('basket-container').style.display = 'none';
		loadJSON(PATH);
	};
	
	getAll();
}


function loadJSON(PATH) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				let data = JSON.parse(xhr.responseText);
				localStorage.setItem('products', JSON.stringify(data));
			} else {
				window.alert('Что-то пошло не так, загружаюсь!!');
			}
		}
	};
	xhr.open('GET', PATH, true);
	xhr.send();
}


function getCart() {
	if(sessionStorage.getItem('isAuthenticated')) {
		window.location = '/cart/cart.html'
	} else {
		alert("Войдите чтобы использовать корзину");
		window.location = '/auth/login.html';
	}
}


function getAll() {
	renderProducts();
	document.getElementById('cat-pc').classList.remove('active');
	document.getElementById('cat-lap').classList.remove('active');
	document.getElementById('cat-all').classList.add('active');
}

function getForPc() {
	renderProducts('pc');
	document.getElementById('cat-all').classList.remove('active');
	document.getElementById('cat-lap').classList.remove('active');
	document.getElementById('cat-pc').classList.add('active');
}


function getLaptops() {
	renderProducts('laptop');
	document.getElementById('cat-all').classList.remove('active');
	document.getElementById('cat-pc').classList.remove('active');
	document.getElementById('cat-lap').classList.add('active');
}



function renderProducts(cat) {
	let productContainer = document.getElementById('product-container');
	productContainer.innerHTML = "";
	let data = JSON.parse(localStorage.getItem('products'));
	data.forEach(item => {
		if(cat) {
			if(item.category === cat) {
				productContainer.innerHTML += `
					<div class="product-item">
						<div class="prod-image">
							<img src="${item.imageURL}" alt="">
						</div>
						<div class="prod-data" >
							<span id="prod-title">${item.name}</span>
							<span id="prod-price"> ${item.price} ₸</span>
							<p id="prod-description">${item.description}</p>
							<form action="javascript:addToCart('${item.id}')" class="cart-btn">
								<button class="btn" id="add-to-cart" type="submit">В корзину</button>
							</form>
						</div>
					</div>
					<div class="vertical-space"></div>
			`;
			}
		} else {
			productContainer.innerHTML += `
					<div class="product-item">
						<div class="prod-image">
							<img src="${item.imageURL}" alt="">
						</div>
						<div class="prod-data" >
							<span id="prod-title">${item.name}</span>
							<span id="prod-price"> ${item.price} ₸</span>
							<p id="prod-description">${item.description}</p>
							<form action="javascript:addToCart('${item.id}')" class="cart-btn">
								<button class="btn" id="add-to-cart" type="submit">В корзину</button>
							</form>
						</div>
					</div>
					<div class="vertical-space"></div>
			`;
		}
	});

}


function addToCart(prodId) {
	if(sessionStorage.getItem('isAuthenticated')) {
		let currUserId = sessionStorage.getItem('currUserId');
		let currentUserCartKey = 'cart_' + currUserId;
		CART = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
		let isAlreadyInCart = CART.some(item => item.id === item.id);
		if(isAlreadyInCart) {
			CART.forEach(item => {
				if(item.id === prodId) {
					item.count++;
				}
			})
		} else {
			CART.push({"id":prodId,"count":1});
		}
		localStorage.setItem(currentUserCartKey, JSON.stringify(CART));
		window.alert("Успешно добавлено");
		window.location.reload();
	} else {
		window.alert("Сначала войдите в аккаунт.")
	}
}


function logout() {
	sessionStorage.clear();
	window.location = '../index.html'
}


