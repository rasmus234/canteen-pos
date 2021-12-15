import { loginWithPassword } from "./api";

// @ts-ignore
import onScan from "onscan.js";

export {}

 onScan.attachTo(document)

 // @ts-ignore
 document.addEventListener('scan', (sScancode, iQuantity) =>{
     
     let pass = sScancode.detail.scanCode as string;
     
     pass = pass.trim()
     
     
     console.log(pass);

     
     sessionStorage.setItem("password", pass);
     location.href = "/canteen.html";
 });

/*
const password = prompt("Enter password");


*/
