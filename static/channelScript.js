document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure button
    socket.on('connect', () => {
        const button = document.querySelector('#sendMessage');
        // Each button should emit a "submit vote" event
        button.onclick = function() {
                let message = document.querySelector("#messContent");
                socket.emit('send message', {'message': message.value, 'channel': button.dataset.channel});
                message.value = '';
            };
        });

    // When a message is announced append to div:
    socket.on('receive message', data => {
        const p = document.createElement('p');
        p.innerHTML = `${data.message}`;
        document.querySelector('#messageDiv').append(p);
    });
});
