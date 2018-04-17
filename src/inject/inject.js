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

var speechdb = firebase.database().ref();
// var provider = new firebase.auth.GoogleAuthProvider();
// console.log(provider);
// firebase.auth().signInWithPopup(provider).then(function(result) {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     var token = result.credential.accessToken;
//     // The signed-in user info.
//     var user = result.user.userId;
//     console.log(result.user);
//     speechdb = firebase.database().ref(user);
//
//
// }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//
//     console.log(errorCode, errorMessage, email, credential);
//     // ...
// });

// firebase.auth().signInWithRedirect(provider);
// firebase.auth().getRedirectResult().then(function(result) {
//     if (result.credential) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         var token = result.credential.accessToken;
//         // ...
//     }
//     // The signed-in user info.
//     var user = result.user;
//
//     console.log(result.user);
//     speechdb = firebase.database().ref(user);
// }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//
//     console.log(errorCode, errorMessage, email, credential);
//     // ...
// });

const $window = $(window),
    $body = $('body, html');

speechdb.on('value', (snapshot) => {
    let command = snapshot.val();
    console.log(snapshot.val());

    if (command.complete === 0) {
        switch (command.action) {
            case 'scroll':
                makeScroll(command);
                break;
            case 'highlight':
                highlight(command);
                break;
            case 'select':
                select(command);
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

function highlight (command) {
    var focusElem = '';

    switch (command.focusable) {
        case 'all':
            focusElem = 'input, textarea, button, a, select, option, checkbox, radio';
            break;
    }

    console.log($(focusElem));

    speechdb.update({
        complete: 1
    });

    $(focusElem).each(function(i) {
        $(this).append('<div class="s2b-anchor" data-index="'+i+'">'+i+'</div>')
    });
}

function select (command) {
    var number = command.num,
        el;

    if (number) {
        el = $('.s2b-anchor[data-index="' + number + '"]').parent();
        el.addClass('s2b-select');
    }
    else {

    }

    $('.s2b-anchor').remove();
}