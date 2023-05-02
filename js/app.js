(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function formQuantity() {
        document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
                } else {
                    --value;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                    } else if (value < 1) value = 1;
                }
                targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
            }
        }));
    }
    function formRating() {
        const ratings = document.querySelectorAll(".rating");
        if (ratings.length > 0) initRatings();
        function initRatings() {
            let ratingActive, ratingValue;
            for (let index = 0; index < ratings.length; index++) {
                const rating = ratings[index];
                initRating(rating);
            }
            function initRating(rating) {
                initRatingVars(rating);
                setRatingActiveWidth();
                if (rating.classList.contains("rating_set")) setRating(rating);
            }
            function initRatingVars(rating) {
                ratingActive = rating.querySelector(".rating__active");
                ratingValue = rating.querySelector(".rating__value");
            }
            function setRatingActiveWidth(index = ratingValue.innerHTML) {
                const ratingActiveWidth = index / .05;
                ratingActive.style.width = `${ratingActiveWidth}%`;
            }
            function setRating(rating) {
                const ratingItems = rating.querySelectorAll(".rating__item");
                for (let index = 0; index < ratingItems.length; index++) {
                    const ratingItem = ratingItems[index];
                    ratingItem.addEventListener("mouseenter", (function(e) {
                        initRatingVars(rating);
                        setRatingActiveWidth(ratingItem.value);
                    }));
                    ratingItem.addEventListener("mouseleave", (function(e) {
                        setRatingActiveWidth();
                    }));
                    ratingItem.addEventListener("click", (function(e) {
                        initRatingVars(rating);
                        if (rating.dataset.ajax) setRatingValue(ratingItem.value, rating); else {
                            ratingValue.innerHTML = index + 1;
                            setRatingActiveWidth();
                        }
                    }));
                }
            }
            async function setRatingValue(value, rating) {
                if (!rating.classList.contains("rating_sending")) {
                    rating.classList.add("rating_sending");
                    let response = await fetch("rating.json", {
                        method: "GET"
                    });
                    if (response.ok) {
                        const result = await response.json();
                        const newRating = result.newRating;
                        ratingValue.innerHTML = newRating;
                        setRatingActiveWidth();
                        rating.classList.remove("rating_sending");
                    } else {
                        alert("Помилка");
                        rating.classList.remove("rating_sending");
                    }
                }
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    fetch("files/single-product.json").then((response => response.json())).then((data => {
        if (!data || !data.products || !Array.isArray(data.products)) throw new Error("Invalid data format");
        const productCardTemplate = document.querySelector("#product-card-template");
        function createProductCard(product) {
            const card = productCardTemplate.content.cloneNode(true);
            const image = card.querySelector(".product-image");
            const title = card.querySelector(".product-name");
            const price = card.querySelector(".product-price");
            const weight = card.querySelector(".product-weight");
            const id = card.querySelector(".product-id");
            const priceConsole = card.querySelector(".price-console");
            const idTwo = card.querySelector(".product-id-two");
            title.textContent = product.title;
            image.src = product.image;
            price.textContent = `${product.price}.00 ₴`;
            weight.textContent = `Вес: ${product.weight} г`;
            id.textContent = product.id;
            idTwo.textContent = product.id;
            priceConsole.textContent = product.price;
            return card;
        }
        const categories = {};
        data.products.forEach((product => {
            if (!categories[product.category]) categories[product.category] = [];
            categories[product.category].push(product);
        }));
        for (const category in categories) {
            const productList = document.querySelector(`.product-list[data-category="${category}"]`);
            if (productList) categories[category].forEach((product => {
                const card = createProductCard(product);
                productList.appendChild(card);
            }));
        }
    })).catch((error => console.error(error)));
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    fetch("files/single-product.json").then((response => response.json())).then((data => {
        const product = data.products.find((item => item.id === productId));
        if (product) {
            const image = document.querySelector(".product-image");
            const name = document.querySelector(".product-name");
            const title = document.querySelector(".product-title");
            const price = document.querySelector(".product-price");
            const weight = document.querySelector(".product-weight");
            const quantity = document.querySelector(".product-quantity");
            const ingredients = document.querySelector(".product-ingredients");
            const id = document.querySelector(".product-id");
            const priceConsole = document.querySelector(".price-console");
            const idTwo = document.querySelector(".product-id-two");
            image.src = product.image;
            name.textContent = product.title;
            title.textContent = product.title;
            price.textContent = `${product.price}.00 ₴`;
            quantity.textContent = `Количество: ${product.quantity}`;
            weight.textContent = `Вес: ${product.weight} г`;
            ingredients.textContent = "";
            id.textContent = product.id;
            idTwo.textContent = product.id;
            priceConsole.textContent = product.price;
            const ingredientsList = document.createElement("ul");
            ingredients.appendChild(ingredientsList);
            for (let ingredient of product.ingredients) {
                const ingredientItem = document.createElement("li");
                ingredientItem.innerText = ingredient;
                ingredientsList.appendChild(ingredientItem);
            }
            console.log(product);
        } else console.log(`Продукт с идентификатором ${productId} не найден`);
    })).catch((error => console.error(error)));
    const productLists = document.querySelectorAll(".product-list");
    productLists.forEach((productList => {
        productList.addEventListener("click", (event => {
            const card = event.target.closest(".item-product__body");
            if (!card) return;
            const id = card.querySelector(".product-id").textContent;
            console.log(id);
            const url = `./product-page.html?id=${id}`;
            window.location.href = url;
        }));
    }));
    let productIds = JSON.parse(localStorage.getItem("productIds")) || [];
    let total = parseFloat(localStorage.getItem("total")) || 0;
    const cartBtn = document.querySelectorAll(".product-list");
    cartBtn.forEach((cartBtn => {
        cartBtn.addEventListener("click", (event => {
            const card = event.target.closest(".action-body__cart");
            if (!card) return;
            const idCard = card.querySelector(".product-id-two").textContent;
            const price = card.querySelector(".price-console").textContent;
            productIds.push(idCard);
            total += parseFloat(price);
            console.log(productIds);
            console.log(total);
            const cartTotal = document.querySelector("#cart-total");
            cartTotal.textContent = total.toFixed(2) + " ₴";
            localStorage.setItem("productIds", JSON.stringify(productIds));
            localStorage.setItem("total", total);
        }));
    }));
    const toCartBtn = document.querySelector(".action-body__cart");
    if (toCartBtn) toCartBtn.addEventListener("click", (() => {
        const id = document.querySelector(".product-id-two").textContent;
        const price = document.querySelector(".price-console").textContent;
        productIds.push(id);
        console.log(`ID товара: ${id}, Price: ${price}`);
        console.log(productIds);
        total += parseFloat(price);
        console.log(total);
        const cartTotal = document.querySelector("#cart-total");
        cartTotal.textContent = total.toFixed(2) + " ₴";
        localStorage.setItem("productIds", JSON.stringify(productIds));
        localStorage.setItem("total", total);
    }));
    function updateCartTotal() {
        const cartTotal = document.querySelector("#cart-total");
        total = parseFloat(localStorage.getItem("total")) || 0;
        cartTotal.textContent = total.toFixed(2) + " ₴";
    }
    updateCartTotal();
    if ("/cart-page.html" === window.location.pathname) {
        const savedProductIds = localStorage.getItem("productIds");
        if (savedProductIds) {
            productIds = JSON.parse(savedProductIds);
            fetch("files/single-product.json").then((response => response.json())).then((data => {
                const cartProducts = data.products.filter((product => productIds.includes(product.id)));
                const total = cartProducts.reduce(((accumulator, currentValue) => accumulator + currentValue.price), 0);
                const titleProducts = cartProducts.map((product => product.title));
                const priceProducts = cartProducts.map((product => product.price));
                const productNamesContainer = document.querySelector(".product-names");
                if (productNamesContainer) {
                    const productNamesList = document.createElement("ul");
                    productNamesList.classList.add("list-product");
                    for (let i = 0; i < titleProducts.length; i++) {
                        const listItem = document.createElement("li");
                        listItem.classList.add("item-product-buy");
                        const title = document.createElement("p");
                        title.classList.add("title-product-buy");
                        title.textContent = titleProducts[i];
                        const price = document.createElement("span");
                        price.classList.add("price-product-buy");
                        price.textContent = `${priceProducts[i]}.00 ₴`;
                        listItem.appendChild(title);
                        listItem.appendChild(price);
                        productNamesList.appendChild(listItem);
                    }
                    productNamesContainer.appendChild(productNamesList);
                }
                const totalPrices = document.querySelectorAll(".total-price__summary");
                totalPrices.forEach((element => {
                    element.textContent = `${total}.00 ₴`;
                }));
                const productCardTemplate = document.querySelector("#card-template");
                function createProductCard(product) {
                    const card = productCardTemplate.content.cloneNode(true);
                    const image = card.querySelector(".product-image");
                    const title = card.querySelector(".product-name");
                    const price = card.querySelector(".product-price");
                    const weight = card.querySelector(".product-weight");
                    const quantity = card.querySelector(".product-quantity");
                    const id = card.querySelector(".product-id");
                    const idForDeleteBtn = card.querySelector(".id-delete-btn");
                    title.textContent = product.title;
                    image.src = product.image;
                    price.textContent = `${product.price}.00 ₴`;
                    weight.textContent = `Вес: ${product.weight} г.`;
                    quantity.textContent = `Количество: ${product.quantity} шт.`;
                    id.textContent = product.id;
                    idForDeleteBtn.textContent = product.id;
                    return card;
                }
                const productList = document.querySelector(".cart-list");
                if (productList) cartProducts.forEach((product => {
                    const card = createProductCard(product);
                    productList.appendChild(card);
                }));
            })).catch((error => console.error(error)));
        }
        function updateCartTotal(cartProducts) {
            const productNamesContainer = document.querySelector(".product-names");
            const totalPrices = document.querySelectorAll(".total-price__summary");
            let total = 0;
            productNamesContainer.innerHTML = "";
            cartProducts.forEach((product => {
                const productName = document.createElement("div");
                productName.classList.add("product-name");
                productName.textContent = product.name;
                productNamesContainer.appendChild(productName);
                total += product.price;
            }));
            totalPrices.forEach((element => {
                element.textContent = `${total}.00 ₴`;
            }));
        }
        const cartList = document.querySelector(".cart-list");
        cartList.addEventListener("click", (event => {
            if (event.target.classList.contains("remove-btn")) {
                const productId = event.target.closest(".cart-list__body").querySelector(".id-delete-btn").textContent;
                const index = productIds.indexOf(productId);
                if (index > -1) {
                    productIds.splice(index, 1);
                    localStorage.setItem("productIds", JSON.stringify(productIds));
                    const cartItem = event.target.closest(".cart-list__body");
                    cartItem.remove();
                    updateCartTotal();
                }
                console.log(`Товар ${productId} удален из корзины.`);
            }
        }));
        const form = document.querySelector(".order-page__form");
        form.addEventListener("submit", (function(e) {
            e.preventDefault();
            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const addressInput = form.querySelector('input[name="address"]');
            const deliveryRadio = form.querySelector('input[name="delivery"]:checked');
            const paymentRadio = form.querySelector('input[name="payment"]:checked');
            const infoTextarea = form.querySelector('textarea[name="info"]');
            const name = nameInput ? nameInput.value : "";
            const phone = phoneInput ? phoneInput.value : "";
            const address = addressInput ? addressInput.value : "";
            const delivery = deliveryRadio ? deliveryRadio.value : "";
            const payment = paymentRadio ? paymentRadio.value : "";
            const info = infoTextarea ? infoTextarea.value : "";
            const productsList = document.querySelectorAll(".list-product li");
            const products = [];
            for (let product of productsList) {
                const title = product.querySelector(".title-product-buy").textContent;
                const price = product.querySelector(".price-product-buy").textContent;
                products.push(`${title} \n ${price}`);
            }
            const productsMessage = products.map(((product, index) => {
                if (0 === index) return `\n\t${product}`;
                return `\t${product}`;
            })).join("\n");
            console.log(productsMessage);
            const totalSum = document.querySelector(".total-price__summary").textContent;
            const orderData = {
                orderNumber: Math.floor(100 * Math.random()),
                dateTime: (new Date).toLocaleString("uk-UA"),
                name,
                phone,
                address,
                info,
                delivery,
                payment,
                productsMessage,
                totalSum
            };
            console.log(orderData);
            const message = `Новый заказ:\n\n      ${"📝"}: \t\t${orderData.orderNumber}\n      \t\t${orderData.dateTime}\n\n\n      ${"👤"}: \t\t${orderData.name}\n      ${"📞"}: \t\t${orderData.phone}\n      ${"🏠"}: \t\t${orderData.address}\n      ${"ℹ"}:  \t\t${orderData.info}\n\n\n      ${"🚚"}: \t\t${orderData.delivery}\n      ${"🧾"}: \t\t${orderData.payment}\n\n\n      \t\t${orderData.productsMessage}\n\n      ${"💰"}: \t\t${orderData.totalSum}`;
            fetch(`https://api.telegram.org/bot${"6051240657:AAFDbc5xa3gTJTcEMC0Gy4gKIzJfDXitQ4s"}/sendMessage?chat_id=${"-1001817694774"}&text=${encodeURIComponent(message)}`).then((response => {
                if (!response.ok) throw new Error("Network response was not ok");
                console.log("Telegram message sent successfully");
            })).catch((error => {
                console.error("Error sending Telegram message:", error);
            }));
        }));
    }
    window["FLS"] = true;
    isWebp();
    formQuantity();
    formRating();
})();