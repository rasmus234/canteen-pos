import {shoppingCart} from "./DOMElements";
import {Item, OrderItem,Employee} from "./models";
import {currentEmployee} from "./index";
import * as $ from "jquery";
const blobPrefix = "data:image/png;base64,"


export function createMenuItem(menuItem: Item) {
    let buttonElement: HTMLButtonElement = document.createElement("button");
    let spanElement: HTMLSpanElement = document.createElement("span");
    let imageElement: HTMLImageElement = document.createElement("img");

    imageElement.src = blobPrefix + menuItem.image;
    spanElement.textContent = menuItem.name;

    if (menuItem.category.name.toLowerCase() === "lunches") {
        buttonElement.className = "btn btn-primary btn-lg lunch-item";
    } else {
        buttonElement.className = "btn btn-primary btn-lg menu-item";
    }
    
    buttonElement.type = "button";

    buttonElement.setAttribute("data-category", menuItem.category.name);
    buttonElement.setAttribute("data-price", String(menuItem.price));
    buttonElement.setAttribute("data-item-id", String(menuItem.itemId));

    const favouriteItemIds = (currentEmployee as Employee).items
    if (favouriteItemIds.includes(menuItem.itemId)) {
        buttonElement.setAttribute("data-favourite","true")
    }
    else {
        buttonElement.setAttribute("data-favourite","false")
    }


    buttonElement.addEventListener("click", (ev) => {
        createShoppingCartItem(buttonElement);
        itemChosenEffect(buttonElement, buttonElement.offsetLeft, buttonElement.offsetTop);
        updateCounter();
    })

    const menuItems = document.getElementById('menu-items-div') as HTMLDivElement;
    buttonElement.append(imageElement);
    buttonElement.append(spanElement);
    
    menuItems.append(buttonElement);
   
    return buttonElement;
}
function updateCounter(){
    //Nothing here :)
}

function itemChosenEffect(element: HTMLElement, x,y) {
    //Make a copy of the element
    let elemClone = element.cloneNode(false) as HTMLElement;
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
    let test:HTMLButtonElement[] = document.getElementsByClassName('lunch-item') as unknown as HTMLButtonElement[];

    buttons = [...buttons, ...test];

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

