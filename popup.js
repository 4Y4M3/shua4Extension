import ExpressionParser from "./expression_parser.js";

const DEFAULT_DELAY = 200;  // millisecond
const DEBUG = false;

const go = document.getElementById("Go");
const injection = document.getElementById("Injection");

const delay = document.getElementById("Delay");
const target = document.getElementById("URL");
const message = document.getElementById("Message");

go.addEventListener("click", handleGoClick);
injection.addEventListener("click", handleInjectionClick);

delay.value = DEFAULT_DELAY;

if (DEBUG) setMessage("init");
if (DEBUG) target.value = "https://ja.wikipedia.org/wiki/{{%d(1,5,2,3)}}"

//😎
async function handleGoClick() {
    clearMessage();
    if (DEBUG) setMessage("Start.");
    go.innerHTML = "😍";

    var urls = [];

    const expressionParser = new ExpressionParser(target.value);
    urls.push(
        ...expressionParser.getUrls().map((url) => { return url; })
    );

    for (var url of urls) {
        setMessage(url);
        openUrl(url);
        await sleep(getDelay());
    }

    if (DEBUG) setMessage("End.");
    go.innerHTML = "😎";
}

//💉
async function handleInjectionClick() {
    clearMessage();
    target.value = target.value.substr(0, target.selectionStart)
        + "{{%d("
        + target.value.substr(target.selectionStart, target.selectionEnd - target.selectionStart)
        + ")}}"
        + target.value.substr(target.selectionEnd);
}

function openUrl(input) {
    chrome.tabs.create({
        url: input,
        active: false,
    });
}

function getDelay() {
    if (!(delay.value)) {
        return DEFAULT_DELAY;
    }
    else return delay.value;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setMessage(str) {
    message.textContent = str;
    message.hidden = false;
}

function clearMessage() {
    message.textContent = "";
    message.hidden = true;
}