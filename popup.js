document.addEventListener("DOMContentLoaded", function() {
    const urlInput = document.getElementById("url");
    const getRequestBtn = document.getElementById("getRequest");
    const soapActionInput = document.getElementById("soapAction");
    const addSoapActionBtn = document.getElementById("addSoapAction");
    const soapActionList = document.getElementById("soapActionList");
    const soapBodyInput = document.getElementById("soapBody");
    const attackVectorsInput = document.getElementById("attackVectors");
    const postRequestBtn = document.getElementById("postRequest");
    const attackRequestBtn = document.getElementById("attackRequest");
    const responseBox = document.getElementById("response");

    let soapActions = [];

    getRequestBtn.addEventListener("click", function() {
        fetch(urlInput.value)
            .then(response => {
                console.log(`GET Request to: ${urlInput.value} - Status: ${response.status}`);
                return response.ok ? alert("Okay") : alert("Error");
            })
            .catch(error => {
                console.error("GET Request Failed:", error);
                alert("Error");
            });
    });

    addSoapActionBtn.addEventListener("click", function() {
        const action = soapActionInput.value.trim();
        if (action && !soapActions.includes(action)) {
            soapActions.push(action);
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = action;
            const label = document.createElement("label");
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${action}`));
            soapActionList.appendChild(label);
        }
        soapActionInput.value = "";
    });

    postRequestBtn.addEventListener("click", function() {
        sendSoapRequest(soapBodyInput.value);
    });

    attackRequestBtn.addEventListener("click", function() {
        const attackVectors = attackVectorsInput.value.split("\n").map(v => v.trim()).filter(Boolean);
        attackVectors.forEach(vector => {
            const modifiedBody = soapBodyInput.value.replace(/@AttackVector/g, vector);
            sendSoapRequest(modifiedBody);
        });
    });

    function sendSoapRequest(body) {
        const selectedActions = [...soapActionList.querySelectorAll("input:checked")].map(cb => cb.value);
        const headers = new Headers({ "Content-Type": "text/xml" });

        selectedActions.forEach(action => {
            headers.append("SOAPAction", action);
        });

        fetch(urlInput.value, {
            method: "POST",
            headers: headers,
            body: body
        })
        .then(response => response.text())
        .then(data => {
            console.log(`POST Request to: ${urlInput.value} - Status: 200`);
            responseBox.value = data;
        })
        .catch(error => {
            console.error("POST Request Failed:", error);
            responseBox.value = `Error: ${error}`;
        });
    }
});
