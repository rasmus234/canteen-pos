import {filterButtonsByCategory, getSelectedLunchItems, getShoppingCartItems} from "./DOMFunctions";
import {postOrder, setEmployeeLunch} from "./api";
import {EmployeeLunch} from "./models";
import {currentEmployee} from "./index";

import {}'bootstrap/dist/js/bootstrap.bundle'


export const breakfastButton = document.getElementById("breakfast-button");
export const beveragesButton = document.getElementById("beverages-button");
export const fruitButton = document.getElementById("fruit-button");
export const cakeButton = document.getElementById("cakes-button");
export const favouritesButton = document.getElementById("favourite-button");
export const logoutButton = document.getElementById("logout-button");
export const checkoutButton = document.getElementById("checkout-button");
export const shoppingCart = document.getElementById("shopping-cart-body");
export const confirmLunchButton = document.getElementById("confirm-lunch-button");

const categoryButtons = [breakfastButton, beveragesButton, fruitButton, cakeButton, favouritesButton];
categoryButtons.forEach(button => button.addEventListener("click", () => {
    filterButtonsByCategory(button.id.split("-")[0]);
}));

confirmLunchButton.addEventListener("click", () => {
    const lunchItems = getSelectedLunchItems();
    const employeeLunch: EmployeeLunch = {
        employeeId: currentEmployee.employeeId,
        lunchMenuId: 2,
        monday: lunchItems[0],
        tuesday: lunchItems[1],
        wednesday: lunchItems[2],
        thursday: lunchItems[3],
        friday: lunchItems[4],
    };
    let result = setEmployeeLunch(employeeLunch);
    const offcanvas = new bootstrap.offcanvas
    if (result){
        document.getElementById("offcanvas-lunches").classList.remove("show");
    }
    else {
        alert("Something went wrong");
    }
});

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