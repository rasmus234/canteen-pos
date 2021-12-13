import { loginWithPassword } from "./api";


export {}
const password = prompt("Enter password");


sessionStorage.setItem("password", password);
location.href = "/canteen.html";