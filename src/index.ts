import onScan from "onscan.js";


onScan.attachTo(document,
    {
        onScan: (data) => {
            let pass = data
            pass = pass.trim();
            sessionStorage.setItem("password", pass);
            location.href = "/canteen.html";
        }
    }
);

simulateScan();

function simulateScan() {
    onScan.simulate(document, "00017721093580");
}
