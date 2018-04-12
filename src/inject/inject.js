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

const speechdb = firebase.database().ref(),
    $window = $(window),
    $body = $('body, html');

speechdb.on('value', (snapshot) => {
    let command = snapshot.val();
    console.log(snapshot.val());

    if (command.complete === 0) {
        switch (command.action) {
            case 'scroll':
                makeScroll(command);
                break;
        }
    }
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    // });

});

function makeScroll(command) {
    var px = parseInt(command.pixels),
        currX = $window.scrollLeft(),
        currY = $window.scrollTop(),
        y = 0,
        x = 0;

    switch (command.direction) {
        case 'down':
            y = px;
            break;
        case 'up':
            y = -px;
            break;
        case 'left':
            x = -px;
            break;
        case 'right':
            x = px;
            break;
    }

    speechdb.update({
        complete: 1
    });

    $body.animate({
        scrollTop: currY + y,
        scrollLeft: currX + x
    }, '500');
}