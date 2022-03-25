import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const socket = io();

class User {

    constructor () {
        this.username = null
        this.secret_key = null
    }

    set_username(username) {
        this.username = username
    }

    set_secret_key(secret_key) {
        this.secret_key = secret_key
    }

    check_if_username_is_valid() {
        let username = prompt('Username:')
        socket.emit('new_user', username)
    }

    move_to(x, y) {
        socket.emit('user_direction', {
            'username': this.username,
            'secret_key': this.secret_key,
            'point': [x, y]
        })
    }

}

var user = new User()

user.check_if_username_is_valid()

// Socket receive messages:
socket.on('new_user', new_user => {
    if (new_user != 'Username in use.'){
        user.set_username = new_user['username']
        user.set_secret_key = new_user['secret_key']
    }
    else {
        user.check_if_username_is_valid()
    }
    console.log(new_user)
})