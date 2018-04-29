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
    $body = $('body, html'),
    $bodyOnly = $('body'),
    selectClass = 's2b-select',
    highlightClass = 's2b-anchor',
    synth = window.speechSynthesis;

let isHighlighted = false;

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
                select(command, false);
                break;
            case 'activate':
                activate(command);
                break;
            case 'write':
                write(command);
                break;
            case 'read':
                read(command);
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
        defX = $window.innerWidth()/3,
        defY = $window.innerHeight()/3,
        y = 0,
        x = 0;

    // <0 for page up/page down
    if (px < 0) {
        px = $window.innerHeight();
    }

    switch (command.direction) {
        case 'down':
            y = px || defY;
            break;
        case 'up':
            y = -px || -defY;
            break;
        case 'left':
            x = -px || defX;
            break;
        case 'right':
            x = px || -defX;
            break;
        case 'home':
            y = -currY;
            break;
        case 'end':
            y = $('body').height();
            break;
    }

    complete(1);

    $body.animate({
        scrollTop: currY + y,
        scrollLeft: currX + x
    }, '500');
}

function highlight (command) {
    var focusElem = '',
        custom = false;

    switch (command.focusable) {
        case 'all':
            focusElem = 'input, textarea, button, a, select, option, checkbox, radio';
            break;
        case 'links':
            focusElem = 'a';
            break;
        case 'input':
            focusElem = 'input, textarea';
            break;
        case 'button':
            focusElem = 'button';
            break;
        case 'select':
            focusElem = 'select';
            break;
        case 'option':
            focusElem = 'option';
            break;
        case 'checkbox':
            focusElem = 'checkbox';
            break;
        case 'radio':
            focusElem = 'radio';
            break;
        case 'paragraph':
            focusElem = 'p';
            break;
        case 'heading':
            focusElem = 'h1, h2, h3, h4, h5, h6';
            break;
        case 'text':
            focusElem = 'h1, h2, h3, h4, h5, h6, p';
            break;
        default:
            focusElem = command.focusable;
            custom = true;
            break;
    }

    if (custom) {
        focusElem = $(focusElem + ', *[data-s2b="' + focusElem + '"], .' + focusElem + ' [name="' + focusElem + '"]').filter(':visible');
    }
    else {
        focusElem = $(focusElem).filter(':visible');
    }

    if (focusElem.length === 1) {
        focusElem.addClass(selectClass);
    }
    else {
        focusElem.each(function(i) {
            var offset = $(this).offset();
            i++;
            $(this).attr('data-s2b-index', i);

            $bodyOnly.append('<div class="'
                + highlightClass
                + '" style="top:' + offset.top + 'px; left:' + offset.left + 'px">'
                + i
                +'</div>')
        });
    }

    complete(1);

    isHighlighted = true;
}

function select (command, activateAfter) {
    var number = command.num,
        el;

    $('.' + selectClass + '').removeClass(selectClass);

    if (number) {
        el = $('[data-s2b-index="' + number + '"]');
        el.addClass(selectClass);
    }

    $('.' + highlightClass).remove();

    if (!activateAfter) {
        complete(1);
    }
}

function activate (command) {
    var number = command.num;

    if (!isHighlighted && !number) {
        app.ask('Please select an element first');
        return;
    }

    if (number) {
        select(command, true);
        $('.' + selectClass)[0].click();
    }
    else {
        // Native JS click used because jQuery trigger is not working
        $('.' + selectClass)[0].click();
    }

    complete(1);
}

function write (command) {
    var text = command.text,
        currText = "",
        activeEl = $('input[type="text"].' + selectClass + ', textarea.' + selectClass + ', :focus');

    if (!activeEl.length) {
        speechdb.update({
            hasInput: 0,
            complete: 1
        });

        return;
    }

    currText = activeEl.val() + ' ' + text;
    activeEl.val(currText);
}

function read (command) {
    var number = command.num,
        text = '',
        speech;

    if (!isHighlighted && !number) {
        app.ask('Please select an element first');
        return;
    }
    else {
        if (number) {
            select(command, true);
        }

        text = $('.' + selectClass).val() || $('.' + selectClass).text();
console.log(text);
        speech = new SpeechSynthesisUtterance(text);

        synth.speak(speech);
    }

    complete(1);
}

function complete (flag) {
    speechdb.update({
        complete: flag
    });
}