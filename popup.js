// popup.html Element
const go = document.getElementById("Go");
const injection = document.getElementById("Injection");

const target = document.getElementById("URL");
const delay = document.getElementById("Delay");
const forceDL = document.getElementById("ForceDL");
const message = document.getElementById("Message");

go.addEventListener("click", handleGoClick);
injection.addEventListener("click", handleInjectionClick);

// SETTING
const DEBUG_MODE = false;
const DEFAULT_DELAY = 200;  // millisecond
delay.value = DEFAULT_DELAY;

if (DEBUG_MODE) {
    log("DEBUG MODE");
    target.value = "https://ja.wikipedia.org/wiki/{{%d(1,5,2,3)}}"
}

// init
log("init");
StatusCheck();

// [Button] 😎/😍
async function handleGoClick() {
    clearMessage();

    if (StatusCheck()) {
        if (target.value) {
            log("[send] 😎");
            log("[send] target: " + target.value);
            log("[send] DL Mode: " + forceDL.checked);
            log("[send] Delay: " + getDelay());

            chrome.runtime.sendMessage({
                type: "😎",
                data: target.value,
                mode: forceDL.checked,
                delay: getDelay()
            });
        }
    }

    else {
        log("[send] 😍");
        chrome.runtime.sendMessage({ type: "😍" });
    }

    StatusCheck();
}

// [Button] 💉
async function handleInjectionClick() {
    clearMessage();

    log("💉");
    target.value = target.value.substr(0, target.selectionStart)
        + "{{%d("
        + target.value.substr(target.selectionStart, target.selectionEnd - target.selectionStart)
        + ")}}"
        + target.value.substr(target.selectionEnd);
}

function StatusCheck() {
    log("StatusRequest");
    chrome.runtime.sendMessage({ type: "StatusRequest" }, function (Status) {
        go.innerHTML = Status;
    });

    if (go.innerHTML == "😎") {
        return true;
    } else if (go.innerHTML == "😍") {
        return false;
    }
}

function getDelay() {
    if (!(delay.value)) {
        return DEFAULT_DELAY;
    }
    else return delay.value;
}

function setMessage(str, color) {
    log("Msg: " + str);
    message.textContent = str;
    message.style.color = color;
    message.hidden = false;
}

function clearMessage() {
    log("Msg Clear");
    message.textContent = "";
    message.hidden = true;
}

chrome.runtime.onMessage.addListener((request) => {
    // [recv] Message
    if (request.type == "Message") {
        setMessage(request.msg, request.color);
    }

    // [recv] Complete
    else if (request.type == "Complete") {
        if (request.rc == 0) {
            clearMessage();
        }
        go.innerHTML = "😎";
    }
});

function log(str) {
    if (DEBUG_MODE) {
        chrome.runtime.sendMessage({ type: "ConsoleLog", data: "[pop] " + str });
    }
}