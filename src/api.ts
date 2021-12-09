import {currentEmployee, currentMenu} from "./index";
import {Employee, EmployeeLunch, Item, LunchMenu} from "./models";

const baseUrlRemote = "https://canteenapi.herokuapp.com/";
const baseUrlLocal = "https://localhost:7106/";

const baseUrl = baseUrlRemote;


export async function loginWithPassword(password: string): Promise<Employee> {
    console.log("logging in with password");
    console.log("ye");
    let tokenResponse = await fetch(baseUrl + "login", {
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
    let items: Item[] = [];
    await fetch(baseUrl + "items", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
    })
        .then(data => data.json())
        .then(data => items = data);

    return items;
}

export async function postOrder(menuItems: Item[]) {

    const itemIds = menuItems.map(item => item.itemId);
    let response;
    await fetch(baseUrl + "Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
        body: JSON.stringify({items: itemIds})
    }).then(value => response = value.json());
    return response;
}

export async function getCurrentMenu(): Promise<LunchMenu> {

    let response;
    await fetch(baseUrl + "LunchMenus/current", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        }
    }).then(value => response = value.json());
    return response;
}

export async function setEmployeeLunch(employeeLunch: EmployeeLunch): Promise<boolean> {
    let success;
    await fetch(baseUrl + "LunchMenus/employeeLunch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        },
        body: JSON.stringify(employeeLunch)
    }).then(value => success = value.ok);
    return success;
}

export async function getEmployeeLunch(): Promise<EmployeeLunch> {
    let response;
    await fetch(baseUrl + "LunchMenus/employeeLunch/" + currentEmployee.employeeId + "/" + currentMenu.lunchMenuId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        }
    }).then(value => response = value.json());
    return response;
}

export async function addFavouriteItem(itemId: number): Promise<void> {
    await fetch(baseUrl + "employees/" + "favourites" + "?itemId=" + itemId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        }
    }).catch(error => console.log(error));
}

export async function removeFavouriteItem(itemId: number): Promise<void> {
    await fetch(baseUrl + "employees/" + "favourites" + "?itemId=" + itemId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentEmployee.token
        }
    }).catch(error => console.log(error));
}