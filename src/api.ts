
import {currentEmployee} from "./index";
import {Employee, Item} from "./models";

const baseUrl = "https://canteenapi.herokuapp.com/api/"
const baseUrlLocal = "https://localhost:7117/api/"


export async function loginWithPassword(password: string): Promise<Employee> {
    console.log("logging in with password");
    console.log("ye")
    let tokenResponse = await fetch(baseUrl+"login", {
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
    console.log("logged in");

    const employee = await getEmployeeFromToken(token);
    employee.token = token;

    return employee;
}

export async function getEmployeeFromToken(token: string): Promise<Employee> {
    let employee: Employee;
    let employeeResponse = await fetch(baseUrl + "Employees/token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(response => response.json().then(json => employee = json))
        .catch(error => console.log(error));

    return employee;
}

export async function getMenuItems(): Promise<Item[]> {
    console.log("getting menu items");
    let items: Item[] = [];
    await fetch(baseUrl+"items", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
    })
        .then(data => data.json())
        .then(data => data.map((data: Item) =>
            items.push(data)))

    return items;
}

export async function postOrder(menuItems: Item[]) {

    const itemIds = menuItems.map(item => item.itemId);
    let response;
    await fetch(baseUrl+"Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
        body: JSON.stringify({items: itemIds})
    }).then(value => response = value.json());
    return response;
}