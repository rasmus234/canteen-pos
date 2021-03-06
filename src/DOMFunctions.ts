import {shoppingCart} from "./DOMElements";
import {Employee, EmployeeLunch, Item} from "./models";
import {currentEmployee, currentMenu, employeeCakes, menuItems} from "./canteen";
import * as $ from "jquery";
import {addFavouriteItem, baseUrl, removeFavouriteItem} from "./api";

const blobPrefix = "data:image/png;base64,";


export function createMenuItem(menuItem: Item) {

    if (menuItem.category.name == "Cakes" && !employeeCakes.some(cake => cake.itemId == menuItem.itemId && cake)
    ) {
        return;
    }


    let favouriteIcon: HTMLImageElement = document.createElement("img");
    let buttonElement: HTMLButtonElement = document.createElement("button");
    let spanPriceElement: HTMLSpanElement = document.createElement("span");
    let spanNameElement: HTMLSpanElement = document.createElement("span");
    let imageElement: HTMLImageElement = document.createElement("img");

    favouriteIcon.addEventListener("click", () => {
        event.stopPropagation();
        const isFavourite = favouriteIcon.classList.contains("favourite");
        if (isFavourite) {
            favouriteIcon.classList.replace("favourite", "not-favourite");
            buttonElement.setAttribute("data-favourite", "false");
            removeFavouriteItem(menuItem.itemId);
        } else {
            favouriteIcon.classList.replace("not-favourite", "favourite");
            buttonElement.setAttribute("data-favourite", "true");
            addFavouriteItem(menuItem.itemId);
        }
    });
    //Setup image
    imageElement.src = baseUrl + "items/" + menuItem.itemId + "/image";
    
    //Setup span price text
    spanPriceElement.className = "price";
    spanPriceElement.innerText = menuItem.price.toString() + " kr";
    
    //Setup span name text
    spanNameElement.textContent = menuItem.name;

    //Setup button
    buttonElement.className = "btn btn-primary btn-lg menu-item";
    buttonElement.type = "button";
    buttonElement.setAttribute("data-category", menuItem.category.name);
    buttonElement.setAttribute("data-price", String(menuItem.price));
    buttonElement.setAttribute("data-item-id", String(menuItem.itemId));

    const favouriteItemIds = (currentEmployee as Employee).items;
    if (favouriteItemIds.includes(menuItem.itemId)) {
        buttonElement.setAttribute("data-favourite", "true");
        favouriteIcon.className = "favourite";
    } else {
        buttonElement.setAttribute("data-favourite", "false");
        favouriteIcon.className = "not-favourite";
    }


    buttonElement.addEventListener("click", (ev) => {
        createShoppingCartItem(buttonElement);
        itemChosenEffect(buttonElement, buttonElement.offsetLeft, buttonElement.offsetTop);

    });

    const menuItems = document.getElementById('menu-items-div') as HTMLDivElement;
    buttonElement.append(favouriteIcon);
    buttonElement.append(imageElement);
    buttonElement.append(spanPriceElement);
    buttonElement.append(spanNameElement);

    menuItems.append(buttonElement);

    return buttonElement;
}

function updateCounter() {
    let counter = document.getElementById('shopping-cart-count') as HTMLDivElement;
    counter.textContent = String(shoppingCart.children.length);
}

$(".lunch-card").click(function () {
    $(this).toggleClass('lunch-active');
});


function itemChosenEffect(element: HTMLElement, x, y) {
    //Make a copy of the element
    let elemClone = element.cloneNode(true) as HTMLElement;
    elemClone.removeChild(elemClone.firstChild);
    elemClone.removeChild(elemClone.lastChild);
    element.append(elemClone);

    elemClone.style.width = element.offsetWidth + "px";
    elemClone.style.height = element.offsetHeight + "px";

    //Set Initial position
    elemClone.style.left = x + "px";
    elemClone.style.top = y + "px";


    document.body.append(elemClone);
    elemClone.style.position = "absolute";
    elemClone.style.zIndex = "9999";
    //Get target coordinates and size
    let xT = document.getElementById('shopping-cart').offsetLeft;
    let yT = document.getElementById('shopping-cart').offsetTop;
    let wT = document.getElementById('shopping-cart').offsetWidth;
    let hT = document.getElementById('shopping-cart').offsetHeight;


    //Set target coordinates and size, CSS will handle the animation
    elemClone.style.left = xT + 'px';
    elemClone.style.top = yT + 'px';
    elemClone.style.width = wT + 'px';
    elemClone.style.height = hT + 'px';


    //On transition end, do a shopping cart animation
    let i = 0;
    elemClone.addEventListener('transitionend', () => {
        i++;
        if (i < 3) {
            return;
        }
        elemClone.remove();
        updateCounter();


        $("#shopping-cart").animate({
            height: "25px"
        }, 75, "linear", function () {

            $("#shopping-cart").animate({
                height: "50px"
            }, 75, "linear", function () {
            });
        });


    });

}

