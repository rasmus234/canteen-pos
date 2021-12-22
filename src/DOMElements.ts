import {filterButtonsByCategory, getSelectedLunchItems, getShoppingCartItems, logOut} from "./DOMFunctions";
import {postOrder, setEmployeeLunch} from "./api";
import {EmployeeLunch} from "./models";
import {currentEmployee, currentMenu} from "./canteen";

export const breakfastButton = document.getElementById("breakfast-button");
export const beveragesButton = document.getElementById("beverages-button");
export const fruitButton = document.getElementById("fruits-button");
export const cakeButton = document.getElementById("cakes-button");
export const favouritesButton = document.getElementById("favourite-button");
export const logoutButton = document.getElementById("logout-button");
export const checkoutButton = document.getElementById("checkout-button");
export const shoppingCart = document.getElementById("shopping-cart-body");
export const confirmLunchButton = document.getElementById("confirm-lunch-button");

const categoryButtons = [breakfastButton, beveragesButton, fruitButton, cakeButton, favouritesButton];
categoryButtons.forEach(button => button.addEventListener("click", () => {
    filterButtonsByCategory(button.id.split("-")[0]);

    for (const categoryButton of categoryButtons) {
        if (categoryButton.id == button.id) {
            categoryButton.style.backgroundColor = "green";
        } else {
            categoryButton.style.backgroundColor = "";
        }
    }

}));

confirmLunchButton.addEventListener("click", () => {
    const lunchItems = getSelectedLunchItems();
    const employeeLunch: EmployeeLunch = {
        employeeId: currentEmployee.employeeId,
        lunchMenuId: currentMenu.lunchMenuId,
        monday: lunchItems[0],
        tuesday: lunchItems[1],
        wednesday: lunchItems[2],
        thursday: lunchItems[3],
        friday: lunchItems[4],
    };
    let result = setEmployeeLunch(employeeLunch);

    if (!result) {
        alert("Something went wrong, please try again");
    }
});

checkoutButton.addEventListener("click", () => {
    postOrder(getShoppingCartItems()).then((response) => {
        alert("Order placed successfully! \nOrder ID: " + response.orderId);
        document.location.reload();
    });
});

logoutButton.addEventListener("click", () => {
    logOut();
});