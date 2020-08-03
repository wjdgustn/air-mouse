window.onload = function() {
    var socket = io.connect(`${location.protocol}//${location.host}`, {
        path: '/socket.io'
    });

    window.addEventListener("deviceorientation", function (e) {
        socket.emit('msg', {
            "alpha": e.alpha,
            "beta": e.beta,
            "gamma": e.gamma
        });
    });

    document.getElementById('kill_server').onclick = function() {
        Request('POST', '/kill_server');
    }
    document.getElementById('left_click').onclick = function() {
        socket.emit('click', 'left');
    }
    document.getElementById('right_click').onclick = function() {
        socket.emit('click', 'right');
    }
    document.getElementById('double_click').onclick = function() {
        socket.emit('click', 'left_double');
    }
    socket.emit('click', 'hold_click_off');
    document.getElementById('hold_click').style.backgroundColor = '#FFFFFF';
    let hold_click = false;
    document.getElementById('hold_click').onclick = function() {
        if(hold_click) {
            socket.emit('click', 'hold_click_off');
            document.getElementById('hold_click').style.backgroundColor = '#FFFFFF';
            hold_click = false;
        }
        else {
            socket.emit('click', 'hold_click_on');
            document.getElementById('hold_click').style.backgroundColor = '#FF0000';
            hold_click = true;
        }
    }
}

function Request(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open( method , url , false );
    xhr.send( null );
    return xhr.responseText;
}