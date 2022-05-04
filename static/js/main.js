import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Map from './map.js';
import User from './user.js';


const socket = io();

const container = document.getElementById("container");

const user = new User(socket);
const map = new Map(container, socket);

const username = localStorage.getItem('username');
const secret_key = localStorage.getItem('secret_key');


if (username && secret_key) {
    user.emit_with_credentials('user_is_authenticated', {});
} else {
    user.create_login_input();
}


// Sockets listening
socket.on('error', message => {
    console.log('SERVER ERROR: ' + message);
})


// User sockets
socket.on("new_user", new_user => {
    if (new_user != "Username in use.") {
        localStorage.setItem('username', new_user["username"]);
        localStorage.setItem('secret_key', new_user["secret_key"]);
        localStorage.setItem('position', JSON.stringify(new_user["position"]));
    } else {
        user.create_login_input();
    }
});

socket.on('user_is_authenticated', bool => {
    if (bool == false) {
        user.create_login_input();
    } else {
        console.log('The user has been logged.');
    }
})

socket.on('user_direction', position => {
    localStorage.setItem('position', JSON.stringify(position));
})


socket.on('users', array => {
    let username = user.get_credentials()['username'];
    if (!array.includes(username)) user.create_login_input();
})


// Map sockets
socket.on("map", data => {
    const username = user.get_credentials()['username'];
    const map = data;

    for (let y = 0; y < map.length; y++) {
        const row = container.children[y];

        for (let x = 0; x < row.children.length; x++) {
            const tile = row.children[x];
            const state = map[x][y];

            if (state) {
                if (state == username) {
                    tile.innerHTML = `
                    <div class="green" title="${state}">
                        <span class="hat"></span>
                        👀
                    </div>`;
                } else {
                    tile.innerHTML = `
                    <div class="red" title="${state}">
                        👺
                    </div>`;
                }
            } else {
                tile.innerHTML = "";
            }
        }
    }
});

socket.on("map_print_instructions", data => {
    const cols = data["cols"];
    const rows = data["rows"];
    const row_html = document.createElement("div");

    console.log(`Loading map with ${cols} columns and ${rows} rows`);

    for (let y = 0; y < rows; y++) {
        row_html.appendChild(document.createElement("div"));
    }

    for (let x = 0; x < cols; x++) {
        let new_row = row_html.cloneNode(true);
        container.appendChild(new_row);
    }
});



// Events
document.addEventListener("keydown", event => {        
    if (localStorage.getItem('username') !== null && 
        localStorage.getItem('secret_key') !== null) {
        let [x, y] = JSON.parse(localStorage.getItem('position'))

        if (event.code == 'ArrowUp') {
            user.move_to(x, y-1);
        }
        else if (event.code == 'ArrowDown') {
            user.move_to(x, y+1);
        }
        else if (event.code == 'ArrowLeft') {
            user.move_to(x-1, y);
        }
        else if (event.code == 'ArrowRight') {
            user.move_to(x+1, y);
        }
        else {
            // TODO
        }
    }
});
