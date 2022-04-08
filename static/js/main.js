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
        user.username = new_user["username"];
        user.secret_key = new_user["secret_key"];
        user.position = new_user["position"];
    } else {
        user.check_if_username_is_valid();
    }
    console.log(new_user);
});


// User controller
if (user.username !== null && user.secret_key !== null) {
    document.addEventListener("keydown", (event) => {
        
        let [x, y] = user.position

        if (event.code == 'ArrowUp') {
            user.move_to(x, y-1)
        }
        if (event.code == 'ArrowDown') {
            user.move_to(x, y+1)
        }
        if (event.code == 'ArrowLeft') {
            user.move_to(x-1, y)
        }
        if (event.code == 'ArrowRight') {
            user.move_to(x+1, y)
        }
    });
}
