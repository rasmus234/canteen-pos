import { loginWithPassword } from "./api";

// @ts-ignore
import onScan from "onscan.js";

export {}

// onScan.attachTo(document)
//
// // @ts-ignore
// document.addEventListener('scan', (sScancode, iQuantity) =>{
//     alert(iQuantity + 'x ' + sScancode);
// });

const password = prompt("Enter password");
sessionStorage.setItem("password", password);
location.href = "/canteen.html";


