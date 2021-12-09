import {favouritesButton, shoppingCart} from "./DOMElements";
import {Item, OrderItem,Employee, EmployeeLunch} from "./models";
import {currentEmployee, currentMenu, menuItems} from "./index";
import * as $ from "jquery";
import {addFavouriteItem, removeFavouriteItem} from "./api";

const blobPrefix = "data:image/png;base64,"


export function createMenuItem(menuItem: Item) {

    let favouriteIcon: HTMLImageElement = document.createElement("img");
    let buttonElement: HTMLButtonElement = document.createElement("button");
    let spanElement: HTMLSpanElement = document.createElement("span");
    let imageElement: HTMLImageElement = document.createElement("img");

    favouriteIcon.addEventListener("click", () => {
        event.stopPropagation();
        const isFavourite = favouriteIcon.classList.contains("favourite");
        if (isFavourite) {
            favouriteIcon.classList.replace("favourite", "not-favourite");
            removeFavouriteItem(menuItem.itemId);
        } else {
            favouriteIcon.classList.replace("not-favourite", "favourite");
            addFavouriteItem(menuItem.itemId);
        }
    });
    //Setup image
    imageElement.src = blobPrefix + menuItem.image;

    //Setup span text
    spanElement.textContent = menuItem.name;

    //Setup button
    buttonElement.className = "btn btn-primary btn-lg menu-item";
    buttonElement.type = "button";
    buttonElement.setAttribute("data-category", menuItem.category.name);
    buttonElement.setAttribute("data-price", String(menuItem.price));
    buttonElement.setAttribute("data-item-id", String(menuItem.itemId));

    const favouriteItemIds = (currentEmployee as Employee).items
    if (favouriteItemIds.includes(menuItem.itemId)) {
        buttonElement.setAttribute("data-favourite", "true")
        favouriteIcon.className = "favourite";
    } else {
        buttonElement.setAttribute("data-favourite", "false")
        favouriteIcon.className = "not-favourite";
    }


    buttonElement.addEventListener("click", (ev) => {
        createShoppingCartItem(buttonElement);
        itemChosenEffect(buttonElement, buttonElement.offsetLeft, buttonElement.offsetTop);
        updateCounter();
    })

    const menuItems = document.getElementById('menu-items-div') as HTMLDivElement;
    buttonElement.append(favouriteIcon);
    buttonElement.append(imageElement);
    buttonElement.append(spanElement);

    menuItems.append(buttonElement);

    return buttonElement;
}

function updateCounter() {
    //Nothing here :)
}

$(".lunch-card").click(function () {
    $(this).toggleClass('lunch-active');
});



function itemChosenEffect(element: HTMLElement, x,y) {
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
        if (i < 3){return;}
        elemClone.remove();
        
        
        $( "#shopping-cart" ).toggle(150, function() {
            // Animation complete.
          });
        
        
    });
    
}

export function filterButtonsByCategory(category: string) {
    let buttons:HTMLButtonElement[] = document.getElementsByClassName('menu-item') as unknown as HTMLButtonElement[];
    

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("data-category").toLowerCase() == category.toLowerCase()) {
            buttons[i].style.display = "block";
        } else {
            buttons[i].style.display = "none";
        }
    }
    if (category === "favourite"){
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("data-favourite") === "true") {
                buttons[i].style.display = "block";
            }
        }
        return;
    }
    
}

function createShoppingCartItem(buttonElement: HTMLButtonElement) {
    let itemClone = buttonElement.cloneNode() as HTMLButtonElement;
    let imageClone = buttonElement.children[0].cloneNode() as HTMLImageElement;
    let spanClone = buttonElement.children[1].cloneNode() as HTMLSpanElement;
    itemClone.className = "btn btn-primary shopping-cart-item"

    shoppingCart?.append(itemClone)
    itemClone.append(imageClone)
    itemClone.append(spanClone)

    itemClone.addEventListener("click", (ev) => {
        itemClone.remove()
        refreshNavBar()
    })
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
            name: shoppingCartItems[i].children[1].textContent,
            price: parseFloat(shoppingCartItems[i].getAttribute("data-price")),
            category: {
                name: shoppingCartItems[i].getAttribute("data-category")
            },
            image: (shoppingCartItems[i].children[0] as HTMLImageElement).src.replace(blobPrefix, "")
        }
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

    console.log(lunchItems);
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

export function initSelectedLunchItems(employeeLunch: EmployeeLunch): void {

    const lunchItems: HTMLDivElement[] = document.getElementsByClassName('lunch-card') as unknown as HTMLDivElement[];
    const lunchItemsImages = document.getElementsByClassName('lunch-card-img-top') as unknown as HTMLImageElement[];
    const lunchItemsNames = document.getElementsByClassName('lunch-card-text') as unknown as HTMLSpanElement[];

    const lunchMenuItemIds = [currentMenu.mondayItemId, currentMenu.tuesdayItemId, currentMenu.wednesdayItemId, currentMenu.thursdayItemId, currentMenu.fridayItemId];
    const employeeLunchDaysSelected = [employeeLunch.monday, employeeLunch.tuesday, employeeLunch.wednesday, employeeLunch.thursday, employeeLunch.friday];

    console.log(menuItems);
    for (let i = 0; i < lunchItems.length; i++) {
        const item = menuItems.find(x => x.itemId === lunchMenuItemIds[i]);
        console.log(item);
        lunchItemsImages[i].src = blobPrefix + item.image;
        lunchItemsNames[i].textContent = item.name;
        if (employeeLunchDaysSelected[i]) {
            lunchItems[i].classList.add("lunch-active");
        }
    }


}
