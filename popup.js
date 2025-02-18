document.addEventListener("DOMContentLoaded", function() {
  const urlInput = document.getElementById("url");
  const getRequestBtn = document.getElementById("getRequest");
  const statusMessage = document.getElementById("statusMessage");

  const soapActionInput = document.getElementById("soapAction");
  const addSoapActionBtn = document.getElementById("addSoapAction");
  const soapActionList = document.getElementById("soapActionList");
  const soapBodyInput = document.getElementById("soapBody");
  const attackVectorsInput = document.getElementById("attackVectors");
  const postRequestBtn = document.getElementById("postRequest");
  const attackRequestBtn = document.getElementById("attackRequest");
  const responseBox = document.getElementById("response");

  let soapActions = [];

  // GET request with Kerberos credentials and status message display
  getRequestBtn.addEventListener("click", function() {
    fetch(urlInput.value, { credentials: "include" })
      .then(response => {
        console.log(`GET Request to: ${urlInput.value} - Status: ${response.status}`);
        if (response.ok) {
          statusMessage.textContent = "Okay";
          statusMessage.style.color = "green";
        } else {
          statusMessage.textContent = "Error";
          statusMessage.style.color = "red";
        }
      })
      .catch(error => {
        console.error("GET Request Failed:", error);
        statusMessage.textContent = "Error";
        statusMessage.style.color = "red";
      });
  });

  // Add SOAP Action: add a new checkbox (unchecked by default)
  addSoapActionBtn.addEventListener("click", function() {
    const action = soapActionInput.value.trim();
    if (action && !soapActions.includes(action)) {
      soapActions.push(action);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = action;
      // Leave checkbox unchecked so the user can decide
      checkbox.checked = false;
      
      const label = document.createElement("label");
      label.style.marginRight = "10px";
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${action}`));
      
      soapActionList.appendChild(label);
      soapActionList.appendChild(document.createElement("br"));
    }
    soapActionInput.value = "";
  });

  // Send POST request (single request; response replaces previous content)
  postRequestBtn.addEventListener("click", function() {
    sendSoapRequest(soapBodyInput.value, false);
  });

  // Attack: send a POST request for each attack vector, appending responses
  attackRequestBtn.addEventListener("click", function() {
    // Clear previous responses
    responseBox.value = "";
    const attackVectors = attackVectorsInput.value
      .split("\n")
      .map(v => v.trim())
      .filter(Boolean);
    attackVectors.forEach(vector => {
      const modifiedBody = soapBodyInput.value.replace(/@AttackVector/g, vector);
      sendSoapRequest(modifiedBody, true);
    });
  });

  // Function to send SOAP request using selected SOAP actions
  // The 'append' parameter determines whether to replace or append the output.
  function sendSoapRequest(body, append) {
    const selectedActions = [...soapActionList.querySelectorAll("input:checked")].map(cb => cb.value);
    const headers = new Headers({ "Content-Type": "text/xml" });
    selectedActions.forEach(action => {
      headers.append("SOAPAction", action);
    });

    fetch(urlInput.value, {
      method: "POST",
      headers: headers,
      body: body,
      credentials: "include"
    })
      .then(response => response.text())
      .then(data => {
        console.log(`POST Request to: ${urlInput.value} - Response: ${data}`);
        if (append) {
          responseBox.value += data + "\n-----------------\n";
        } else {
          responseBox.value = data;
        }
      })
      .catch(error => {
        console.error("POST Request Failed:", error);
        if (append) {
          responseBox.value += `Error: ${error}\n-----------------\n`;
        } else {
          responseBox.value = `Error: ${error}`;
        }
      });
  }
});
