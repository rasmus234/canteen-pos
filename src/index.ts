import {MenuItem} from "./menuItem";
import {createMenuItem, filterButtonsByCategory, getTotalItems, getTotalPrice, refreshNavBar} from "./DOMFunctions";
import {getMenuItems, loginWithPassword} from "./api";
import "bootstrap";
import "./css/custom.sass";
import "./css/styles.css";
import {Employee} from "./models";

export let currentEmployee: Employee

let menuItems: MenuItem[] = [];

let password = prompt("Enter password");

await loginWithPassword(password).then(employee => {

    if(employee){
        currentEmployee = employee;
        console.log("current employee",employee);
        initMenuItems().then(() => {
            refreshNavBar();
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




