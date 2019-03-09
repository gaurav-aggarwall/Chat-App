var socket = io();

socket.on('connect', () => {
    console.log('Connected to Sever');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Sever');
});

socket.on('newMessage', msg =>{
    console.log('New Message', msg);

    let li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    $('#messages').append(li);
});


$('#msgForm').on('submit', evt => {
    evt.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('input[name="message"').val()
    });
})