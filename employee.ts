import {MenuItem} from "./menuItem";

export class Employee {
    employeeId: number;
    name: string;
    token: string;
    employeeCakes:object[]
    items:MenuItem[];

    constructor(employeeId: number, name: string, token: string, employeeCakes: object[], items: MenuItem[]) {
        this.employeeId = employeeId;
        this.name = name;
        this.token = token;
        this.employeeCakes = employeeCakes;
        this.items = items;
    }
}