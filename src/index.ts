import { loginWithPassword } from "./api";

// @ts-ignore
import onScan from "onscan.js";

export {}

 onScan.attachTo(document,
     {
         onScan: (data) => {
             console.log(data);
         }
     }
 );

 // @ts-ignore
 document.addEventListener('scan', (sScancode, iQuantity) =>{
     
     let pass = sScancode.detail.scanCode as string;
     pass = pass.trim()
     console.log(pass);
     
     sessionStorage.setItem("password", pass);
     location.href = "/canteen.html";
 });
 

 function simulateScan() {
     onScan.simulate(document,"00017721093580");
 }
 
 simulateScan()

/*
const password = prompt("Enter password");


*/
