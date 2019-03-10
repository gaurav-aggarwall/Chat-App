var socket = io();

socket.on('connect', () => {
    console.log('Connected to Sever');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Sever');
});

socket.on('newMessage', msg =>{
    let time = moment(msg.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template,{
        from: msg.from,
        createdAt: time,
        text: msg.text
    });

    $('#messages').append(html);
});

socket.on('newLocationMessage', msg =>{
    let time = moment(msg.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template,{
        from: msg.from,
        createdAt: time,
        url: msg.url
    });

    $('#messages').append(html);
});

$('#msgForm').on('submit', evt => {
    evt.preventDefault();
    let input = $('input[name="message"');
    socket.emit('createMessage', {
        from: 'User',
        text: input.val()
    }, () => {
        input.val('');
    });
});

let locationBtn = $('#location');
locationBtn.on('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser does not support GeoLocation API');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition( function(position){
        locationBtn.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            from: 'User',
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
    }, () => {
        alert('Unable to fetch the coordinates!. ');
        locationBtn.removeAttr('disabled').text('Send Location');
    });
});