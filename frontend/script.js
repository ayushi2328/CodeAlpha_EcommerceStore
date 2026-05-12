const searchInput =
document.getElementById("searchInput");
const productsContainer =
document.getElementById("productsContainer");

const productForm =
document.getElementById("productForm");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const cartCount =
document.getElementById("cartCount");

const userInfo =
document.getElementById("userInfo");

const logoutBtn =
document.getElementById("logoutBtn");

const authSection =
document.getElementById("authSection");

const checkoutBtn =
document.getElementById("checkoutBtn");

let cart = [];

let editProductId = null;

/* =========================
   AUTH SECTION
========================= */

async function handleAuth(type) {

const nameField =
document.getElementById("authName");

const emailField =
document.getElementById("authEmail");

const passField =
document.getElementById("authPassword");

const name =
nameField.value.trim();

const email =
emailField.value.trim();

const password =
passField.value.trim();

/* VALIDATION */

if (!email || !password) {

alert(
"Email and Password required ❌"
);

return;

}

if (
type === "signup" &&
!name
) {

alert(
"Name required for registration ❌"
);

return;

}

const endpoint =
type === "signup"
? "/api/auth/signup"
: "/api/auth/login";

const bodyData =
type === "signup"
? {
name,
email,
password,
}
: {
email,
password,
};

try {

const res = await fetch(
`http://localhost:5000${endpoint}`,
{
method: "POST",

headers: {
"Content-Type":
"application/json",
},

body: JSON.stringify(
bodyData
),
}
);

const data =
await res.json();

if (res.ok) {

/* SUCCESS */

alert(
`${type === "signup"
? "Registration Successful ✅"
: "Login Successful ✅"}`
);

/* CLEAR INPUTS */

nameField.value = "";
emailField.value = "";
passField.value = "";

/* AFTER SIGNUP */

if (type === "signup") {

alert(
"Now Login with same email & password 😊"
);

}

/* AFTER LOGIN */

if (type === "login") {

localStorage.setItem(
"token",
data.token
);

const userName =
data.user?.name ||
data.name ||
name ||
"User";

localStorage.setItem(
"userName",
userName
);

updateUserUI();

}

} else {

alert(
data.message ||
`${type === "signup"
? "Registration Failed ❌"
: "Login Failed ❌"}`
);

}

} catch (err) {

console.error(
"Auth Error:",
err
);

alert(
"Server Error ❌"
);

}

}

/* =========================
   USER UI
========================= */

function updateUserUI() {

const savedName =
localStorage.getItem("userName");

if (
savedName &&
savedName !== "undefined"
) {

/* SHOW USER */

userInfo.innerHTML =
`👋 Hello, ${savedName}`;

/* SHOW LOGOUT */

logoutBtn.classList.remove(
"hidden"
);

/* DISPLAY BUTTON */

logoutBtn.style.display =
"inline-block";

/* HIDE AUTH SECTION */

authSection.style.display =
"none";

} else {

/* REMOVE USER */

userInfo.innerHTML = "";

/* HIDE LOGOUT */

logoutBtn.classList.add(
"hidden"
);

logoutBtn.style.display =
"none";

/* SHOW AUTH AGAIN */

authSection.style.display =
"block";

}

}

/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
"click",
() => {

localStorage.removeItem(
"token"
);

localStorage.removeItem(
"userName"
);

/* RESET UI */

updateUserUI();

alert(
"Logged Out Successfully 👋"
);

}
);

/* =========================
   FETCH PRODUCTS
========================= */

async function fetchProducts() {

try {

const res = await fetch(
"http://localhost:5000/api/products"
);

const products =
await res.json();

displayProducts(products);

} catch (err) {

console.error(
"Fetch Error:",
err
);

}

}

