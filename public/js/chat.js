var socket = io();

function scrollToBottom() {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);     
    }
}

socket.on('connect', () => {
    console.log('Connected to Sever');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Sever');
});

socket.on('newMessage', msg => {
    let time = moment(msg.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template,{
        from: msg.from,
        createdAt: time,
        text: msg.text
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', msg => {
    let time = moment(msg.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template,{
        from: msg.from,
        createdAt: time,
        url: msg.url
    });

    $('#messages').append(html);
    scrollToBottom();
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