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

socket.on('newLocationMessage', msg =>{
    console.log('New Loc Message', msg);

    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location: </a>'); 
    li.text(`${msg.from}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

$('#msgForm').on('submit', evt => {
    evt.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('input[name="message"').val()
    });
});

$('#location').on('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser does not support GeoLocation API');
    }

    navigator.geolocation.getCurrentPosition( function(position){
        socket.emit('createLocationMessage', {
            from: 'User',
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
    }, () => {
        alert('Unable to fetch the coordinates!. ');
    });
});