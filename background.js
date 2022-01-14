chrome.runtime.onMessage.addListener((request, sender) => {
	if(request.type == 'DummyClick'){
		console.log(request.data);
		return true;
	}
});