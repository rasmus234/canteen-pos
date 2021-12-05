import {Item} from "./menuItem";

export class Employee {
    employeeId: number;
    name: string;
    token: string;
    employeeCakes:object[]
    items:Item[];

    constructor(employeeId: number, name: string, token: string, employeeCakes: object[], items: Item[]) {
        this.employeeId = employeeId;
        this.name = name;
        this.token = token;
        this.employeeCakes = employeeCakes;
        this.items = items;
    }
}