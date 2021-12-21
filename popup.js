const form     = document.getElementById("Form");
const target   = document.getElementById("URL");
const delay    = document.getElementById("Delay");
const progress = document.getElementById("Progress");
const button   = document.getElementById("Run");

form.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
    event.preventDefault();

    clearMessage();

    let url = stringToUrl(target.value);
    if (!url) {
        setMessage("Invalid URL");
        return;
    }

    chrome.tabs.create({
        url:url.toString(),
        active:false
      });

    setMessage("OK");
}

function stringToUrl(input) {
    // Start with treating the provided value as a URL
    try {
        return new URL(input);
    } catch {}
    // If that fails ¯\_(ツ)_/¯
    return null;
}

function setMessage(str) {
    message.textContent = str;
    message.hidden = false;
}
  
function clearMessage() {
    message.hidden = true;
    message.textContent = "";
}