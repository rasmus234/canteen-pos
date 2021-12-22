import {createMenuItem, initSelectedLunchItems, refreshNavBar} from "./DOMFunctions";
import {getCurrentMenu, getEmployeeCakes, getEmployeeLunch, getMenuItems, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee, EmployeeCake, Item, LunchMenu} from "./models";
import {favouritesButton} from "./DOMElements";

export let currentEmployee: Employee;
export let currentMenu: LunchMenu;
export let employeeCakes: EmployeeCake[] = [];
export let menuItems: Item[] = [];


const password = sessionStorage.getItem("password");
init(password);

export async function init(password: string): Promise<void> {

    const employee = await loginWithPassword(password);
    if (employee) {
        currentEmployee = employee;
    } else {
        alert("Unknown user, please try again");
        location.href = "/index.html";
    }
    refreshNavBar();
    await getEmployeeCakes().then(cakes => employeeCakes = cakes);
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




