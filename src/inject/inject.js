// Initialize Firebase
var config = {
    apiKey: "AIzaSyCN2On1hWv0Qqa9TX-KnIYZQ_9LE7YHxqo",
    authDomain: "speech2browser.firebaseapp.com",
    databaseURL: "https://speech2browser.firebaseio.com",
    projectId: "speech2browser",
    storageBucket: "speech2browser.appspot.com",
    messagingSenderId: "666598580580"
};

firebase.initializeApp(config);

console.log(firebase);
var speechdb = firebase.database().ref();

speechdb.on('value', (snapshot) => {
    console.log(snapshot.val());
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    // });
});

$('body').on('click', function(){
    // console.log($().jquery);
    // // $(window).scrollTop(200);
    //
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    // });
});