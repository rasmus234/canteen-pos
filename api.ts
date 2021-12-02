import {MenuItem} from "./menuItem";
import {currentEmployee} from "./index";
import {Employee} from "./employee";


export async function login(id: number, password: string): Promise<string> {
    let response = await fetch("https://canteen-easv.herokuapp.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password: password, id: id})
    });

    if (response.status === 401) {
        return "";
    } else return response.text();
}

export async function loginWithPassword(password: string): Promise<Employee> {
    console.log("logging in with password");
    let response = await fetch("https://canteen-easv.herokuapp.com/rfid", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password: password})
    });

    if (response.status === 401) {
        return null;
    }
    const json = await response.json();
    return new Employee(json.employeeId, json.name, json.token, json.employeeCakes, json.items);
}

export async function getMenuItems(): Promise<MenuItem[]> {
    let items: MenuItem[] = [];
    await fetch("https://canteen-easv.herokuapp.com/api/Items", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
    })
        .then(data => data.json())
        .then(data => data.map((data: MenuItem) =>
            items.push(new MenuItem(data.itemId, data.name, data.price, data.category, data.image))));

    return items;
}

export async function postOrder(menuItems: MenuItem[]) {

    const itemIds = menuItems.map(item => item.itemId);
    let response;
    await fetch("https://canteen-easv.herokuapp.com/api/Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
        body: JSON.stringify({items: itemIds})
    }).then(value => response = value.json());
    return response;
}