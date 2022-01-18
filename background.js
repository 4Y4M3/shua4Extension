chrome.runtime.onMessage.addListener((request, sender) => {
	if(request.type == "ConsoleLog"){
		console.log(request.data);
	}
});

function log(str){
	console.log("[bg] " + str);
}