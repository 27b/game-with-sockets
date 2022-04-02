import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Socket from './socket'
import Map from './socket'
import User from './user'


const socket = io();
const Socket = Socket(socket)
const user = new User(Socket);
const map = new Map("container", Socket);


user.check_if_username_is_valid();


// Set new user
socket.on("new_user", (new_user) => {
    if (new_user != "Username in use.") {
        user.set_username = new_user["username"];
        user.set_secret_key = new_user["secret_key"];
    } else {
        user.check_if_username_is_valid();
    }
    console.log(new_user);
});


// User controller
if (user.username !== null && user.secret_key !== null) {
    coordenates = user.get_position();
    document.addEventListener("keydown", (event) => {
        if (event.code) {
            console.log(event.code);
        }
    });
}
