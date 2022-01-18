import ExpressionParser from "./expression_parser.js";

var isRunning = false;

// メッセージ駆動
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case "ConsoleLog":
			console.log(request.data);
			break;
		
		case "init":
			log("init");
			sendResponse(isRunning);
			break;

		case "😎":
			log("😎");
			shua(request.data, request.mode, request.delay);
			break;
	
		default:
			break;
	}
});

async function shua(target, mode, delay){
	try {
		isRunning = true;
        var urls = [];

        const expressionParser = new ExpressionParser(target);
        urls.push(
            ...expressionParser.getUrls().map((url) => { return url; })
        );

		log("Start: " + urls.length + " url");

        if (urls.length == 0) {
            openUrl(target, mode);
        }
        else {
            for (var url of urls) {
                openUrl(url, mode);
                await sleep(delay);
            }
        }

        log("Success.");

    } catch (error) {
        setMessage(error.message, "red");
    } finally {
		isRunning = false;
	}
}

function openUrl(input, isDLMode) {
    setMessage(input);
    if (isDLMode) {
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

function setMessage(str, color = "black"){
	chrome.runtime.sendMessage({type: "Message", data:str, color:color});
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(str){
	console.log("[bg] " + str);
}