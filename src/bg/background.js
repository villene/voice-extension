// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = "http://stackoverflow.com/";
    chrome.tabs.create({ url: newURL });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello") {
            var newURL = "http://stackoverflow.com/";
            chrome.tabs.create({url: newURL});
        }
});
