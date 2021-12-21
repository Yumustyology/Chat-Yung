const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

var url_string = window.location.href
var url = new URL(url_string)
var username = url.searchParams.get('username');

var room = url.searchParams.get('room');

console.log(username, room);

console.log(username, room)

// join chat room
socket.emit('joinroom', { username, room })

// Get Room and users
socket.on('roomUsers', ({ room, users})=>{
    outputRoomName(room)
    outputUsers(users)
})

// message from server
socket.on('message', message => {
    console.log(message)

    // outputMessage(message)
   if (message.username == username) {
        const div = document.createElement('div');
        div.classList.add('my-message')
        div.innerHTML = `
        <p class="meta"><name id='name'>You </name><span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
        `;
        document.querySelector('.chat-messages').appendChild(div);

    }else if(message.username == 'Yung-Chat Bot'){
        const div = document.createElement('div');
        div.classList.add('chat-bot')
        div.innerHTML = `
        <p class="meta"><name id='name'>${message.username} </name><span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
        `;
        document.querySelector('.chat-messages').appendChild(div);
    }else{

        const div = document.createElement('div');
        div.classList.add('message')
        div.innerHTML = `
        <p class="meta"><name id='name'>${message.username} </name><span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
        `;
        document.querySelector('.chat-messages').appendChild(div);
    }

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    // Emit message to server
    socket.emit('chatMessage', msg)

    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}


// Add users to dom
function outputUsers(users){
    userList.innerHTML = `${
        users.map(user => `<li>${user.username}</li>`).join('')
    }`
}
