import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Map from './map.js';
import User from './user.js';


const socket = io();
const user = new User(socket);
const map = new Map("container", socket);


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
