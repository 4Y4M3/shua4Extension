import ExpressionParser from "./expression_parser.js";

// SETTING
const DEMO_MODE = false;

var STATUS = "😎"; // 😍(run) OR 😎(idle) 
var ABORT_FLAG = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case "ConsoleLog":
            console.log(request.data);
            break;

        case "StatusRequest":
            sendResponse(STATUS);
            break;

        case "😎":
            log("😎");
            shua(request.data, request.mode, request.delay);
            break;

        case "😍":
            log("😍");
            ABORT_FLAG = true;
            break;

        default:
            console.error("undefine request.type");
            break;
    }
});

async function shua(target, mode, delay) {
    try {
        STATUS = "😍";
        ABORT_FLAG = false;
        var urls = [];

        log("Target: " + target);

        const expressionParser = new ExpressionParser(target);
        urls.push(
            ...expressionParser.getUrls().map((url) => { return url; })
        );

        if (urls.length == 0) {
            log("Start");
            openUrl(target, mode);
        }
        else {
            log("Start: " + urls.length);
            for (var url of urls) {
                if (ABORT_FLAG) {
                    log("Abort");
                    break;
                }
                openUrl(url, mode);
                await sleep(delay);
            }
        }

        log("End");
        chrome.runtime.sendMessage({ type: "Complete", rc: 0 });

    } catch (error) {
        console.error(error.message);
        setMessage(error.message, "red");
        chrome.runtime.sendMessage({ type: "Complete", rc: 1 });

    } finally {
        ABORT_FLAG = false;
        STATUS = "😎";
    }
}

function openUrl(input, isDL) {
    log(input);
    setMessage(input);

    if (DEMO_MODE) { return; }

    if (isDL) {
        chrome.downloads.download({
            url: input
        });
    }
    else {
        chrome.tabs.create({
            url: input,
            active: false,
        });
    }
}

function setMessage(str, color = "black") {
    chrome.runtime.sendMessage({ type: "Message", msg: str, color: color });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(str) {
    console.log(str);
}