const DEFAULT_DELAY = 200;  // millisecond
const DEBUG = false;

const go = document.getElementById("Go");
const injection = document.getElementById("Injection");

const target = document.getElementById("URL");
const delay = document.getElementById("Delay");
const forceDL = document.getElementById("ForceDL");
const message = document.getElementById("Message");

go.addEventListener("click", handleGoClick);
injection.addEventListener("click", handleInjectionClick);

delay.value = DEFAULT_DELAY;

if (DEBUG) target.value = "https://ja.wikipedia.org/wiki/{{%d(1,5,2,3)}}"

init();

//initialize
function init (){
    log("init");
    chrome.runtime.sendMessage({type: "init"}, function(isRunning){
        if(isRunning){
            go.innerHTML = "😍";
        }
        else{
            go.innerHTML = "😎";
        }
    });
}

//😎
async function handleGoClick() {
    clearMessage();
    log("😎");
    chrome.runtime.sendMessage({
        type: "😎",
        data: target.value,
        mode: forceDL.checked,
        delay: getDelay()
    });
}

//💉
async function handleInjectionClick() {
    clearMessage();
    log("💉");    
    target.value = target.value.substr(0, target.selectionStart)
        + "{{%d("
        + target.value.substr(target.selectionStart, target.selectionEnd - target.selectionStart)
        + ")}}"
        + target.value.substr(target.selectionEnd);
}

function getDelay() {
    if (!(delay.value)) {
        return DEFAULT_DELAY;
    }
    else return delay.value;
}

function setMessage(str, color) {
    log("msg: "+str);
    message.textContent = str;
    message.style.color = color;
    message.hidden = false;
}

function clearMessage() {
    log("msg clear");
    message.textContent = "";
    message.hidden = true;
}

chrome.runtime.onMessage.addListener((request) => {
    if(request.type == "Message"){
        setMessage(request.data, request.color);
    }
});

function log(str){
    chrome.runtime.sendMessage({type: "ConsoleLog", data:"[pop] " + str});
}