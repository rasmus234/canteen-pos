import {
    createMenuItem,
    filterButtonsByCategory,
    getTotalItems,
    getTotalPrice,
    initSelectedLunchItems,
    refreshNavBar
} from "./DOMFunctions";
import {getCurrentMenu, getEmployeeLunch, getMenuItems, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee, Item, LunchMenu} from "./models";
import {favouritesButton} from "./DOMElements";

export let currentEmployee: Employee;
export let currentMenu: LunchMenu;

export let menuItems: Item[] = [];
let password = prompt("Enter password");


init(password);


async function init(password: string): Promise<void> {
    const employee = await loginWithPassword(password);
    if (employee) {
        currentEmployee = employee;
    } else {
        alert("Wrong password");
        document.location.reload();
    }
    refreshNavBar();
    await initMenuItems();
    
    refreshNavBar();
    const currentMenuCall = await getCurrentMenu();
    currentMenu = currentMenuCall;

    const currentEmployeeLunch = await getEmployeeLunch();
    initSelectedLunchItems(currentEmployeeLunch);
    
    refreshNavBar()
    favouritesButton.click();
}

async function initMenuItems(): Promise<void> {
    await getMenuItems().then(data => {
        menuItems = data;
        data.forEach(menuItem => {
            createMenuItem(menuItem);
        });
    });
}




