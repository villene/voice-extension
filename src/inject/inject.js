console.log(chrome);

console.log(123);
$('body').on('click', function(){
	console.log($().jquery);
	// $(window).scrollTop(200);

    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response.farewell);
    });
});