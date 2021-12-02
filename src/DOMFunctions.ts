import {shoppingCart} from "./DOMElements";
import {MenuItem} from "./menuItem";
import {currentEmployee} from "./index";

const blobPrefix = "data:image/png;base64,"


export function createMenuItem(menuItem: MenuItem) {
    let buttonElement: HTMLButtonElement = document.createElement("button");
    let spanElement: HTMLSpanElement = document.createElement("span");
    let imageElement: HTMLImageElement = document.createElement("img");

    imageElement.src = blobPrefix + menuItem.image;
    spanElement.textContent = menuItem.name;

    buttonElement.className = "btn btn-primary btn-lg menu-item";
    buttonElement.type = "button";
    

    buttonElement.setAttribute("data-category", menuItem.category);
    buttonElement.setAttribute("data-price", String(menuItem.price));
    buttonElement.setAttribute("data-item-id", String(menuItem.itemId));
    if (currentEmployee.items.map(value => value.itemId).includes(menuItem.itemId)) {
        buttonElement.setAttribute("data-favourite","true")
    }
    else {
        buttonElement.setAttribute("data-favourite","false")
    }


    buttonElement.addEventListener("click", (ev) => {
        createShoppingCartItem(buttonElement);
        move(buttonElement);
    })

    const menuItems = document.getElementById('menu-items-div') as HTMLDivElement;
    buttonElement.append(imageElement);
    buttonElement.append(spanElement);
    menuItems.append(buttonElement);
    return buttonElement;
}

function move(element: HTMLElement) {
    var id = null;
    var elem = element.cloneNode(true) as HTMLElement;
    element.append(elem);
    var pos = 0;
    clearInterval(id);
    id = setInterval(frame, 1);
    function frame() {
        if (pos == 400) {
            elem.remove()
        } else {
            pos = pos + 10;
            elem.style.bottom = pos + 'px';
            elem.style.left = pos*4 + 'px';
            
        }
    }
}

export function filterButtonsByCategory(category: string) {
    const buttons = document.getElementsByClassName('menu-item') as unknown as HTMLButtonElement[];

    if (category === "data-favourite"){
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("data-favourite") === "true") {
                buttons[i].style.display = "block";
            }
            else {
                buttons[i].style.display = "none";
            }
        }
        return;
    }


    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("data-category").toLowerCase() == category.toLowerCase()) {
            buttons[i].style.display = "inline";
        } else {
            buttons[i].style.display = "none";
        }
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


export function getShoppingCartItems(): MenuItem[] {
    let items: MenuItem[] = [];
    const shoppingCartItems = document.getElementsByClassName('shopping-cart-item') as unknown as HTMLButtonElement[];
    for (let i = 0; i < shoppingCartItems.length; i++) {
        let item: MenuItem = {
            itemId: parseInt(shoppingCartItems[i].getAttribute("data-item-id")),
            name: shoppingCartItems[i].children[1].textContent,
            price: parseFloat(shoppingCartItems[i].getAttribute("data-price")),
            category: shoppingCartItems[i].getAttribute("data-category"),
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

    employeeName.textContent = "Logged in as: " + currentEmployee.name
    totalPrice.textContent = "Total price: " + getTotalPrice();
    itemCount.textContent = "Items: " + getTotalItems();

}

