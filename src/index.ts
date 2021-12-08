
import {createMenuItem, filterButtonsByCategory, getTotalItems, getTotalPrice, initSelectedLunchItems, refreshNavBar} from "./DOMFunctions";
import {getCurrentMenu, getEmployeeLunch, getMenuItems, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee, Item, LunchMenu} from "./models";

export let currentEmployee: Employee
export let currentMenu: LunchMenu

let menuItems: Item[] = [];
let password = prompt("Enter password");


init(password);



async function init(password:string) :Promise<void>{
    const employee = await loginWithPassword(password);
    if (employee){
        currentEmployee = employee;
    }
    else {
        alert("Wrong password");
        document.location.reload();
    }
    await initMenuItems();
    const currentMenuCall = await getCurrentMenu();
    currentMenu = currentMenuCall;

    const currentEmployeeLunch = await getEmployeeLunch()
    initSelectedLunchItems(currentEmployeeLunch);

    refreshNavBar();
}

async function initMenuItems(): Promise<void> {
    getMenuItems().then(data => {
        console.log(data);
        menuItems = data;
        data.forEach(menuItem => {
            createMenuItem(menuItem);
        });
    });
}