export function filterButtonsByCategory(category: string) {
    let buttons: HTMLButtonElement[] = document.getElementsByClassName('menu-item') as unknown as HTMLButtonElement[];


    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("data-category").toLowerCase() == category.toLowerCase()) {
            buttons[i].style.display = "block";
        } else {
            buttons[i].style.display = "none";
        }
    }
    if (category === "favourite") {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("data-favourite") === "true") {
                buttons[i].style.display = "block";
            } else {
                buttons[i].style.display = "none";
            }
        }
        return;
    }

}

function createShoppingCartItem(buttonElement: HTMLButtonElement) {
    let itemClone = buttonElement.cloneNode(false) as HTMLButtonElement;
    let spanClone = buttonElement.children[1].cloneNode() as HTMLSpanElement;
    itemClone.className = "btn btn-primary shopping-cart-item";
    
    
    shoppingCart?.append(itemClone);
    itemClone.append(spanClone);

    itemClone.addEventListener("click", (ev) => {
        itemClone.remove();
        refreshNavBar();
        updateCounter();
    });
    refreshNavBar();
}

export function getTotalPrice(): number {
    let totalPrice = 0;
    const shoppingCartItems = document.getElementsByClassName('shopping-cart-item') as unknown as HTMLButtonElement[];
    for (let i = 0; i < shoppingCartItems.length; i++) {
        totalPrice += parseFloat(shoppingCartItems[i].getAttribute("data-price"));
    }
    return totalPrice;
}

export function getTotalItems(): number {
    let totalItems = 0;
    const shoppingCartItems = document.getElementsByClassName('shopping-cart-item') as unknown as HTMLButtonElement[];
    for (let i = 0; i < shoppingCartItems.length; i++) {
        totalItems += 1;
    }
    return totalItems;
}


export function getShoppingCartItems(): Item[] {
    let items: Item[] = [];
    const shoppingCartItems = document.getElementsByClassName('shopping-cart-item') as unknown as HTMLButtonElement[];
    for (let i = 0; i < shoppingCartItems.length; i++) {
        let item: Item = {
            itemId: parseInt(shoppingCartItems[i].getAttribute("data-item-id")),
            name: "none",
            price: parseFloat(shoppingCartItems[i].getAttribute("data-price")),
            category: {
                name: shoppingCartItems[i].getAttribute("data-category")
            },
            image: (shoppingCartItems[i].children[0] as HTMLImageElement).src.replace(blobPrefix, "")
        };
        items.push(item);
    }
    return items;
}


export function refreshNavBar(): void {
    const totalPrice = document.getElementById("nav-total-price");
    const itemCount = document.getElementById("nav-item-count");
    const employeeName = document.getElementById("nav-employee-name");

    employeeName.textContent = "User: " + currentEmployee.firstName + " " + currentEmployee.lastName;
    totalPrice.textContent = "Total: " + getTotalPrice();
    itemCount.textContent = "Items: " + getTotalItems();

}

export function getSelectedLunchItems(): boolean[] {

    const lunchItems: HTMLButtonElement[] = document.getElementsByClassName('lunch-card') as unknown as HTMLButtonElement[];
    let selectedLunchItems: boolean[] = [];

    for (let i = 0; i < lunchItems.length; i++) {
        if (lunchItems[i].classList.contains("lunch-active")) {
            selectedLunchItems.push(true);
        } else {
            selectedLunchItems.push(false);
        }
    }
    return selectedLunchItems;
}

export function logOut() {
    localStorage.removeItem("password");
    window.location.href = "index.html";
}

export function initSelectedLunchItems(employeeLunch: EmployeeLunch): void {

    const lunchItems: HTMLDivElement[] = document.getElementsByClassName('lunch-card') as unknown as HTMLDivElement[];
    const lunchItemsImages = document.getElementsByClassName('lunch-card-img-top') as unknown as HTMLImageElement[];
    const lunchItemsNames = document.getElementsByClassName('lunch-card-text') as unknown as HTMLSpanElement[];

    const lunchMenuItemIds = [currentMenu.mondayItemId, currentMenu.tuesdayItemId, currentMenu.wednesdayItemId, currentMenu.thursdayItemId, currentMenu.fridayItemId];

    let employeeLunchDaysSelected = [employeeLunch.monday, employeeLunch.tuesday, employeeLunch.wednesday, employeeLunch.thursday, employeeLunch.friday];

    for (let i = 0; i < lunchItems.length; i++) {
        const item = menuItems.find(x => x.itemId === lunchMenuItemIds[i]);
        lunchItemsImages[i].src = baseUrl + "items/" + item.itemId + "/image";
        lunchItemsNames[i].textContent = item.name;
        if (employeeLunchDaysSelected[i]) {
            lunchItems[i].classList.add("lunch-active");
        }
    }
}
