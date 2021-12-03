import {MenuItem} from "./menuItem";
import {currentEmployee} from "./index";
import {Employee} from "./employee";

const baseUrl = "https://canteenapi.herokuapp.com/api/"
const baseUrlLocal = "https://localhost:7117/api/"

export async function login(id: number, password: string): Promise<string> {
    let response = await fetch(baseUrl + "login", {
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
    let tokenResponse = await fetch(baseUrlLocal+"login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password: password})
    });

    if (tokenResponse.status === 401) {
        return null;
    }
    const token = await tokenResponse.json().then(data => data.token);
    console.log(token);

    let employee;
    let employeeResponse = await fetch(baseUrlLocal + "Employees/token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(response => response.json().then(json => employee = json))
        .catch(error => console.log(error));

    return new Employee(employee.employeeId, employee.firstName + " " + employee.lastName, token, employee.employeeCakes, employee.favouriteItems);
}

export async function getMenuItems(): Promise<MenuItem[]> {
    let items: MenuItem[] = [];
    await fetch(baseUrlLocal+"items", {
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
    await fetch(baseUrlLocal+"Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
        body: JSON.stringify({items: itemIds})
    }).then(value => response = value.json());
    return response;
}