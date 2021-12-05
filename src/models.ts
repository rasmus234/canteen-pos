

export interface Category {
    categoryId?: number;
    name?: string | undefined;
}

export interface Employee {
    employeeId?: number;
    firstName?: string | undefined;
    lastName?: string | undefined;
    password?: string | undefined;
    employeeCakes?: EmployeeCake[] | undefined;
    employeeLunches?: EmployeeLunch[] | undefined;
    orders?: Order[] | undefined;
    items?: Item[] | undefined;
}

export interface EmployeeCake {
    employeeId?: number;
    itemId?: number;
    number?: number;
    year?: number;
    limit?: number;
    employee?: Employee;
    item?: Item;
    week?: Week;
}

export interface EmployeeLunch {
    employeeId?: number;
    lunchMenuId?: number;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    employee?: Employee;
    lunchMenu?: LunchMenu;
}

export interface Item {
    itemId?: number;
    categoryId?: number;
    name?: string | undefined;
    price?: number;
    image?: string | undefined;
    category?: Category;
}

export interface LunchCancellation {
    lunchCancellationId?: number;
    lunchMenuId?: number;
    message?: string | undefined;
    lunchMenu?: LunchMenu;
}

export interface LunchMenu {
    lunchMenuId?: number;
    number?: number;
    year?: number;
    mondayItemId?: number | undefined;
    tuesdayItemId?: number | undefined;
    wednesdayItemId?: number | undefined;
    thursdayItemId?: number | undefined;
    fridayItemId?: number | undefined;
    fridayItem?: Item;
    mondayItem?: Item;
    thursdayItem?: Item;
    tuesdayItem?: Item;
    wednesdayItem?: Item;
    week?: Week;
    employeeLunches?: EmployeeLunch[] | undefined;
    lunchCancellations?: LunchCancellation[] | undefined;
}

export interface Order {
    orderId?: number;
    employeeId?: number;
    number?: number;
    year?: number;
    orderItems?: OrderItem[] | undefined;
}

export interface OrderItem {
    orderId?: number;
    itemId?: number;
    quantity?: number;
}

export interface Week {
    number?: number;
    year?: number;
    finalized?: boolean;
    employeeCakes?: EmployeeCake[] | undefined;
    lunchMenus?: LunchMenu[] | undefined;
    orders?: Order[] | undefined;
}