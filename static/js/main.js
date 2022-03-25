import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const socket = io();

var username = prompt('Username:')

var user_credentials = null

// Socket send messages:
socket.emit('new_user', username)

// Socket receive messages:
socket.on('new_user', new_user => {
    if (new_user != 'Username in use.'){
        user_credentials = new_user
    }
    else {
        username = prompt('Username:')
        socket.emit('new_user', username)

    }
    console.log(new_user)
})