/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(products) {

productsContainer.innerHTML =
"";

products.forEach((p) => {

const card =
document.createElement("div");

card.className =
"product-card";

card.innerHTML = `

<h3>${p.name}</h3>

<p>${p.description}</p>

<p>
<strong>
₹${p.price}
</strong>
</p>

<div class="btn-group">

<button
class="cart-btn"
onclick="addToCart(
'${p.name}',
${p.price}
)"
>
Add to Cart
</button>

<button
class="edit-btn"
onclick="editProduct(
'${p._id}',
'${p.name}',
${p.price},
'${p.description}'
)"
>
Edit
</button>

<button
class="delete-btn"
onclick="deleteProduct(
'${p._id}'
)"
>
Delete
</button>

</div>

`;

productsContainer.appendChild(
card
);

});

}
/* =========================
   SEARCH PRODUCTS
========================= */

searchInput.addEventListener(
"input",
async (e) => {

const searchText =
e.target.value.toLowerCase();

try {

const res = await fetch(
"http://localhost:5000/api/products"
);

const products =
await res.json();

/* FILTER PRODUCTS */

const filteredProducts =
products.filter((product) =>

product.name
.toLowerCase()
.includes(searchText)

);

displayProducts(
filteredProducts
);

} catch (err) {

console.error(
"Search Error:",
err
);

}

}
);

/* =========================
   ADD / UPDATE PRODUCT
========================= */

productForm.addEventListener(
"submit",
async (e) => {

e.preventDefault();

const token =
localStorage.getItem(
"token"
);

if (!token) {

alert(
"Please Login First ❌"
);

return;

}

const data = {

name:
document.getElementById(
"name"
).value,

price:
document.getElementById(
"price"
).value,

description:
document.getElementById(
"description"
).value,

};

const url =
editProductId
? `http://localhost:5000/api/products/${editProductId}`
: "http://localhost:5000/api/products/add";

const method =
editProductId
? "PUT"
: "POST";

try {

await fetch(url, {

method,

headers: {
"Content-Type":
"application/json",
},

body: JSON.stringify(data),

});

alert(
editProductId
? "Product Updated ✅"
: "Product Added ✅"
);

editProductId = null;

productForm.reset();

fetchProducts();

} catch (err) {

console.error(err);

}

}
);

/* =========================
   DELETE PRODUCT
========================= */

window.deleteProduct =
async (id) => {

const token =
localStorage.getItem(
"token"
);

if (!token) {

alert(
"Please Login First ❌"
);

return;

}

if (
confirm(
"Delete this product?"
)
) {

try {

await fetch(
`http://localhost:5000/api/products/${id}`,
{
method: "DELETE",
}
);

alert(
"Product Deleted 🗑️"
);

fetchProducts();

} catch (err) {

console.error(err);

}

}

};

/* =========================
   EDIT PRODUCT
========================= */

window.editProduct =
(id, name, price, desc) => {

const token =
localStorage.getItem(
"token"
);

if (!token) {

alert(
"Please Login First ❌"
);

return;

}

editProductId = id;

document.getElementById(
"name"
).value = name;

document.getElementById(
"price"
).value = price;

document.getElementById(
"description"
).value = desc;

window.scrollTo({
top: 0,
behavior: "smooth",
});

};

/* =========================
   ADD TO CART
========================= */

window.addToCart =
(name, price) => {

cart.push({
name,
price,
});

updateCart();

alert(
`${name} added to cart 🛒`
);

};

/* =========================
   UPDATE CART
========================= */

function updateCart() {

if (cart.length === 0) {

cartItems.innerHTML =
"<p>Your cart is empty 🛒</p>";

} else {

cartItems.innerHTML =

cart.map(
(item) =>

`
<div class="cart-item">

<p>
${item.name}
- ₹${item.price}
</p>

</div>
`

).join("");

}

const total =

cart.reduce(
(sum, item) =>

sum + Number(item.price),

0
);

cartTotal.innerText =
`Total: ₹${total}`;

cartCount.innerText =
`Cart: ${cart.length}`;

}

/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener(
"click",
() => {

const token =
localStorage.getItem(
"token"
);

if (!token) {

alert(
"Please Login First ❌"
);

return;

}

if (cart.length === 0) {

alert(
"Cart is empty 🛒"
);

return;

}

alert(
"Order Placed Successfully 🎉"
);

cart = [];

updateCart();

}
);

/* =========================
   INITIAL RUN
========================= */

updateUserUI();

fetchProducts();

updateCart();