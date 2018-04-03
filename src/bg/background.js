// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
//
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     $.get("https://www.gstatic.com/firebasejs/4.12.1/firebase.js", function(result) {
//         chrome.tabs.executeScript(tabs[0].id, {code: result});
//         config = {
//             apiKey: "AIzaSyCN2On1hWv0Qqa9TX-KnIYZQ_9LE7YHxqo",
//             authDomain: "speech2browser.firebaseapp.com",
//             databaseURL: "https://speech2browser.firebaseio.com",
//             projectId: "speech2browser",
//             storageBucket: "speech2browser.appspot.com",
//             messagingSenderId: "666598580580"
//         };
//
//         firebase.initializeApp(config);
//
//         console.log(firebase);
//         speechdb = firebase.database().ref();
//     }, "text");
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
