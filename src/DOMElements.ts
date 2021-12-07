import {filterButtonsByCategory, getShoppingCartItems} from "./DOMFunctions";
import {postOrder} from "./api";


export const breakfastButton = document.getElementById("breakfast-button");
export const beveragesButton = document.getElementById("beverages-button");
export const fruitButton = document.getElementById("fruit-button");
export const cakeButton = document.getElementById("cake-button");
export const favouritesButton = document.getElementById("favourite-button");
export const logoutButton = document.getElementById("logout-button");
export const checkoutButton = document.getElementById("checkout-button");
export const shoppingCart = document.getElementById("shopping-cart-body");

const categoryButtons = [breakfastButton, beveragesButton, fruitButton, cakeButton, favouritesButton];
categoryButtons.forEach(button => button.addEventListener("click", () => {
    filterButtonsByCategory(button. id.split("-")[0]);
}));

checkoutButton.addEventListener("click", () => {
    console.log("Checkout clicked");
    postOrder(getShoppingCartItems()).then((response) => {
        console.log(response);
        alert("Order placed successfully! \nOrder ID: " + response.orderId);
        document.location.reload();
    });
});

logoutButton.addEventListener("click", () => {
    console.log("Logout clicked");
    document.location.reload();
});
