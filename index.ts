import {MenuItem} from "./menuItem";
import {createMenuItem, filterButtonsByCategory, getTotalItems, getTotalPrice, refreshNavBar} from "./DOMFunctions";
import {getMenuItems, login, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee} from "./employee";

export let currentEmployee: Employee
let menuItems: MenuItem[] = [];

let password = prompt("Enter password");


loginWithPassword(password).then(employee => {

    if(employee){
        currentEmployee = employee;
        console.log(employee);
        initMenuItems();
        refreshNavBar();
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




