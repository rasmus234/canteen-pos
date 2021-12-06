
import {createMenuItem, filterButtonsByCategory, getTotalItems, getTotalPrice, refreshNavBar} from "./DOMFunctions";
import {getCurrentMenu, getMenuItems, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee, Item, LunchMenu} from "./models";

export let currentEmployee: Employee
export let currentMenu: LunchMenu

let menuItems: Item[] = [];
let password = prompt("Enter password");

loginWithPassword(password).then(employee => {

    if(employee){
        currentEmployee = employee;
        console.log("current employee",employee);
        initMenuItems().then(() => {
            refreshNavBar();
        });
        getCurrentMenu().then(menu => {
            console.log(menu)
        });
    }
    else {
        alert("Wrong password");
        document.location.reload();
    }
});

async function initMenuItems(): Promise<void> {
    getMenuItems().then(data => {
        menuItems = data;
        data.forEach(menuItem => {
            createMenuItem(menuItem);
        });
    });
}




